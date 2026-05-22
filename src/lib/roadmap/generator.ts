import { loadAssessmentResult } from "@/lib/assessment/storage";
import type {
  CareerRoadmap,
  CertificationSuggestion,
  LearningPathItem,
  ProjectRecommendation,
  RoadmapPhase,
  RoadmapTrackId,
  SkillCard,
} from "./types";

export const ROADMAP_TRACKS: {
  id: RoadmapTrackId;
  label: string;
  emoji: string;
  description: string;
}[] = [
  {
    id: "ai-ml",
    label: "AI / ML Engineer",
    emoji: "🤖",
    description: "Models, MLOps, and production AI systems",
  },
  {
    id: "fullstack",
    label: "Full-Stack Developer",
    emoji: "⚡",
    description: "End-to-end web apps and APIs",
  },
  {
    id: "cybersecurity",
    label: "Cybersecurity",
    emoji: "🔐",
    description: "Threat modeling, audits, and secure design",
  },
  {
    id: "data-science",
    label: "Data Scientist",
    emoji: "📊",
    description: "Statistics, visualization, and decision science",
  },
  {
    id: "product",
    label: "Product Engineer",
    emoji: "🎯",
    description: "User-loved features with technical depth",
  },
  {
    id: "devops",
    label: "DevOps / SRE",
    emoji: "☁️",
    description: "Reliability, automation, and cloud platforms",
  },
];

const TRACK_TO_ASSESSMENT: Partial<Record<string, RoadmapTrackId>> = {
  "ai-ml": "ai-ml",
  "fullstack": "fullstack",
  "security": "cybersecurity",
  "data-scientist": "data-science",
  "product-engineer": "product",
  "devops-sre": "devops",
};

