import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { ReproductorTabs } from '../ReproductorTabs'
import { useAppStore } from '../../../state/appStore'

describe('ReproductorTabs', () => {
  afterEach(() => {
    useAppStore.getState().initializePlayer()
  })

  it('mantiene una única pestaña activa al cambiar de pestaña', () => {
    render(<ReproductorTabs />)

    fireEvent.click(screen.getByRole('tab', { name: 'Hitos' }))

    const tabs = screen.getAllByRole('tab')
    expect(tabs.filter((tab) => tab.getAttribute('aria-selected') === 'true'))
      .toHaveLength(1)
    expect(useAppStore.getState().activeTab).toBe('hitos')
  })

  it.each([
    ['Transcripción', 'transcripcion', 1],
    ['Hitos', 'hitos', 2],
    ['Notas', 'notas', 3],
    ['Asistencia', 'asistencia', 4],
    ['Archivos', 'archivos', 5],
  ] as const)('mapea %s al estado Canvas equivalente', (label, tab, button) => {
    render(<ReproductorTabs />)
    fireEvent.click(screen.getByRole('tab', { name: label }))

    expect(useAppStore.getState().activeTab).toBe(tab)
    expect(useAppStore.getState().activeButton).toBe(button)
    expect(screen.getByRole('tab', { name: label })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })
})
