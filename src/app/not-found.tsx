import Link from "next/link";

export default function NotFound() {
  return (
    <main className="app-page">
      <section className="app-hero">
        <p className="eyebrow">404</p>
        <h1>Кейс не найден</h1>
        <p>Возможно, ссылка устарела или кейс был удален.</p>
        <div className="hero-actions">
          <Link href="/" className="button">
            На главную
          </Link>
          <Link href="/app/start" className="button button-ghost">
            Создать новый кейс
          </Link>
        </div>
      </section>
    </main>
  );
}
