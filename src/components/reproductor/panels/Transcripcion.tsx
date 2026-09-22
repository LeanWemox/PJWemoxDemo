import type { ReactElement } from 'react'
import { useAppStore } from '../../../state/appStore'

export function Transcripcion(): ReactElement {
  const textoMostrado = useAppStore((state) => state.textoMostrado)

  return (
    <section aria-label="Transcripción" className="content-panel">
      <h2>Transcripción</h2>
      <pre>{textoMostrado}</pre>
    </section>
  )
}
