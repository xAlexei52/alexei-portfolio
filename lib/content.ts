export const SITE = {
  name: "Alexei Palacios",
  role: "AI & Cloud Engineer",
  location: "Zapopan, Jalisco · México",
  email: "alexeipalacios12@gmail.com",
  github: "https://github.com/xAlexei52",
  /** Served from public/ when the file is present; the UI hides the link if not. */
  cvPath: "/cv-alexei-palacios.pdf",
  /** Two rendered lines. The Hero paints the last word of the second in the
      accent, so the split lives there rather than in another array entry. */
  headline: ["Software que piensa,", "automatiza y escala."],
  intro:
    "Desde 2022 construyo los sistemas que sostienen operaciones reales: pipelines serverless en AWS, ERPs a medida y modelos de IA puestos donde de verdad ahorran horas.",
  description:
    "Desarrollo a medida en Zapopan, México: páginas web, CRM, ERPs, plugins de PHP, arquitectura serverless en AWS, integración de modelos de IA y automatización de procesos.",
} as const;

/** Counterweight column in the hero: a value over a quiet label. */
export const HERO_FACTS = [
  { value: "2022", label: "construyendo en producción" },
  { value: "AWS", label: "Lambda · Bedrock · DynamoDB" },
  { value: "MX", label: "remoto · Zapopan, Jalisco" },
];

/** Reads as a capability strip under the hero copy. */
export const SOLUTIONS = [
  "Páginas web",
  "CRM",
  "ERPs",
  "Plugins PHP",
  "AWS",
  "Modelos de IA",
  "Automatización",
];

export type NavLink = { label: string; href: string; id: string };

export const NAV_LINKS: NavLink[] = [
  { label: "Servicios", href: "#servicios", id: "servicios" },
  { label: "Sobre mí", href: "#sobre-mi", id: "sobre-mi" },
  { label: "Experiencia", href: "#experiencia", id: "experiencia" },
  { label: "Proyectos", href: "#proyectos", id: "proyectos" },
  { label: "Contacto", href: "#contacto", id: "contacto" },
];

/**
 * One hue, four saturations. `shu` is the most saturated and belongs to the
 * anchor card; the rest step down so rank reads as intensity, not as hue.
 */
export type ServiceAccent = "shu" | "shu-2" | "shu-3" | "shu-4";
export type ServiceGlyph =
  | "ai"
  | "automation"
  | "cloud"
  | "erp"
  | "crm"
  | "web"
  | "plugin";

export type Service = {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  accent: ServiceAccent;
  glyph: ServiceGlyph;
};

export const SERVICES: Service[] = [
  {
    id: "ia",
    title: "Integración de modelos de IA",
    description:
      "Modelos fundacionales conectados a procesos que ya existen: lectura de documentos, clasificación, extracción estructurada y generación asistida, siempre validada contra tus reglas de negocio.",
    bullets: ["Amazon Bedrock", "RAG sobre tus datos", "Validación y trazabilidad"],
    accent: "shu",
    glyph: "ai",
  },
  {
    id: "automatizacion",
    title: "Automatización de procesos",
    description:
      "Flujos event-driven que quitan el trabajo manual entre sistemas, con reintentos y registro de cada paso.",
    bullets: ["Event-driven", "Integraciones por API", "Reportes automáticos"],
    accent: "shu-2",
    glyph: "automation",
  },
  {
    id: "aws",
    title: "Cloud en AWS",
    description:
      "Arquitectura serverless que escala con la demanda y no cuesta cuando nadie la usa.",
    bullets: ["Lambda y DynamoDB", "Infraestructura con CDK", "Observabilidad"],
    accent: "shu-3",
    glyph: "cloud",
  },
  {
    id: "erp",
    title: "ERPs a medida",
    description:
      "Inventario, manufactura, ventas y costos en un solo sistema, modelado sobre cómo opera tu negocio.",
    bullets: ["Multi-sucursal", "Reportes PDF y Excel", "Permisos por rol"],
    accent: "shu-4",
    glyph: "erp",
  },
  {
    id: "crm",
    title: "Sistemas CRM",
    description:
      "Pipeline comercial y seguimiento de clientes, con la información donde tu equipo ya trabaja.",
    bullets: ["Etapas y embudo", "Historial por cliente", "Tableros de cierre"],
    accent: "shu-3",
    glyph: "crm",
  },
  {
    id: "web",
    title: "Páginas web",
    description:
      "Sitios corporativos rápidos y fáciles de editar. Nada de plantillas genéricas.",
    bullets: ["SEO técnico", "Core Web Vitals", "Formularios y correo"],
    accent: "shu-2",
    glyph: "web",
  },
  {
    id: "plugins",
    title: "Plugins de PHP y WordPress",
    description:
      "Extensiones a medida para WooCommerce y WordPress cuando el plugin que necesitas no existe.",
    bullets: ["WooCommerce", "APIs de terceros", "Panel administrativo"],
    accent: "shu-4",
    glyph: "plugin",
  },
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

/** Runs under ABOUT_QUOTE, so it must not repeat the same framing. */
export const ABOUT_TEXT =
  "Arquitectura serverless en AWS, modelos de Bedrock integrados en procesos empresariales y frontends que no se sienten pesados. Me interesa el punto donde la infraestructura deja de ser un costo y empieza a resolver algo concreto del negocio: un reporte que ya no se hace a mano, un proceso que deja de esperar a alguien.";

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
    image: "/assets/projects/pipeline-ia.webp",
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
    image: "/assets/projects/erp-rlmeats.webp",
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
    image: "/assets/projects/rlmeats.webp",
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
    image: "/assets/projects/rghfood.webp",
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
    image: "/assets/projects/erp-logistica.webp",
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
    image: "/assets/projects/plugin-woo.webp",
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
    image: "/assets/projects/pracofi.webp",
    imageAlt: "Rediseño del sitio de PRACOFI",
    meta: [
      { label: "Tipo", value: "Sitio corporativo" },
      { label: "Modalidad", value: "Freelance" },
      { label: "Rol", value: "Diseño y desarrollo" },
    ],
  },
];
