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
import certificateConfluent from "../src/src/assets/KYLE MAVERICK ROXAS_signed.png";
import certificateThreats from "../src/src/assets/Certificate_ai_data.png";
import machineLearningBackground from "../src/src/assets/machine_learning.jpg";
import computerVisionBackground from "../src/src/assets/Computer_vision.png";
import nlpBackground from "../src/src/assets/NLP_Transformer.jpg";
import mlopsBackground from "../src/src/assets/MLops.jpg";
import numpyLogo from "../src/src/assets/numpy.png";
import pandasLogo from "../src/src/assets/pandas.jpg";
import scikitLearnLogo from "../src/src/assets/scikit-learn-logo.png";
import kerasLogo from "../src/src/assets/keras.webp";
import huggingFaceLogo from "../src/src/assets/huggingface.png";
import dockerLogo from "../src/src/assets/docker.png";
import airflowLogo from "../src/src/assets/apache-airflow.png";
import gitLogo from "../src/src/assets/Git-Icon-1788C.png";
import weightsBiasesLogo from "../src/src/assets/weightsnbiases.png";
import tensorflowLogo from "../src/src/assets/tensorflow.png";
import pythonLogo from "../src/src/assets/pythonlogo.png";
import pytorchLogo from "../src/src/assets/pytorchlogo.png";
import openCvLogo from "../src/src/assets/opencvlogo.png";
import mediaPipeLogo from "../src/src/assets/mediapipelogo.png";
import fastApiLogo from "../src/src/assets/fastapi.png";
import googleColabLogo from "../src/src/assets/googlecolab.png";
import supabaseLogo from "../src/src/assets/supabase.jpeg";

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
  { name: "NumPy", logo: numpyLogo },
  { name: "Pandas", logo: pandasLogo },
  { name: "scikit-learn", logo: scikitLearnLogo },
  { name: "Keras", logo: kerasLogo },
  { name: "Hugging Face", logo: huggingFaceLogo },
  { name: "Docker", logo: dockerLogo },
  { name: "Airflow", logo: airflowLogo },
  { name: "Git", logo: gitLogo },
  { name: "Weights & Biases", logo: weightsBiasesLogo },
  { name: "TensorFlow", logo: tensorflowLogo },
  { name: "Python", logo: pythonLogo },
  { name: "PyTorch", logo: pytorchLogo },
  { name: "OpenCV", logo: openCvLogo },
  { name: "MediaPipe", logo: mediaPipeLogo },
  { name: "FastAPI", logo: fastApiLogo },
  { name: "Google Colab", logo: googleColabLogo },
  { name: "Supabase", logo: supabaseLogo },
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
    mark: "TY",
    title: "Tinayu",
    description: "AI-assisted personal color analysis that turns a photo into tailored clothing, makeup, and accent color recommendations.",
    tags: ["Python", "MediaPipe", "OpenCV", "Next.js"],
    problem: "Make personal color analysis more accessible than a manual consultation.",
    stack: "MediaPipe facial landmarks, OpenCV color analysis, FastAPI, and Next.js.",
    useCase: "Analyze a webcam capture or uploaded image and get a personalized color profile.",
    href: "https://github.com/roxaskylemaverickgudalle-ctrl/Tinayu",
  },
  {
    number: "02",
    visual: "amber",
    mark: "VS",
    title: "VeriSight",
    description: "Classifies images as AI-generated or real and uses Grad-CAM to show which image regions influenced the prediction.",
    tags: ["Python", "PyTorch", "ResNet18", "Grad-CAM", "Gradio"],
    problem: "Help people inspect whether an image may be synthetic instead of returning only a label.",
    stack: "ImageNet-pretrained ResNet18, transfer learning, and Grad-CAM.",
    useCase: "Upload an image to receive a classification, confidence score, and visual explanation.",
    href: "https://github.com/roxaskylemaverickgudalle-ctrl/VeriSight",
  },
  {
    number: "03",
    visual: "teal",
    mark: "TB",
    title: "Tina Build Coach",
    description: "A project dashboard with project pages and local ONNX model inference.",
    tags: ["TypeScript", "ONNX", "Supabase", "Vite"],
    problem: "Bring project workflows and local model inference into one interface.",
    stack: "Vite frontend, Supabase configuration, and a locally served ONNX model.",
    useCase: "Explore a project dashboard and run the Tina model locally in the frontend.",
    href: "https://github.com/roxaskylemaverickgudalle-ctrl/Tina-Model",
  },
  {
    number: "04",
    visual: "violet",
    mark: "PT",
    title: "PyJect — PyTorch Notebook",
    description: "A Google Colab-ready notebook for experimenting with PyTorch and tensor-based machine learning workflows.",
    tags: ["Python", "PyTorch", "Jupyter", "Google Colab"],
    problem: "Provide a notebook workspace for hands-on PyTorch experimentation.",
    stack: "Python and PyTorch in a Jupyter/Google Colab notebook.",
    useCase: "Open the notebook in GitHub or launch it in Google Colab.",
    href: "https://github.com/roxaskylemaverickgudalle-ctrl/Pytorch-Project",
  },
];

export const projectGallery = projects.map(({ number, title }) => ({
  number,
  title,
  image: null,
}));

// Timeline — add/remove objects freely, order top to bottom (most recent first)
export const experience = [
  {
    period: "2025",
    title: "Full-Stack Developer",
    org: "Programming School Platform",
    bullets: [
      "Developed a platform for a programming school.",
      "Built an AI-code detection feature to help identify AI-generated code.",
    ],
  },
  {
    period: "2025",
    title: "Frontend Developer",
    org: "Barangay Talipapa Plant and Seed Exchange",
    bullets: [
      "Built the frontend for a community inventory system used by barangay officials to track plant and seed exchange stocks and supplies.",
    ],
  },
  {
    period: "2024",
    title: "Frontend Developer & Content Researcher",
    org: "Mental Wellness Support Platform",
    bullets: [
      "Gathered and organized information for a platform featuring book and movie recommendations, therapist contacts, and activities for reflection and enjoyment.",
      "Contributed to building the platform's frontend.",
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
  {
    year: "2026",
    status: "verified",
    title: "Understanding Threats and Attacks",
    issuer: "DICT Region III and Cisco Networking Academy",
    id: "2026-09-ZMB-DL-01-OL-042",
    asset: certificateConfluent,
    assetType: "image",
    field: "IT Fundamentals / Other",
  },
  {
    year: "2026",
    status: "verified",
    title: "Data Streaming Engineer Foundations",
    issuer: "Confluent",
    id: "CONFLUENT-194818543",
    asset: certificateThreats,
    assetType: "image", 
    field: "IT Fundamentals / Other",
  },
];

export const contact = {
  heading: "Let's build something that learns well.",
  blurb: "Open to ML engineering roles, research collaborations, and consulting on production deep learning systems.",
  links: [
    { label: "Email", value: "roxas.kylemaverick.gudalle@gmail.com", href: "mailto:roxas.kylemaverick.gudalle@gmail.com" },
    { label: "LinkedIn", value: "linkedin.com/in/kyle-maverick-roxas-ab7994435", href: "https://www.linkedin.com/in/kyle-maverick-roxas-ab7994435/" },
    { label: "GitHub", value: "@roxaskylemaverickgudalle-ctrl", href: "https://github.com/roxaskylemaverickgudalle-ctrl" },
  ],
};
