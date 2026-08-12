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
  image: string;
  imageAlt: string;
  meta: { label: string; value: string }[];
  href?: string;
};

export const PROJECTS: Project[] = [
  {
    title: "Pipeline de siniestros con IA",
    description:
      "Sistema serverless en AWS que analiza PDFs de reclamos por daños de agua, verifica cumplimiento IICRC y genera reportes de auditoría.",
    stack: ["AWS Lambda", "DynamoDB", "Bedrock", "React"],
    image: "/assets/projects/placeholder-1.webp",
    imageAlt: "Pipeline de siniestros con IA",
    meta: [
      { label: "Tipo", value: "Plataforma serverless" },
      { label: "Escala", value: "~27 Lambdas" },
      { label: "Rol", value: "AI & Cloud Engineer" },
    ],
  },
  {
    title: "ERP de RL Meats",
    description:
      "ERP multi-ciudad para manejo de carne: entradas de trailer, órdenes de manufactura, inventario, ventas, pagos y gastos. Reportes en PDF y Excel, permisos por ciudad y dashboards de utilidad.",
    stack: ["Angular", "Node.js", "Express", "Sequelize", "MySQL"],
    image: "/assets/projects/placeholder-2.webp",
    imageAlt: "ERP de RL Meats",
    meta: [
      { label: "Tipo", value: "ERP a medida" },
      { label: "Alcance", value: "Multi-ciudad" },
      { label: "Rol", value: "Full stack" },
    ],
  },
  {
    title: "rlmeats.com.mx",
    description:
      "Sitio corporativo de RL Meats: catálogo de producto, presencia de marca y formulario de contacto con notificaciones por correo.",
    stack: ["Laravel 12", "PHP 8.2", "TailwindCSS", "Vite"],
    image: "/assets/projects/placeholder-3.webp",
    imageAlt: "Sitio web de RL Meats",
    meta: [
      { label: "Tipo", value: "Sitio corporativo" },
      { label: "Cliente", value: "RL Meats" },
      { label: "Rol", value: "Diseño y desarrollo" },
    ],
    href: "https://rlmeats.com.mx",
  },
  {
    title: "rghfoodgroup.com",
    description:
      "Sitio corporativo de RGH Food Group, construido sobre la misma base Laravel con layouts propios y build de assets en Vite.",
    stack: ["Laravel 12", "PHP 8.2", "TailwindCSS", "Vite"],
    image: "/assets/projects/placeholder-4.webp",
    imageAlt: "Sitio web de RGH Food Group",
    meta: [
      { label: "Tipo", value: "Sitio corporativo" },
      { label: "Cliente", value: "RGH Food Group" },
      { label: "Rol", value: "Diseño y desarrollo" },
    ],
    href: "https://rghfoodgroup.com",
  },
  {
    title: "ERP de logística de paquetería",
    description:
      "Plataforma completa con pagos integrados, rastreo en tiempo real y dashboards de utilidad por servicio, por usuario y agregados.",
    stack: ["Angular", "Node.js", "TypeScript", "MySQL"],
    image: "/assets/projects/placeholder-5.webp",
    imageAlt: "ERP de logística de paquetería",
    meta: [
      { label: "Tipo", value: "ERP a medida" },
      { label: "Foco", value: "Rastreo y pagos" },
      { label: "Rol", value: "Full stack" },
    ],
  },
  {
    title: "Plugin WooCommerce + Superenvíos",
    description:
      "Cotización y generación de guías automatizada, con portal admin para recargas, cancelaciones y comisiones por usuario.",
    stack: ["PHP", "WordPress", "REST API"],
    image: "/assets/projects/placeholder-6.webp",
    imageAlt: "Plugin de WooCommerce para Superenvíos",
    meta: [
      { label: "Tipo", value: "Plugin WordPress" },
      { label: "Integración", value: "API Superenvíos" },
      { label: "Rol", value: "PHP Developer" },
    ],
  },
  {
    title: "Rediseño de PRACOFI",
    description:
      "Rediseño del sitio de PRACOFI como proyecto freelance, enfocado en jerarquía de contenido y rendimiento en conexiones lentas.",
    stack: ["PHP", "JavaScript", "SCSS"],
    image: "/assets/projects/placeholder-7.webp",
    imageAlt: "Rediseño del sitio de PRACOFI",
    meta: [
      { label: "Tipo", value: "Sitio corporativo" },
      { label: "Modalidad", value: "Freelance" },
      { label: "Rol", value: "Diseño y desarrollo" },
    ],
  },
];

export const HERO_VIDEO = {
  webm: "/assets/hero-loop.webm",
  mp4: "/assets/hero-loop.mp4",
  poster: "/assets/hero-poster.jpg",
} as const;
