// INCOLLA QUESTO IN: app/articolo/[id]/page.js
// PRIMA crea dentro "app" una cartella chiamata: articolo
// Poi dentro "articolo" crea un'altra cartella chiamata (con le parentesi quadre): [id]
// Poi dentro "[id]" crea un file chiamato: page.js  e incolla qui sotto.

'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../lib/supabaseClient'

export default function Articolo() {
  const params = useParams()
  const id = params.id
  const [articolo, setArticolo] = useState(null)
  const [caricamento, setCaricamento] = useState(true)

  useEffect(() => {
    async function carica() {
      const { data } = await supabase.from('articles').select('*').eq('id', id).single()
      setArticolo(data)
      setCaricamento(false)
    }
    if (id) carica()
  }, [id])

  if (caricamento) {
    return (
      <main className="articolo">
        <p className="stato">Carico l’articolo…</p>
      </main>
    )
  }

  if (!articolo) {
    return (
      <main className="articolo">
        <p className="stato">Articolo non trovato.</p>
        <Link href="/" className="torna">← Torna alla prima pagina</Link>
      </main>
    )
  }

  const data = new Date(articolo.published_at).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <main className="articolo">
      <Link href="/" className="torna">← Prima pagina</Link>
      <span className="tag">{articolo.category}</span>
      <h1 className="articolo-title">{articolo.title}</h1>
      <p className="articolo-meta">{data}</p>
      <div className="articolo-body">
        {(articolo.body || '').split('\n').map((par, i) => (
          <p key={i}>{par}</p>
        ))}
      </div>
      {articolo.source_url && (
        <p className="articolo-fonte">
          Fonte originale:{' '}
          <a href={articolo.source_url} target="_blank" rel="noopener noreferrer">
            {articolo.source_url}
          </a>
        </p>
      )}
      <p className="articolo-ai">
        Questo testo è stato riscritto automaticamente con l’intelligenza artificiale
        a partire da fonti pubbliche.
      </p>
    </main>
  )
}