function phasesForTrack(trackId: RoadmapTrackId): RoadmapPhase[] {
  const base: Record<RoadmapTrackId, RoadmapPhase[]> = {
    "ai-ml": [
      {
        id: "p1",
        title: "Foundation",
        subtitle: "Math, Python, and ML intuition",
        durationWeeks: 8,
        milestones: [
          { id: "m1", title: "Linear algebra refresh", description: "Vectors, matrices, eigenvalues for ML", estimatedWeeks: 2 },
          { id: "m2", title: "Python for data science", description: "NumPy, Pandas, visualization basics", estimatedWeeks: 3 },
          { id: "m3", title: "Supervised learning core", description: "Regression, classification, evaluation metrics", estimatedWeeks: 3 },
        ],
      },
      {
        id: "p2",
        title: "Applied ML",
        subtitle: "Deep learning and model lifecycle",
        durationWeeks: 10,
        milestones: [
          { id: "m4", title: "Neural networks & PyTorch", description: "CNNs, training loops, GPU basics", estimatedWeeks: 4 },
          { id: "m5", title: "NLP or vision specialization", description: "Transformers or computer vision pipeline", estimatedWeeks: 3 },
          { id: "m6", title: "Experiment tracking", description: "MLflow, reproducibility, hyperparameter tuning", estimatedWeeks: 3 },
        ],
      },
      {
        id: "p3",
        title: "Production AI",
        subtitle: "Deploy, monitor, and ship",
        durationWeeks: 8,
        milestones: [
          { id: "m7", title: "Model serving", description: "FastAPI, batch vs real-time inference", estimatedWeeks: 3 },
          { id: "m8", title: "MLOps fundamentals", description: "CI/CD for models, drift monitoring", estimatedWeeks: 3 },
          { id: "m9", title: "Capstone deployment", description: "End-to-end AI product on cloud", estimatedWeeks: 2 },
        ],
      },
    ],
    fullstack: [
      {
        id: "p1",
        title: "Core Web",
        subtitle: "HTML, CSS, JavaScript mastery",
        durationWeeks: 6,
        milestones: [
          { id: "m1", title: "Modern JavaScript", description: "ES6+, async, DOM, fetch API", estimatedWeeks: 2 },
          { id: "m2", title: "React fundamentals", description: "Components, hooks, state management", estimatedWeeks: 2 },
          { id: "m3", title: "Responsive UI craft", description: "Tailwind, accessibility, design systems", estimatedWeeks: 2 },
        ],
      },
      {
        id: "p2",
        title: "Backend & Data",
        subtitle: "APIs, databases, auth",
        durationWeeks: 8,
        milestones: [
          { id: "m4", title: "REST & Node/Express", description: "Routing, middleware, validation", estimatedWeeks: 3 },
          { id: "m5", title: "SQL + ORM", description: "Postgres, migrations, relations", estimatedWeeks: 3 },
          { id: "m6", title: "Auth & security", description: "JWT, OAuth, OWASP basics", estimatedWeeks: 2 },
        ],
      },
      {
        id: "p3",
        title: "Ship & Scale",
        subtitle: "Deploy full products",
        durationWeeks: 6,
        milestones: [
          { id: "m7", title: "Full-stack integration", description: "TanStack Query, error boundaries", estimatedWeeks: 2 },
          { id: "m8", title: "Cloud deploy", description: "Vercel/Cloudflare, env config", estimatedWeeks: 2 },
          { id: "m9", title: "Portfolio capstone", description: "Production SaaS-style project", estimatedWeeks: 2 },
        ],
      },
    ],
    cybersecurity: [
      {
        id: "p1",
        title: "Security Foundations",
        subtitle: "Networks, Linux, and threats",
        durationWeeks: 8,
        milestones: [
          { id: "m1", title: "Networking essentials", description: "TCP/IP, DNS, firewalls", estimatedWeeks: 3 },
          { id: "m2", title: "Linux & scripting", description: "Bash, permissions, log analysis", estimatedWeeks: 2 },
          { id: "m3", title: "Threat landscape", description: "OWASP Top 10, attack vectors", estimatedWeeks: 3 },
        ],
      },
      {
        id: "p2",
        title: "Offensive & Defensive",
        subtitle: "Hands-on security practice",
        durationWeeks: 10,
        milestones: [
          { id: "m4", title: "Pen testing basics", description: "Recon, scanning, ethical scope", estimatedWeeks: 4 },
          { id: "m5", title: "Secure coding", description: "Input validation, crypto, secrets", estimatedWeeks: 3 },
          { id: "m6", title: "SIEM & incident response", description: "Detection, triage, playbooks", estimatedWeeks: 3 },
        ],
      },
      {
        id: "p3",
        title: "Enterprise Ready",
        subtitle: "Governance and certifications",
        durationWeeks: 6,
        milestones: [
          { id: "m7", title: "Risk assessment", description: "Threat modeling, compliance basics", estimatedWeeks: 2 },
          { id: "m8", title: "Security architecture", description: "Zero trust, IAM, cloud security", estimatedWeeks: 2 },
          { id: "m9", title: "Blue team capstone", description: "Lab report + remediation plan", estimatedWeeks: 2 },
        ],
      },
    ],
    "data-science": [
      {
        id: "p1",
        title: "Data Fluency",
        subtitle: "SQL, stats, and visualization",
        durationWeeks: 8,
        milestones: [
          { id: "m1", title: "SQL mastery", description: "Joins, windows, optimization", estimatedWeeks: 3 },
          { id: "m2", title: "Statistics for DS", description: "Distributions, hypothesis testing", estimatedWeeks: 3 },
          { id: "m3", title: "Visualization storytelling", description: "Matplotlib, Plotly, dashboards", estimatedWeeks: 2 },
        ],
      },
      {
        id: "p2",
        title: "Modeling",
        subtitle: "ML for insights",
        durationWeeks: 8,
        milestones: [
          { id: "m4", title: "Feature engineering", description: "Pipelines, encoding, leakage", estimatedWeeks: 3 },
          { id: "m5", title: "Classical ML", description: "Ensembles, cross-validation", estimatedWeeks: 3 },
          { id: "m6", title: "Time series / NLP intro", description: "Forecasting or text analytics", estimatedWeeks: 2 },
        ],
      },
      {
        id: "p3",
        title: "Decision Science",
        subtitle: "Stakeholder impact",
        durationWeeks: 6,
        milestones: [
          { id: "m7", title: "A/B testing", description: "Experiment design, power analysis", estimatedWeeks: 2 },
          { id: "m8", title: "Executive narratives", description: "Deck building, metric frameworks", estimatedWeeks: 2 },
          { id: "m9", title: "Analytics capstone", description: "End-to-end business case study", estimatedWeeks: 2 },
        ],
      },
    ],
    product: [
      {
        id: "p1",
        title: "Product Sense",
        subtitle: "Users, metrics, discovery",
        durationWeeks: 6,
        milestones: [
          { id: "m1", title: "User research", description: "Interviews, personas, journey maps", estimatedWeeks: 2 },
          { id: "m2", title: "Metrics that matter", description: "North star, funnels, retention", estimatedWeeks: 2 },
          { id: "m3", title: "PRD writing", description: "Scope, acceptance criteria, trade-offs", estimatedWeeks: 2 },
        ],
      },
      {
        id: "p2",
        title: "Technical Delivery",
        subtitle: "Ship with engineering",
        durationWeeks: 8,
        milestones: [
          { id: "m4", title: "Full-stack literacy", description: "APIs, React, data models", estimatedWeeks: 3 },
          { id: "m5", title: "Agile & roadmapping", description: "Sprints, prioritization frameworks", estimatedWeeks: 3 },
          { id: "m6", title: "Prototyping", description: "Figma, clickable demos", estimatedWeeks: 2 },
        ],
      },
      {
        id: "p3",
        title: "Growth & Launch",
        subtitle: "Go-to-market execution",
        durationWeeks: 6,
        milestones: [
          { id: "m7", title: "Launch playbook", description: "Beta, feedback loops, iteration", estimatedWeeks: 2 },
          { id: "m8", title: "Growth experiments", description: "Activation, onboarding optimization", estimatedWeeks: 2 },
          { id: "m9", title: "Product capstone", description: "0→1 feature with measurable impact", estimatedWeeks: 2 },
        ],
      },
    ],
    devops: [
      {
        id: "p1",
        title: "Infrastructure Basics",
        subtitle: "Linux, networking, scripting",
        durationWeeks: 6,
        milestones: [
          { id: "m1", title: "Linux administration", description: "Systemd, packages, users", estimatedWeeks: 2 },
          { id: "m2", title: "Networking for SRE", description: "Load balancers, DNS, TLS", estimatedWeeks: 2 },
          { id: "m3", title: "Scripting automation", description: "Python/Bash for ops tasks", estimatedWeeks: 2 },
        ],
      },
      {
        id: "p2",
        title: "Cloud & Containers",
        subtitle: "Docker, K8s, IaC",
        durationWeeks: 10,
        milestones: [
          { id: "m4", title: "Docker & compose", description: "Images, volumes, multi-service", estimatedWeeks: 3 },
          { id: "m5", title: "Kubernetes core", description: "Pods, services, deployments", estimatedWeeks: 4 },
          { id: "m6", title: "Terraform / IaC", description: "Modules, state, cloud resources", estimatedWeeks: 3 },
        ],
      },
      {
        id: "p3",
        title: "Reliability Engineering",
        subtitle: "SLOs, observability, incidents",
        durationWeeks: 8,
        milestones: [
          { id: "m7", title: "CI/CD pipelines", description: "GitHub Actions, blue-green deploys", estimatedWeeks: 3 },
          { id: "m8", title: "Observability stack", description: "Metrics, logs, traces, alerting", estimatedWeeks: 3 },
          { id: "m9", title: "SRE capstone", description: "Incident runbook + postmortem", estimatedWeeks: 2 },
        ],
      },
    ],
  };
  return base[trackId];
}

