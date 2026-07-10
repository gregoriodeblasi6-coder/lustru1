// INCOLLA QUESTO IN: app/layout.js  (apri il file, cancella tutto, incolla)

import { Newsreader, Hanken_Grotesk } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const newsreader = Newsreader({ subsets: ['latin'], variable: '--font-serif', display: 'swap' })
const hanken = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })

export const metadata = {
  title: 'Lustru — solo le notizie utili',
  description:
    'Ogni mattina, in italiano: l’essenziale di economia, cronaca, mondo e tecnologia, riscritto in chiaro.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="it" className={`${newsreader.variable} ${hanken.variable}`}>
      <body>
        <header className="site-head">
          <div className="site-head-inner">
            <Link href="/" className="brand">
              <span className="brand-dot" aria-hidden="true" />
              <span className="brand-name mark">Lustru</span>
            </Link>

            <nav className="site-nav">
              <Link href="/" className="site-nav-link">Oggi</Link>
              <Link href="/#Economia" className="site-nav-link">Economia</Link>
              <Link href="/#Mondo" className="site-nav-link">Mondo</Link>
              <Link href="/#Tecnologia" className="site-nav-link">Tecnologia</Link>
              <Link href="/about" className="site-nav-link">Chi siamo</Link>
            </nav>

            <div className="site-actions">
              <Link href="/#iscriviti" className="btn-ghost">Accedi</Link>
              <Link href="/#iscriviti" className="btn-solid">Iscriviti</Link>
            </div>
          </div>
          <p className="ai-note">
            Notizie selezionate e riscritte automaticamente con l’AI, da fonti pubbliche.
          </p>
        </header>

        {children}

        <footer className="site-foot">
          <div className="site-foot-inner">
            <span className="site-foot-brand">Lustru</span>
            <span className="site-foot-text">
              Progetto di Gregorio De Blasi · fatto in Sicilia, letto ovunque
            </span>
            <span className="site-foot-text">
              Le notizie sono generate automaticamente con l’intelligenza artificiale.
            </span>
            <div className="socials">
              <a className="social-sq" href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a className="social-sq" href="#" aria-label="X">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.5 3h3l-7 8 8.2 10h-6.4l-4.3-5.4L5.4 21H2.4l7.5-8.6L2 3h6.5l3.9 5.1L17.5 3z" />
                </svg>
              </a>
              <a className="social-sq" href="#" aria-label="Telegram">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.8 4.2 2.9 11.5c-1 .4-1 1.8.1 2.1l4.7 1.5 1.8 5.6c.3.9 1.4 1 2 .3l2.5-2.6 4.7 3.5c.7.5 1.7.1 1.9-.7l3.2-15c.2-1-.8-1.9-1.9-1.5z" />
                </svg>
              </a>
              <a className="social-sq" href="#" aria-label="Email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
