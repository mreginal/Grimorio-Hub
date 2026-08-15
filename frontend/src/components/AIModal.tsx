import { Sparkles, X } from "lucide-react"
import { useState } from "react"

export function AIModal({
  onClose,
  onGenerate,
}: {
  onClose: () => void
  onGenerate: (prompt: string) => Promise<void>
}) {

  const [prompt, setPrompt] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  async function generate() {

    if (!prompt.trim()) return

    setLoading(true)

    try {

      await onGenerate(prompt)

    } finally {

      setLoading(false)

    }
  }

  return (

    <div className="modal-overlay">

      <div className="ai-modal">

        <header className="modal-header">

          <div>

            <span className="page-label">
              ASSISTENTE
            </span>

            <h2>
              Crie seu personagem com IA
            </h2>

          </div>

          <button onClick={onClose}>
            <X size={18} />
          </button>

        </header>

        <div className="ai-content">

          <div className="ai-icon">
            <Sparkles />
          </div>

          <p>
            Descreva o personagem que você
            imaginou. A IA irá criar uma ficha
            inicial para você editar.
          </p>

          <textarea
            rows={7}
            value={prompt}
            onChange={e =>
              setPrompt(e.target.value)
            }
            placeholder="Ex.: Uma elfa arqueira nível 5 que busca vingança contra o reino que destruiu sua vila..."
          />

        </div>

        <footer className="modal-footer">

          <button
            className="secondary-button"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="primary-button"
            disabled={loading}
            onClick={generate}
          >
            <Sparkles size={16} />

            {loading
              ? 'Criando...'
              : 'Gerar personagem'}
          </button>

        </footer>

      </div>

    </div>
  )
}