function skillsForTrack(trackId: RoadmapTrackId): SkillCard[] {
  const map: Record<RoadmapTrackId, SkillCard[]> = {
    "ai-ml": [
      { id: "s1", name: "Python", level: "intermediate", category: "Language", hours: 40, resources: ["Official docs", "100 Days of Code"] },
      { id: "s2", name: "PyTorch", level: "intermediate", category: "Framework", hours: 60, resources: ["PyTorch tutorials", "fast.ai"] },
      { id: "s3", name: "Statistics", level: "beginner", category: "Math", hours: 30, resources: ["Khan Academy", "StatQuest"] },
      { id: "s4", name: "MLOps", level: "advanced", category: "Ops", hours: 35, resources: ["Made With ML", "MLflow docs"] },
    ],
    fullstack: [
      { id: "s1", name: "TypeScript", level: "intermediate", category: "Language", hours: 35, resources: ["TS Handbook", "Total TypeScript"] },
      { id: "s2", name: "React", level: "intermediate", category: "Frontend", hours: 50, resources: ["React docs", "Epic React"] },
      { id: "s3", name: "Node.js", level: "intermediate", category: "Backend", hours: 40, resources: ["Node.js docs", "Express guide"] },
      { id: "s4", name: "PostgreSQL", level: "beginner", category: "Database", hours: 25, resources: ["Postgres tutorial", "SQLBolt"] },
    ],
    cybersecurity: [
      { id: "s1", name: "Networking", level: "intermediate", category: "Foundation", hours: 30, resources: ["Professor Messer", "TryHackMe"] },
      { id: "s2", name: "Linux CLI", level: "intermediate", category: "Ops", hours: 25, resources: ["OverTheWire", "Linux Journey"] },
      { id: "s3", name: "Pen Testing", level: "advanced", category: "Offensive", hours: 55, resources: ["HTB Academy", "OSCP prep"] },
      { id: "s4", name: "Secure Coding", level: "intermediate", category: "Defensive", hours: 30, resources: ["OWASP WebGoat", "PortSwigger"] },
    ],
    "data-science": [
      { id: "s1", name: "SQL", level: "intermediate", category: "Data", hours: 30, resources: ["Mode SQL", "LeetCode DB"] },
      { id: "s2", name: "Pandas", level: "intermediate", category: "Tools", hours: 35, resources: ["Kaggle micro-courses"] },
      { id: "s3", name: "Scikit-learn", level: "intermediate", category: "ML", hours: 40, resources: ["Andrew Ng course", "Hands-On ML"] },
      { id: "s4", name: "Tableau / BI", level: "beginner", category: "Viz", hours: 20, resources: ["Tableau Public", "Looker docs"] },
    ],
    product: [
      { id: "s1", name: "User Research", level: "beginner", category: "Discovery", hours: 20, resources: ["NN/g articles", "Maze guides"] },
      { id: "s2", name: "Figma", level: "intermediate", category: "Design", hours: 30, resources: ["Figma Academy", "UI prep"] },
      { id: "s3", name: "Analytics", level: "intermediate", category: "Metrics", hours: 25, resources: ["Amplitude guides", "Mixpanel"] },
      { id: "s4", name: "Technical Writing", level: "intermediate", category: "Communication", hours: 15, resources: ["PRD templates", "Lenny's Newsletter"] },
    ],
    devops: [
      { id: "s1", name: "Docker", level: "intermediate", category: "Containers", hours: 25, resources: ["Docker docs", "Play with Docker"] },
      { id: "s2", name: "Kubernetes", level: "advanced", category: "Orchestration", hours: 60, resources: ["K8s.io", "KillerCoda"] },
      { id: "s3", name: "Terraform", level: "intermediate", category: "IaC", hours: 35, resources: ["HashiCorp learn", "Terraform Up & Running"] },
      { id: "s4", name: "Prometheus", level: "intermediate", category: "Observability", hours: 25, resources: ["Prometheus docs", "Grafana labs"] },
    ],
  };
  return map[trackId];
}

