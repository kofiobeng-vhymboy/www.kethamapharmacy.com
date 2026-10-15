import ContentImage from './ContentImage';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { X, Calendar, User, Tag, Share2, Printer, Bookmark, Clock3, ArrowUpRight } from 'lucide-react';
import { Article } from '../../types';
import ReactMarkdown from 'react-markdown';
import { createPortal } from 'react-dom';
import { readStoredIds, writeStoredIds } from '../../lib/storage';

function cleanMarkdownIndentation(content: string): string {
  if (!content) return '';
  const lines = content.split('\n');
  let minIndent = Infinity;
  for (const line of lines) {
    if (!line.trim()) continue;
    const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
    minIndent = Math.min(minIndent, indent);
  }
  if (!Number.isFinite(minIndent) || minIndent === 0) return content;
  return lines.map(line => line.trim() ? line.slice(minIndent) : '').join('\n');
}

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

export default function ArticleModal({ article, onClose }: ArticleModalProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const reducedMotion = useReducedMotion();
  onCloseRef.current = onClose;

  const updateReadingProgress = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    const scrollableHeight = element.scrollHeight - element.clientHeight;
    setReadingProgress(scrollableHeight <= 0 ? 100 : Math.min(100, Math.round((element.scrollTop / scrollableHeight) * 100)));
  }, []);

  useEffect(() => {
    if (!article) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      updateReadingProgress();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      )).filter(element => element.offsetParent !== null && element.tabIndex >= 0);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [article?.id, updateReadingProgress]);

  useEffect(() => {
    setIsSaved(Boolean(article && readStoredIds('saved-articles').includes(article.id)));
    setMessage(null);
    setReadingProgress(0);
  }, [article?.id]);

  const handleShare = async () => {
    if (!article) return;
    const url = new URL('/health-hub', window.location.origin);
    url.searchParams.set('article', article.id);
    const shareData = { title: article.title, text: article.excerpt, url: url.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(`${article.title}\n${url.href}`);
        setMessage('Article link copied to your clipboard.');
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) setMessage(`Copy this article link: ${url.href}`);
    }
  };

  const wordCount = article?.content?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 220));

  return createPortal(
    <AnimatePresence>
      {article && (
        <motion.div
          className="article-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: reducedMotion ? 0 : 0.16 } }}
          transition={{ duration: reducedMotion ? 0 : 0.22 }}
          onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}
        >
          <motion.div
            ref={dialogRef}
            className="article-modal-shell"
            role="dialog"
            aria-modal="true"
            aria-labelledby="article-modal-title"
            initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.97, y: reducedMotion ? 0 : 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.985, y: reducedMotion ? 0 : 8 }}
            transition={{ duration: reducedMotion ? 0 : 0.22, ease: [0.2, 0, 0, 1] }}
          >
            <div className="article-modal-topbar">
              <div className="article-modal-topbar-label"><BookOpenIcon /> Kethama Health Hub</div>
              <div className="article-modal-actions">
                <button type="button" onClick={() => void handleShare()} aria-label="Share article" title="Share article"><Share2 aria-hidden="true" /></button>
                <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Close article" title="Close article"><X aria-hidden="true" /></button>
              </div>
              <div className="article-modal-progress" role="progressbar" aria-label="Article reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={readingProgress}>
                <span style={{ width: `${readingProgress}%` }} />
              </div>
            </div>

            <div ref={scrollRef} className="article-modal-scroll" onScroll={updateReadingProgress}>
              <figure className="article-modal-hero">
                <ContentImage src={article.image} alt="" />
                <div className="article-modal-hero-shade" />
                <figcaption><span><Tag aria-hidden="true" />{article.category}</span><span><Clock3 aria-hidden="true" />{readingMinutes} min read</span></figcaption>
              </figure>

              <article className="article-modal-article">
                <div className="article-modal-meta"><span><Calendar aria-hidden="true" />Published {article.date}</span></div>
                <h1 id="article-modal-title">{article.title}</h1>
                <p className="article-modal-lead">{article.excerpt.replace(/\.{3}$/, '')}</p>

                <div className="article-modal-byline">
                  <div className="article-modal-author"><span><User aria-hidden="true" /></span><div><strong>{article.author}</strong><small>{article.authorRole ?? 'Pharmacist'}</small></div></div>
                  <div className="article-modal-tools">
                    <button type="button" onClick={() => { const nextSaved = !isSaved; const ids = readStoredIds('saved-articles').filter(id => id !== article.id); if (nextSaved) ids.push(article.id); const persisted = writeStoredIds('saved-articles', ids); if (persisted) setIsSaved(nextSaved); setMessage(persisted ? (nextSaved ? 'Saved on this device.' : 'Removed from saved articles.') : 'Browser storage is unavailable. This article could not be saved.'); }} aria-pressed={isSaved} aria-label={isSaved ? 'Remove saved article' : 'Save article'} title={isSaved ? 'Remove saved article' : 'Save article'}>
                      <Bookmark className={isSaved ? 'is-saved' : ''} aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => window.print()} aria-label="Print article" title="Print article"><Printer aria-hidden="true" /></button>
                  </div>
                </div>

                {message && <p className="article-modal-message" role="status">{message}</p>}

                <div className="article-modal-body markdown-body">
                  {article.content ? <ReactMarkdown>{cleanMarkdownIndentation(article.content)}</ReactMarkdown> : <p>{article.excerpt}</p>}
                </div>

                {article.sources && article.sources.length > 0 && (
                  <section className="article-modal-sources" aria-labelledby="article-sources-title">
                    <h2 id="article-sources-title">Further reading &amp; sources</h2>
                    <ul>
                      {article.sources.map(source => (
                        <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}<ArrowUpRight aria-hidden="true" /></a></li>
                      ))}
                    </ul>
                    <p>General education only; this article is not a diagnosis or a substitute for personalized medical advice.</p>
                  </section>
                )}

              </article>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>, document.body
  );
}

function BookOpenIcon() {
  return <span className="article-modal-brand-mark" aria-hidden="true">K</span>;
}
