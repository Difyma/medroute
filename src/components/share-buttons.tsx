"use client";

import { useSyncExternalStore, useState } from "react";

type ShareButtonsProps = {
  title: string;
  path: string;
};

export function ShareButtons({ title, path }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const origin = useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => "",
  );
  const shareUrl = origin ? `${origin}${path}` : path;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  const tgHref = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`;
  const vkHref = `https://vk.com/share.php?url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="share-block">
      <p className="eyebrow">Социальный шеринг</p>
      <div className="share-actions">
        <button className="button button-secondary" onClick={copyLink} type="button">
          {copied ? "Ссылка скопирована" : "Скопировать ссылку"}
        </button>
        <a className="button button-ghost" href={tgHref} target="_blank" rel="noopener noreferrer">
          Поделиться в Telegram
        </a>
        <a className="button button-ghost" href={vkHref} target="_blank" rel="noopener noreferrer">
          Поделиться VK
        </a>
      </div>
    </div>
  );
}
