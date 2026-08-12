import { TRUST_BRANDS } from "@/lib/content";

export default function Hero() {
  return (
    <main className="hero">
      <div className="trust anim" style={{ ["--d" as string]: "0.05s" }}>
        {TRUST_BRANDS.map((brand, index) => (
          <span
            key={brand.name}
            className={`trust-avatar a${index + 1}`}
            aria-hidden="true"
          >
            <span className="trust-avatar__inner">
              <i className={brand.icon} />
            </span>
          </span>
        ))}

        <span className="trust-pill">Trusted by 2000+ Enterprises</span>
      </div>

      <h1 className="headline anim">
        <span>Intelligence</span>
        <span>Designed To Evolve</span>
      </h1>

      <p className="subhead anim" style={{ ["--d" as string]: "0.28s" }}>
        Build applications that reason, adapt and collaborate using a modular AI
        platform designed for production.
      </p>

      <a className="cta anim" href="#" style={{ ["--d" as string]: "0.4s" }}>
        Get Started
      </a>
    </main>
  );
}
