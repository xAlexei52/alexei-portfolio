export type NavLink = {
  label: string;
  href: string;
  active?: boolean;
};

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "#", active: true },
  { label: "Product", href: "#" },
  { label: "Case Studies", href: "#" },
  { label: "Contact", href: "#" },
];

export type Stat = {
  /** Display-font glyph rendered above the value. */
  icon: string;
  target: number;
  suffix: string;
  decimals: number;
  label: string;
};

export const STATS: Stat[] = [
  { icon: "<", target: 120, suffix: "ms", decimals: 0, label: "Inference Time" },
  { icon: "%", target: 99.99, suffix: "%", decimals: 2, label: "Platform Uptime" },
  { icon: "*", target: 24, suffix: "/7", decimals: 0, label: "Autonomous Runtime" },
  { icon: "#", target: 2.4, suffix: "M", decimals: 1, label: "Context Windows" },
];

export const TRUST_BRANDS = [
  { icon: "fa-brands fa-microsoft", name: "Microsoft" },
  { icon: "fa-brands fa-amazon", name: "Amazon" },
  { icon: "fa-brands fa-google", name: "Google" },
];

export const BG_VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4";
