import Link from "next/link";
import type { ReactNode } from "react";

export type MarketingCta = {
  href: string;
  label: string;
  variant?: "primary" | "ghost" | "secondary";
};

type MarketingLandingProps = {
  eyebrow: string;
  heading: string;
  intro: string;
  ctas?: MarketingCta[];
  children?: ReactNode;
};

const defaultCtas: MarketingCta[] = [
  { href: "/app/start", label: "Отправить кейс и документы", variant: "primary" },
  { href: "/auth/register", label: "Регистрация", variant: "ghost" },
  { href: "/consultation", label: "Все консультации", variant: "secondary" },
];

export function MarketingLanding({ eyebrow, heading, intro, ctas = defaultCtas, children }: MarketingLandingProps) {
  return (
    <main className="landing-root">
      <section className="surface-section clinics-page-head">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{heading}</h1>
        <p>{intro}</p>
        <div className="hero-actions marketing-hero-actions">
          {ctas.map((cta) => (
            <Link
              key={cta.href + cta.label}
              href={cta.href}
              className={
                cta.variant === "ghost"
                  ? "button button-ghost"
                  : cta.variant === "secondary"
                    ? "button button-secondary"
                    : "button"
              }
            >
              {cta.label}
            </Link>
          ))}
        </div>
      </section>
      {children}
    </main>
  );
}

export function MarketingSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="surface-section marketing-section">
      <h2 className="marketing-section-title">{title}</h2>
      {children}
    </section>
  );
}