function certsForTrack(trackId: RoadmapTrackId): CertificationSuggestion[] {
  const map: Record<RoadmapTrackId, CertificationSuggestion[]> = {
    "ai-ml": [
      { id: "c1", name: "TensorFlow Developer", provider: "Google", relevance: 88, estimatedMonths: 3 },
      { id: "c2", name: "AWS ML Specialty", provider: "Amazon", relevance: 82, estimatedMonths: 4 },
      { id: "c3", name: "Deep Learning Specialization", provider: "Coursera", relevance: 90, estimatedMonths: 5 },
    ],
    fullstack: [
      { id: "c1", name: "Meta Front-End Professional", provider: "Coursera", relevance: 85, estimatedMonths: 4 },
      { id: "c2", name: "AWS Cloud Practitioner", provider: "Amazon", relevance: 78, estimatedMonths: 2 },
    ],
    cybersecurity: [
      { id: "c1", name: "CompTIA Security+", provider: "CompTIA", relevance: 92, estimatedMonths: 3 },
      { id: "c2", name: "CEH", provider: "EC-Council", relevance: 80, estimatedMonths: 4 },
      { id: "c3", name: "OSCP", provider: "Offensive Security", relevance: 95, estimatedMonths: 6 },
    ],
    "data-science": [
      { id: "c1", name: "Google Data Analytics", provider: "Coursera", relevance: 86, estimatedMonths: 4 },
      { id: "c2", name: "IBM Data Science", provider: "Coursera", relevance: 84, estimatedMonths: 5 },
    ],
    product: [
      { id: "c1", name: "Product Management Certificate", provider: "Product School", relevance: 88, estimatedMonths: 3 },
      { id: "c2", name: "Pragmatic Institute PMC", provider: "Pragmatic", relevance: 82, estimatedMonths: 2 },
    ],
    devops: [
      { id: "c1", name: "CKA", provider: "CNCF", relevance: 94, estimatedMonths: 4 },
      { id: "c2", name: "AWS Solutions Architect", provider: "Amazon", relevance: 90, estimatedMonths: 5 },
      { id: "c3", name: "HashiCorp Terraform Associate", provider: "HashiCorp", relevance: 85, estimatedMonths: 2 },
    ],
  };
  return map[trackId];
}

