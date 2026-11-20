import portfolioData from "../data/portfolioAssistantData.json";

export const PORTFOLIO_ASSISTANT_SYSTEM_PROMPT = `You are the AI assistant representing Kyle Roxas's portfolio, not Kyle himself. Answer only with facts from the provided portfolio information. If the information needed is unavailable, politely say so and suggest contacting Kyle. Keep answers concise, professional, and clear.`;

const MODEL_ID = "Xenova/all-MiniLM-L6-v2";
const MINIMUM_SIMILARITY = 0.32;
const QUERY_STOP_WORDS = new Set([
  "a", "about", "an", "and", "are", "can", "did", "do", "does", "for", "from",
  "he", "her", "his", "i", "in", "is", "it", "its", "kyle", "me", "of", "on",
  "or", "please", "tell", "that", "the", "their", "them", "they", "this", "to",
  "use", "used", "uses", "was", "what", "when", "where", "which", "who", "why",
  "with", "would", "you",
]);
let extractorPromise;
let indexedFactsPromise;
let modelReady = false;

export function isPortfolioModelReady() {
  return modelReady;
}

function createFacts() {
  return [
    {
      title: "Professional profile",
      content: `${portfolioData.role}. ${portfolioData.summary}`,
    },
    {
      title: "Projects",
      content: `Projects: ${portfolioData.projects.map(({ name }) => name).join(", ")}.`,
    },
    ...portfolioData.projects.map((project) => ({
      title: project.name,
      content: `${project.name}: ${project.description} Technologies: ${project.technology.join(", ")}.`,
    })),
    ...portfolioData.experience.map((item) => ({
      title: `${item.period} experience — ${item.role}`,
      content: `${item.role} (${item.period}) on ${item.project}: ${item.details}`,
    })),
    {
      title: "Skills and tools",
      content: `Skills and tools: ${portfolioData.skills.join(", ")}.`,
    },
    {
      title: "Certifications",
      content: `Certifications: ${portfolioData.certifications.join("; ")}.`,
    },
    {
      title: "Contact",
      content: `Contact Kyle by email at ${portfolioData.contact.email}, LinkedIn at ${portfolioData.contact.linkedin}, or GitHub at ${portfolioData.contact.github}.`,
    },
  ];
}

async function loadExtractor(onProgress) {
  if (!extractorPromise) {
    extractorPromise = import("@huggingface/transformers")
      .then(({ env, pipeline }) => {
        env.allowLocalModels = false;
        env.useBrowserCache = true;
        return pipeline("feature-extraction", MODEL_ID, {
          dtype: "int8",
          progress_callback: onProgress,
        });
      })
      .then((extractor) => {
        modelReady = true;
        return extractor;
      })
      .catch((error) => {
        extractorPromise = undefined;
        indexedFactsPromise = undefined;
        throw error;
      });
  }
  return extractorPromise;
}

async function embedTexts(extractor, texts) {
  const embeddings = await extractor(texts, { pooling: "mean", normalize: true });
  const vectorSize = embeddings.dims[embeddings.dims.length - 1];
  return texts.map((_, index) => (
    embeddings.data.slice(index * vectorSize, (index + 1) * vectorSize)
  ));
}

async function getIndexedFacts(extractor) {
  if (!indexedFactsPromise) {
    indexedFactsPromise = (async () => {
      const facts = createFacts();
      const vectors = await embedTexts(extractor, facts.map(({ title, content }) => `${title}. ${content}`));
      return facts.map((fact, index) => ({ ...fact, vector: vectors[index] }));
    })().catch((error) => {
      indexedFactsPromise = undefined;
      throw error;
    });
  }
  return indexedFactsPromise;
}

function cosineSimilarity(first, second) {
  let score = 0;
  for (let index = 0; index < first.length; index += 1) {
    score += first[index] * second[index];
  }
  return score;
}

function normalizeSearchText(text) {
  return text.toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word && !QUERY_STOP_WORDS.has(word))
    .join(" ");
}

function createSearchQuery(messages) {
  const currentQuestion = messages.at(-1)?.text?.trim() || "";
  const previousQuestion = messages.slice(0, -1).reverse()
    .find((message) => message.role === "user")?.text?.trim();
  const isFollowUp = /\b(it|its|they|them|that|those|their)\b/i.test(currentQuestion) && previousQuestion;
  const query = isFollowUp ? `${previousQuestion} ${currentQuestion}` : currentQuestion;
  const normalizedQuery = normalizeSearchText(query);
  if (normalizedQuery) return normalizedQuery;
  return /\b(who|about|introduce|background)\b/i.test(currentQuestion)
    ? "professional role background"
    : "portfolio information";
}

function isProfileQuestion(question) {
  return /\b(who is|who's|introduce)\b|\btell me about kyle\b/i.test(question);
}

function formatGroundedReply(matches) {
  if (matches.length === 0 || matches[0].score < MINIMUM_SIMILARITY) {
    return "I’m sorry, that information isn’t available in Kyle’s portfolio. You can contact him using the links in the Contact section.";
  }

  const bestScore = matches[0].score;
  const relevantMatches = matches
    .filter(({ score }) => score >= Math.max(MINIMUM_SIMILARITY, bestScore - 0.08))
    .slice(0, 3);
  const projectSummary = relevantMatches.find(({ fact }) => fact.title === "Projects");
  const relevantFacts = projectSummary
    ? [projectSummary.fact.content]
    : relevantMatches.map(({ fact }) => fact.content);

  return `According to Kyle’s portfolio:\n${relevantFacts.join("\n")}`;
}

async function getPortfolioMatches(messages, onProgress) {
  const extractor = await loadExtractor(onProgress);
  const indexedFacts = await getIndexedFacts(extractor);
  const searchQuery = createSearchQuery(messages);
  const [queryVector] = await embedTexts(extractor, [searchQuery]);
  const question = messages.at(-1)?.text || "";
  const year = searchQuery.match(/\b20\d{2}\b/)?.[0];
  const matches = indexedFacts
    .map((fact) => ({
      title: fact.title,
      content: fact.content,
      score: cosineSimilarity(queryVector, fact.vector)
        + (searchQuery.includes(normalizeSearchText(fact.title)) ? 0.4 : 0)
        + (year && fact.title.includes(year) ? 0.45 : 0),
    }))
    .sort((first, second) => second.score - first.score);
  if (isProfileQuestion(question)) {
    return matches.filter((fact) => fact.title === "Professional profile");
  }
  return matches;
}

export async function generatePortfolioReply(messages, onProgress) {
  const matches = (await getPortfolioMatches(messages, onProgress))
    .map((match) => ({
      fact: { title: match.title, content: match.content },
      score: match.score,
    }));
  const reply = formatGroundedReply(matches);
  if (!reply.trim()) {
    throw new Error("The local model returned an empty response. Please try asking another way.");
  }
  return reply;
}
