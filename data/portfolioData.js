// ============================================================
//  EDIT THIS FILE TO MAKE THE PORTFOLIO YOURS.
//  Nothing else needs to change — the components just read
//  from the objects below. Replace every PLACEHOLDER value.
// ============================================================

import certificateCompletion from "../src/src/assets/Certificate_of_Completion.png";
import certificateAi from "../src/src/assets/Kyle Maverick G._CR1271_certificate.png";
import certificateMl1273 from "../src/src/assets/Kyle Maverick G._CR1273_certificate.png";
import certificatePython from "../src/src/assets/Kyle Maverick G._CR641_certificate.png";
import certificateMl640 from "../src/src/assets/Kyle Maverick G._CR640_certificate.png";
import certificateLinux from "../src/src/assets/Kyle Maverick G._Roxas_Plesk Obsidian for Linux Expert Certification.png";
import certificateRoxas from "../src/src/assets/Certificate of Roxas.png";
import machineLearningBackground from "../src/src/assets/machine_learning.jpg";
import computerVisionBackground from "../src/src/assets/Computer_vision.png";
import nlpBackground from "../src/src/assets/NLP_Transformer.jpg";
import mlopsBackground from "../src/src/assets/MLops.jpg";

export const profile = {
  name: "Kyle Maverick G. Roxas",          // shown in the nav bar ("alex · rivera")
  role: "Machine Learning & AI Engineer", // small label above the headline
  headline: "I build models that learn the right thing.",
  lede: "Four years turning research papers into production models, from data pipelines to deployed inference.",
};

// Hero mini-chart labels (purely decorative text next to the SVG loss curve)
export const heroChart = {
  label: "training_loss.log",
  meta: "epoch 40/40",
};

// Each skill needs a name + a percentage (0-100) — used to draw the bar width
export const skills = [
  { name: "PyTorch", pct: 92 },
  { name: "TensorFlow", pct: 78 },
  { name: "Python", pct: 95 },
  { name: "Computer Vision", pct: 80 },
  { name: "NLP / Transformers", pct: 74 },
  { name: "MLOps / Docker", pct: 70 },
  { name: "SQL", pct: 85 },
  { name: "Data Engineering", pct: 68 },
];

// Small tag "pills" under the skill bars — just a flat list of tool names
export const toolbelt = [
  "NumPy", "Pandas", "scikit-learn", "Keras", "Hugging Face",
  "AWS SageMaker", "Docker", "Airflow", "Git", "Weights & Biases",
];

export const coreTechGroups = [
  {
    mark: "ML",
    title: "Machine Learning",
    description: "PyTorch, TensorFlow, scikit-learn, and transformer workflows.",
    background: machineLearningBackground,
  },
  {
    mark: "CV",
    title: "Computer Vision",
    description: "Image models, evaluation pipelines, and production inference.",
    background: computerVisionBackground,
  },
  {
    mark: "NLP",
    title: "NLP & Transformers",
    description: "Language modeling, embeddings, and Hugging Face tooling.",
    background: nlpBackground,
  },
  {
    mark: "OPS",
    title: "MLOps & Data",
    description: "Docker, Airflow, SageMaker, SQL, and reliable data pipelines.",
    background: mlopsBackground,
  },
];

export const projects = [
  {
    number: "01",
    visual: "signal",
    title: "Add project title",
    description: "Replace this description with the problem your project solves and the result it creates.",
    tags: ["Python", "PyTorch", "API"],
    problem: "Add the real problem statement",
    stack: "Add the main technologies",
    useCase: "Add the practical use case",
  },
  {
    number: "02",
    visual: "amber",
    title: "Add project title",
    description: "Use this space for a concise project summary, research note, or deployed system overview.",
    tags: ["Computer Vision", "Docker", "MLOps"],
    problem: "Add the real problem statement",
    stack: "Add the main technologies",
    useCase: "Add the practical use case",
  },
  {
    number: "03",
    visual: "teal",
    title: "Add project title",
    description: "Show what you built, what changed because of it, and where visitors can explore the work.",
    tags: ["NLP", "Transformers", "Data"],
    problem: "Add the real problem statement",
    stack: "Add the main technologies",
    useCase: "Add the practical use case",
  },
];