function projectsForTrack(trackId: RoadmapTrackId): ProjectRecommendation[] {
  const map: Record<RoadmapTrackId, ProjectRecommendation[]> = {
    "ai-ml": [
      { id: "pr1", title: "Image classifier API", difficulty: "starter", stack: ["PyTorch", "FastAPI"], outcome: "Deploy a CNN with REST inference" },
      { id: "pr2", title: "RAG chatbot", difficulty: "intermediate", stack: ["LangChain", "OpenAI", "Pinecone"], outcome: "Document Q&A with citations" },
      { id: "pr3", title: "MLOps pipeline", difficulty: "capstone", stack: ["MLflow", "Docker", "AWS"], outcome: "Train → deploy → monitor loop" },
    ],
    fullstack: [
      { id: "pr1", title: "Task manager SaaS", difficulty: "starter", stack: ["React", "Node", "Postgres"], outcome: "CRUD + auth + deploy" },
      { id: "pr2", title: "Real-time chat", difficulty: "intermediate", stack: ["WebSockets", "Redis"], outcome: "Rooms, presence, typing indicators" },
      { id: "pr3", title: "Marketplace capstone", difficulty: "capstone", stack: ["Next.js", "Stripe", "Prisma"], outcome: "Payments + search + admin" },
    ],
    cybersecurity: [
      { id: "pr1", title: "Home lab pentest report", difficulty: "starter", stack: ["Kali", "Nmap"], outcome: "Documented findings + fixes" },
      { id: "pr2", title: "Secure auth service", difficulty: "intermediate", stack: ["OAuth2", "JWT", "Rate limiting"], outcome: "OWASP-aligned API" },
      { id: "pr3", title: "SOC simulation", difficulty: "capstone", stack: ["SIEM", "Splunk/ELK"], outcome: "Incident response playbook" },
    ],
    "data-science": [
      { id: "pr1", title: "EDA dashboard", difficulty: "starter", stack: ["Pandas", "Plotly"], outcome: "Interactive public dataset story" },
      { id: "pr2", title: "Churn prediction", difficulty: "intermediate", stack: ["sklearn", "SHAP"], outcome: "Model + business recommendations" },
      { id: "pr3", title: "A/B test analysis", difficulty: "capstone", stack: ["SQL", "Statsmodels"], outcome: "Executive decision memo" },
    ],
    product: [
      { id: "pr1", title: "Feature spec + prototype", difficulty: "starter", stack: ["Figma", "Notion"], outcome: "Validated problem-solution fit" },
      { id: "pr2", title: "Metrics dashboard", difficulty: "intermediate", stack: ["Amplitude", "SQL"], outcome: "North star + funnel tracking" },
      { id: "pr3", title: "0→1 launch", difficulty: "capstone", stack: ["React", "Analytics"], outcome: "Shipped feature with KPI lift" },
    ],
    devops: [
      { id: "pr1", title: "CI/CD for Node app", difficulty: "starter", stack: ["GitHub Actions", "Docker"], outcome: "Automated test + deploy" },
      { id: "pr2", title: "K8s microservices", difficulty: "intermediate", stack: ["Helm", "Prometheus"], outcome: "3-service cluster with monitoring" },
      { id: "pr3", title: "Multi-env IaC", difficulty: "capstone", stack: ["Terraform", "AWS"], outcome: "Staging + prod with drift detection" },
    ],
  };
  return map[trackId];
}

