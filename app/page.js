// INCOLLA QUESTO IN: app/page.js  (apri il file, cancella tutto, incolla)
// HOME stile Rundown: scatola iscrizione + ricerca + filtro a tendina + griglia.

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'

const ORDINE = ['Economia', 'Mondo', 'Italia', 'Tecnologia', 'Cultura', 'Sport']

function ordinaCategorie(cats) {
  return [...cats].sort((a, b) => {
    const ia = ORDINE.indexOf(a)
    const ib = ORDINE.indexOf(b)
    const va = ia === -1 ? 999 : ia
    const vb = ib === -1 ? 999 : ib
    if (va !== vb) return va - vb
    return a.localeCompare(b)
  })
}

function formatData(iso) {
  try {
    return new Date(iso).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })
  } catch {
    return ''
  }
}

export default function Home() {
  const [articoli, setArticoli] = useState([])
  const [caricamento, setCaricamento] = useState(true)
  const [categoria, setCategoria] = useState('Tutte')
  const [query, setQuery] = useState('')

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    async function carica() {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false })
      if (!error && data) setArticoli(data)
      setCaricamento(false)
    }
    carica()
  }, [])

  // i link "Economia/Mondo/Tecnologia" nella barra in alto filtrano tramite #categoria
  useEffect(() => {
    function applyHash() {
      const h = decodeURIComponent((window.location.hash || '').replace('#', ''))
      if (h && h !== 'iscriviti' && h !== 'edizione') {
        setCategoria(h)
        const el = document.getElementById('edizione')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
    }
    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    const value = email.trim().toLowerCase()
    if (!value || !value.includes('@')) {
      setStatus('error')
      return
    }
    setStatus('loading')
    const { error } = await supabase.from('subscribers').insert({ email: value })
    if (error) {
      setStatus(error.code === '23505' ? 'already' : 'error')
      return
    }
    setStatus('done')
    setEmail('')
  }

  const categorie = ordinaCategorie(Array.from(new Set(articoli.map((a) => a.category))))
  const q = query.trim().toLowerCase()
  const filtrati = articoli.filter((a) => {
    const okCat = categoria === 'Tutte' || a.category === categoria
    const okQ =
      !q ||
      (a.title || '').toLowerCase().includes(q) ||
      (a.excerpt || '').toLowerCase().includes(q)
    return okCat && okQ
  })

  const oggi = new Date().toLocaleDateString('it-IT', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <main className="home">
      {/* --- scatola iscrizione in cima --- */}
      <section className="hero" id="iscriviti">
        <p className="hero-eyebrow">Solo le notizie utili</p>
        <h1 className="hero-title">
          Le notizie del giorno, in <span className="mark">cinque minuti</span>.
        </h1>
        <p className="hero-sub">
          Ogni mattina, in italiano: l’essenziale di economia, cronaca, mondo,
          tecnologia e AI — riscritto in chiaro, senza fronzoli.
        </p>

        <form className="signup" onSubmit={handleSubmit}>
          <input
            className="signup-input"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="La tua email"
            aria-label="Il tuo indirizzo email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (status !== 'idle') setStatus('idle')
            }}
          />
          <button className="signup-button" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Un attimo…' : 'Iscriviti'}
          </button>
        </form>

        <p className="status" role="status" data-state={status}>
          {status === 'done' && 'Ci sei. Il primo Lustru arriva già domani mattina.'}
          {status === 'already' && 'Sei già dei nostri. A domani mattina.'}
          {status === 'error' && 'Controlla l’indirizzo e riprova.'}
          {(status === 'idle' || status === 'loading') &&
            'Gratis. Una mail al giorno. Disdici quando vuoi.'}
        </p>
      </section>

      {/* --- notizie --- */}
      <section className="edition" id="edizione">
        <div className="edition-head">
          <h2 className="edition-title">L’edizione di oggi</h2>
          <p className="edition-sub">{oggi} · le notizie che contano, riscritte in chiaro.</p>
        </div>

        <div className="toolbar">
          <div className="search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Cerca una notizia…"
              aria-label="Cerca una notizia"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            aria-label="Filtra per categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="Tutte">Tutte le categorie</option>
            {categorie.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {caricamento && <p className="stato">Carico l’edizione…</p>}

        {!caricamento && filtrati.length === 0 && (
          <p className="stato">Nessuna notizia trovata. Prova a cambiare filtro o ricerca.</p>
        )}

        {!caricamento && filtrati.length > 0 && (
          <div className="grid">
            {filtrati.map((a) => (
              <Link key={a.id} href={`/articolo/${a.id}`} className="card">
                <span className="kicker">{a.category}</span>
                <h3 className="card-title">{a.title}</h3>
                {a.excerpt && <p className="card-excerpt">{a.excerpt}</p>}
                <span className="card-date">{formatData(a.published_at)}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}


