export const SITE = {
  name: "Alexei Palacios",
  role: "AI & Cloud Engineer",
  location: "Zapopan, Jalisco · México",
  email: "alexeipalacios12@gmail.com",
  github: "https://github.com/xAlexei52",
  /** Served from public/ when the file is present; the UI hides the link if not. */
  cvPath: "/cv-alexei-palacios.pdf",
  tagline:
    "construyo pipelines serverless en AWS e integro modelos de IA en producción.",
  description:
    "AI & Cloud Engineer en Zapopan, México. Arquitectura serverless en AWS, integración de modelos de Amazon Bedrock y frontends ligeros en Angular y React.",
} as const;

export type NavLink = { label: string; href: string; id: string };

export const NAV_LINKS: NavLink[] = [
  { label: "Sobre mí", href: "#sobre-mi", id: "sobre-mi" },
  { label: "Experiencia", href: "#experiencia", id: "experiencia" },
  { label: "Proyectos", href: "#proyectos", id: "proyectos" },
  { label: "Contacto", href: "#contacto", id: "contacto" },
];

/** Stable identity so the scroll-spy effect is not re-created every render. */
export const SECTION_IDS = NAV_LINKS.map((link) => link.id);

export type Metric = {
  target: number;
  suffix: string;
  decimals: number;
  label: string;
};

export const METRICS: Metric[] = [
  { target: 500, suffix: " GB", decimals: 0, label: "procesados a diario" },
  { target: 40, suffix: "%", decimals: 0, label: "menos tiempo de procesamiento" },
  { target: 30, suffix: "%", decimals: 0, label: "más eficiencia del modelo" },
  { target: 27, suffix: "+", decimals: 0, label: "funciones Lambda en producción" },
];

export const ABOUT_TEXT =
  "Ingeniero de software con base en Zapopan. Trabajo en la intersección de cloud e IA — arquitectura serverless en AWS, integración de modelos de Bedrock en procesos empresariales, y frontends que no se sienten pesados. Titulado en Ingeniería de Software por la Universidad Tecnológica de Jalisco.";

export type StackGroup = { category: string; items: string[] };

export const STACK: StackGroup[] = [
  {
    category: "Cloud & IA",
    items: ["AWS Lambda", "DynamoDB", "Bedrock", "API Gateway", "CDK", "S3"],
  },
  {
    category: "Frontend",
    items: ["Angular", "React", "Vite", "TypeScript", "TailwindCSS", "SCSS"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "NestJS", "Python", "PHP"],
  },
  {
    category: "Datos",
    items: ["MySQL", "MongoDB", "SQL Server", "DynamoDB"],
  },
  {
    category: "Infra",
    items: ["Docker", "Linux", "CI/CD", "Git", "Nginx"],
  },
];

export type Job = {
  role: string;
  company?: string;
  period: string;
  description: string;
};

export const EXPERIENCE: Job[] = [
  {
    role: "AI & Cloud Engineer",
    company: "Genpact",
    period: "Nov 2024 – Actual",
    description:
      "Pipelines de automatización serverless en AWS con Lambda y DynamoDB para procesamiento de datos event-driven. Integración de modelos fundacionales de Amazon Bedrock en procesos de automatización empresarial. Backends en Python y frontends en React/Vite conectados a servicios AWS.",
  },
  {
    role: "Full Stack Developer",
    company: "DeepIA",
    period: "Jun 2023 – Ago 2024",
    description:
      "Aplicaciones web con Angular y Node.js/Express. Construí la conexión entre un backend Express y Azure para procesamiento de video destinado a un modelo de ML: 40% menos tiempo de procesamiento, 30% más eficiencia del modelo y capacidad de 500 GB diarios sin pérdida de rendimiento. Autenticación con OAuth y JWT, contenerización con Docker, CI/CD en Azure.",
  },
  {
    role: "PHP Developer",
    company: "DeepIA",
    period: "2023",
    description:
      "Plugin de WordPress para tiendas WooCommerce integrado con la API de Superenvíos: cotización automatizada de envíos, generación de guías, sistema de recargas y cancelaciones, más un portal administrativo con control de comisiones por usuario. También una PWA de networking empresarial con funcionalidad offline.",
  },
  {
    role: "Freelance",
    period: "desde 2022",
    description:
      "Rediseño del sitio de PRACOFI y proyectos web para clientes del mercado mexicano.",
  },
];

export type Project = {
  title: string;
  description: string;
  stack: string[];
  href?: string;
};

export const PROJECTS: Project[] = [
  {
    title: "Pipeline de siniestros con IA",
    description:
      "Sistema serverless en AWS que analiza PDFs de reclamos por daños de agua, verifica cumplimiento IICRC y genera reportes de auditoría. ~27 Lambdas, DynamoDB con GSIs, Bedrock, frontend en React.",
    stack: ["AWS Lambda", "DynamoDB", "Bedrock", "React"],
  },
  {
    title: "ERP de logística de paquetería",
    description:
      "Plataforma completa con pagos integrados, rastreo en tiempo real y dashboards de utilidad por servicio, por usuario y agregados.",
    stack: ["Angular", "Node.js", "TypeScript", "MySQL"],
  },
  {
    title: "Plugin WooCommerce + Superenvíos",
    description:
      "Cotización y generación de guías automatizada, con portal admin para recargas, cancelaciones y comisiones.",
    stack: ["PHP", "WordPress", "REST API"],
  },
];

export const HERO_VIDEO = {
  webm: "/assets/hero-loop.webm",
  mp4: "/assets/hero-loop.mp4",
  poster: "/assets/hero-poster.jpg",
} as const;