function learningPathForTrack(trackId: RoadmapTrackId): LearningPathItem[] {
  const track = ROADMAP_TRACKS.find((t) => t.id === trackId)!;
  return [
    {
      id: "lp1",
      title: `${track.label} — Core curriculum`,
      type: "course",
      duration: "12 weeks",
      children: [
        { id: "lp1a", title: "Weeks 1–4: Foundations", type: "lab", duration: "4 weeks" },
        { id: "lp1b", title: "Weeks 5–8: Applied practice", type: "lab", duration: "4 weeks" },
        { id: "lp1c", title: "Weeks 9–12: Capstone sprint", type: "community", duration: "4 weeks" },
      ],
    },
    {
      id: "lp2",
      title: "Industry reading list",
      type: "book",
      duration: "Ongoing",
      children: [
        { id: "lp2a", title: "Career blogs & newsletters", type: "community", duration: "Weekly" },
        { id: "lp2b", title: "Open-source contributions", type: "lab", duration: "Monthly" },
      ],
    },
  ];
}

export function suggestTrackFromAssessment(): RoadmapTrackId | null {
  const result = loadAssessmentResult();
  if (!result?.topMatches[0]) return null;
  return TRACK_TO_ASSESSMENT[result.topMatches[0].id] ?? null;
}

export function generateCareerRoadmap(trackId: RoadmapTrackId): CareerRoadmap {
  const track = ROADMAP_TRACKS.find((t) => t.id === trackId)!;
  const phases = phasesForTrack(trackId);
  const totalWeeks = phases.reduce((s, p) => s + p.durationWeeks, 0);
  const assessment = loadAssessmentResult();
  const personalized =
    assessment?.topMatches[0]?.title &&
    TRACK_TO_ASSESSMENT[assessment.topMatches[0].id] === trackId;

  return {
    version: 1,
    trackId,
    title: track.label,
    tagline: personalized
      ? `Aligned with your ${assessment!.topMatches[0].compatibility}% assessment match`
      : track.description,
    generatedAt: new Date().toISOString(),
    totalWeeks,
    phases,
    skills: skillsForTrack(trackId),
    certifications: certsForTrack(trackId),
    projects: projectsForTrack(trackId),
    learningPath: learningPathForTrack(trackId),
  };
}