export const projectScreenshots = [
  { number: "01", title: "Add project screenshot", visual: "signal" },
  { number: "02", title: "Add project screenshot", visual: "amber" },
  { number: "03", title: "Add project screenshot", visual: "teal" },
  { number: "04", title: "Add project screenshot", visual: "violet" },
  { number: "05", title: "Add project screenshot", visual: "blue" },
  { number: "06", title: "Add project screenshot", visual: "green" },
];

// Timeline — add/remove objects freely, order top to bottom (most recent first)
export const experience = [
  {
    period: "2023 — Present",
    title: "Machine Learning Engineer",
    org: "Placeholder Robotics Co.",
    bullets: [
      "Shipped a computer vision model to production, cutting inference latency by 40%.",
      "Built the team's first automated retraining pipeline on SageMaker.",
    ],
  },
  {
    period: "2021 — 2023",
    title: "Data Scientist",
    org: "Placeholder Analytics Inc.",
    bullets: [
      "Developed forecasting models used across three product lines.",
      "Partnered with product to translate model outputs into shipped features.",
    ],
  },
  {
    period: "2019 — 2021",
    title: "Research Assistant, Applied ML Lab",
    org: "Placeholder University",
    bullets: [
      "Co-authored a paper on efficient training for small-data regimes.",
    ],
  },
];

// Certificates — the dedicated section you asked for.
// "status" is the little pill on each card (e.g. "verified", "in progress").
export const certificates = [
  {
    year: "2026",
    status: "verified",
    title: "Azure AI Fundamentals",
    issuer: "TESDA Online Program",
    id: "SVUsx3BA0g",
    asset: certificateCompletion,
    assetType: "image",
       field: "AI & Machine Learning",
  },
  {
    year: "2026",
    status: "verified",
    title: "Basics of Artificial Intelligence",
    issuer: "UniAthena with Cambridge International Qualifications",
    id: "CR1271",
    asset: certificateAi,
    assetType: "image",
       field: "AI & Machine Learning",
  },
  {
    year: "2026",
    status: "verified",
    title: "Basics of Machine Learning Algorithms",
    issuer: "UniAthena with Cambridge International Qualifications",
    id: "CR1273",
    asset: certificateMl1273,
    assetType: "image",
       field: "AI & Machine Learning",
  },
  {
    year: "2026",
    status: "verified",
    title: "Basics of Python",
    issuer: "UniAthena with Cambridge International Qualifications",
    id: "CR641",
    asset: certificatePython,
    assetType: "image",
       field: "Programming",
  },
  {
    year: "2026",
    status: "verified",
    title: "Basics of Machine Learning Algorithms",
    issuer: "UniAthena with Cambridge International Qualifications",
    id: "CR640",
    asset: certificateMl640,
    assetType: "image",
       field: "AI & Machine Learning",
  },
  {
    year: "2026",
    status: "verified",
    title: "Plesk Obsidian Linux Expert",
    issuer: "Plesk University",
    id: "PLESK-LINUX-EXPERT",
    asset: certificateLinux,
    assetType: "image",
    field: "IT Fundamentals / Other",
  },
  {
    year: "2024",
    status: "verified",
    title: "Tech-Preneurship: Empowering CCS Students for Innovative Ventures",
    issuer: "Quezon City University — College of Computer Studies",
    id: "ROXAS-TECH-PRENEURSHIP-2024",
    asset: certificateRoxas,
    assetType: "image",
    field: "IT Fundamentals / Other",
  },
];

export const contact = {
  heading: "Let's build something that learns well.",
  blurb: "Open to ML engineering roles, research collaborations, and consulting on production deep learning systems.",
  links: [
    { label: "Email", value: "roxas.kylemaverick.gudalle@gmail.com", href: "mailto:roxas.kylemaverick.gudalle@gmail.com" },
    { label: "LinkedIn", value: "/in/placeholder", href: "#" },
    { label: "GitHub", value: "/placeholder", href: "#" },
  ],
};
