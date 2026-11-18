const MODEL_ENDPOINT = "https://router.huggingface.co/v1/chat/completions";
const MAX_BODY_LENGTH = 16_000;
const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 1_200;
const MAX_CONVERSATION_LENGTH = 8_000;
const ALLOWED_LOCAL_ORIGINS = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

const SYSTEM_PROMPT = `You are the conversational portfolio assistant for Kyle Maverick G. Roxas, a Machine Learning & AI Engineer.

Be friendly, conversational, and concise. Answer general questions using your general knowledge. For questions about Kyle, use only the portfolio facts below. Never invent personal details, employers, accomplishments, model results, or project features. If the portfolio doesn't say, be honest and invite the visitor to contact Kyle. Do not claim to be Kyle.

PORTFOLIO FACTS
Projects:
- Tinayu: AI-assisted personal color analysis using facial landmarks and image color analysis; built with MediaPipe, OpenCV, FastAPI, and Next.js. It analyzes an image to suggest clothing, makeup, and accent colors.
- VeriSight: classifies images as AI-generated or real and uses Grad-CAM to visualize which regions influenced its prediction. Uses Python, PyTorch, ResNet18, Grad-CAM, and Gradio.
- Tina Build Coach: project dashboard with project pages and local ONNX model inference. Uses TypeScript, ONNX, Supabase, and Vite. The specific capabilities of the model are not documented.
- PyJect: a Google Colab-ready PyTorch notebook for tensor and machine-learning experiments.

Experience:
- 2025, Full-Stack Developer on a programming school platform; developed platform features including AI-code detection.
- 2025, Frontend Developer for the Barangay Talipapa Plant and Seed Exchange; built a frontend for a community inventory system tracking plant and seed stocks and supplies.
- 2024, Frontend Developer & Content Researcher for a mental wellness support platform; contributed frontend work and gathered information for book and movie recommendations, therapist contacts, and reflection and enjoyment activities.

Skills and tools listed on the portfolio include Python, PyTorch, TensorFlow, scikit-learn, Keras, OpenCV, MediaPipe, FastAPI, Next.js, TypeScript, ONNX, Supabase, Vite, NumPy, Pandas, Hugging Face, Docker, Airflow, Git, and Weights & Biases.

Contact: email roxas.kylemaverick.gudalle@gmail.com; LinkedIn linkedin.com/in/kyle-maverick-roxas-ab7994435; GitHub @roxaskylemaverickgudalle-ctrl.`;

function isAllowedOrigin(origin, allowedOrigin) {
  return !origin || origin === allowedOrigin || ALLOWED_LOCAL_ORIGINS.has(origin);
}

function setCorsHeaders(res, origin, allowedOrigin) {
  if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
  else if (allowedOrigin) res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Max-Age", "86400");
  res.setHeader("Vary", "Origin");
}

function sendJson(res, status, body) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return res.status(status).json(body);
}

function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return "Send between 1 and 12 chat messages.";
  }

  let totalLength = 0;
  for (const message of messages) {
    if (
      !message
      || (message.role !== "user" && message.role !== "assistant")
      || typeof message.content !== "string"
      || !message.content.trim()
      || message.content.length > MAX_MESSAGE_LENGTH
    ) {
      return "Each message must be non-empty text no longer than 1,200 characters.";
    }
    totalLength += message.content.length;
  }

  if (totalLength > MAX_CONVERSATION_LENGTH) {
    return "This conversation is too long. Start a new chat and try again.";
  }
  if (messages[messages.length - 1].role !== "user") {
    return "The last message must be from the user.";
  }
  return null;
}

module.exports = async function handler(req, res) {
  const allowedOrigin = process.env.CHAT_ALLOWED_ORIGIN
    || "https://roxaskylemaverickgudalle-ctrl.github.io";
  const origin = req.headers.origin;

  if (!isAllowedOrigin(origin, allowedOrigin)) {
    return sendJson(res, 403, { error: "This website isn't allowed to use the chat service." });
  }
  setCorsHeaders(res, origin, allowedOrigin);
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return sendJson(res, 405, { error: "Use POST to send a chat message." });
  }

  const declaredLength = Number(req.headers["content-length"] || 0);
  if (declaredLength > MAX_BODY_LENGTH) {
    return sendJson(res, 413, { error: "That message is too large." });
  }

  let body = req.body;
  if (typeof body === "string") {
    if (Buffer.byteLength(body, "utf8") > MAX_BODY_LENGTH) {
      return sendJson(res, 413, { error: "That message is too large." });
    }
    try {
      body = JSON.parse(body);
    } catch {
      return sendJson(res, 400, { error: "The request body must be valid JSON." });
    }
  } else if (body && Buffer.byteLength(JSON.stringify(body), "utf8") > MAX_BODY_LENGTH) {
    return sendJson(res, 413, { error: "That message is too large." });
  }

  const validationError = validateMessages(body?.messages);
  if (validationError) {
    return sendJson(res, 400, { error: validationError });
  }
  if (!process.env.HF_TOKEN) {
    return sendJson(res, 503, { error: "The chat service isn't configured yet. Add its Hugging Face token in Vercel." });
  }

  let upstream;
  try {
    upstream = await fetch(MODEL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.HF_MODEL || "meta-llama/Llama-3.1-8B-Instruct",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...body.messages,
        ],
        max_tokens: 350,
        temperature: 0.6,
        stream: false,
      }),
      signal: AbortSignal.timeout(55_000),
    });
  } catch (error) {
    console.error("Hugging Face request failed", error instanceof Error ? error.name : "UnknownError");
    return sendJson(res, 502, { error: "The model couldn't be reached. Please try again shortly." });
  }

  if (!upstream.ok) {
    console.error("Hugging Face returned an error", upstream.status);
    const status = upstream.status === 429 ? 429 : 502;
    const error = status === 429
      ? "The model is receiving too many requests. Please wait a moment and try again."
      : "The model service couldn't complete that request. Check the Hugging Face model access and billing setup.";
    return sendJson(res, status, { error });
  }

  let result;
  try {
    result = await upstream.json();
  } catch {
    console.error("Hugging Face returned invalid JSON");
    return sendJson(res, 502, { error: "The model returned an invalid response. Please try again." });
  }

  const reply = result?.choices?.[0]?.message?.content;
  if (typeof reply !== "string" || !reply.trim()) {
    console.error("Hugging Face response did not contain a text reply");
    return sendJson(res, 502, { error: "The model returned an empty response. Please try again." });
  }

  return sendJson(res, 200, { reply: reply.trim() });
};
