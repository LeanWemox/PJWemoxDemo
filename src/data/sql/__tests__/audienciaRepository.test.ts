import { describe, expect, it } from 'vitest'
import {
  createMockAudienciaRepository,
  type AudienciaFilters,
} from '../audienciaRepository'
import type { Audiencia } from '../../types/audiencia'

const audiencias: readonly Audiencia[] = [
  {
    IdAudiencia: 1, Fecha: '2026-01-18', HoraInicio: null, HoraFin: null,
    TituloAudiencia: 'Más antigua', IdCausa: null, CodBarras: 'ABC-001',
    OrganizadorUser: null, ObjectIdOrganizador: null, Estado: null, Privada: null,
    Menores: null, RequiereValidacion: null, Notas: null, IdAudienciaTeams: null,
    ThreadIdTeams: null, Archivos: null, Acta: null, TipoAudiencia: null,
    EventIdTeams: null, MeetingIdTeams: null, IdAudienciaAugusta: null,
    postAudienciaApp: null,
  },
  {
    IdAudiencia: 2, Fecha: '2026-02-10', HoraInicio: null, HoraFin: null,
    TituloAudiencia: 'Más reciente', IdCausa: null, CodBarras: 'XYZ-ABC-002',
    OrganizadorUser: null, ObjectIdOrganizador: null, Estado: null, Privada: null,
    Menores: null, RequiereValidacion: null, Notas: null, IdAudienciaTeams: null,
    ThreadIdTeams: null, Archivos: null, Acta: null, TipoAudiencia: null,
    EventIdTeams: null, MeetingIdTeams: null, IdAudienciaAugusta: null,
    postAudienciaApp: null,
  },
  {
    IdAudiencia: 3, Fecha: '2026-01-18', HoraInicio: null, HoraFin: null,
    TituloAudiencia: 'Misma fecha', IdCausa: null, CodBarras: 'DEF-003',
    OrganizadorUser: null, ObjectIdOrganizador: null, Estado: null, Privada: null,
    Menores: null, RequiereValidacion: null, Notas: null, IdAudienciaTeams: null,
    ThreadIdTeams: null, Archivos: null, Acta: null, TipoAudiencia: null,
    EventIdTeams: null, MeetingIdTeams: null, IdAudienciaAugusta: null,
    postAudienciaApp: null,
  },
]

const allFilters: AudienciaFilters = { text: '', fromDate: null, toDate: null }

describe('audienciaRepository Power Fx filtering contract', () => {
  const repository = createMockAudienciaRepository(audiencias)

  it('matches partial text contained in CodBarras, not only prefixes', async () => {
    const result = await repository.search({ ...allFilters, text: 'ABC-00' })
    expect(result.map((item) => item.IdAudiencia)).toEqual([2, 1])
  })

  it('applies inclusive lower and upper date bounds', async () => {
    const result = await repository.search({
      ...allFilters,
      fromDate: '2026-01-18',
      toDate: '2026-01-18',
    })
    expect(result.map((item) => item.IdAudiencia)).toEqual([1, 3])
  })

  it('sorts results by Fecha descending', async () => {
    const result = await repository.search(allFilters)
    expect(result.map((item) => item.Fecha)).toEqual([
      '2026-02-10',
      '2026-01-18',
      '2026-01-18',
    ])
  })

  it('returns all records for empty text and null dates', async () => {
    const result = await repository.search(allFilters)
    expect(result).toHaveLength(audiencias.length)
  })
})
