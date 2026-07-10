// INCOLLA QUESTO IN: app/about/page.js
// PRIMA crea dentro "app" una cartella chiamata: about
// Poi dentro "about" crea un file chiamato: page.js  e incolla qui sotto.

'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function About() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

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

  return (
    <main className="about">
      <p className="eyebrow">Chi siamo</p>
      <h1 className="about-title">
        Un po’ di <span className="mark">lustru</span> sulle notizie che contano.
      </h1>
      <p className="about-lede">
        Lustru raccoglie ogni giorno le notizie principali da fonti pubbliche e le
        riscrive in italiano semplice, con l’aiuto dell’intelligenza artificiale.
        Cinque minuti, il tempo di un caffè, e sei sul pezzo.
      </p>
      <p className="about-lede">
        Le trovi qui sulla prima pagina, aggiornate ogni giorno. Se vuoi, te le
        mandiamo anche via email ogni mattina.
      </p>

      <form className="signup" onSubmit={handleSubmit}>
        <input
          className="signup-input"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="la-tua@email.it"
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
          'Gratis. Una mail al giorno. Se ti stanchi, esci con un clic.'}
      </p>
    </main>
  )
}
