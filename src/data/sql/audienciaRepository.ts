import type { Audiencia } from '../types/audiencia'
import type { Causa } from '../types/causa'

export interface AudienciaFilters {
  text: string
  fromDate: string | null
  toDate: string | null
}

export interface AudienciaRepository {
  search(filters: AudienciaFilters): Promise<Audiencia[]>
  getById(id: number): Promise<Audiencia | null>
  getCausas(): Promise<Causa[]>
}

export const mockAudiencias: readonly Audiencia[] = [
  {
    IdAudiencia: 1,
    Fecha: '2026-01-18',
    HoraInicio: '15:16:15',
    HoraFin: '17:00:00',
    TituloAudiencia: 'Reunión operativa enero 2026',
    IdCausa: 1,
    CodBarras: 'AUD-2026-0001',
    OrganizadorUser: 'organizador@example.com',
    ObjectIdOrganizador: null,
    Estado: 'Finalizada',
    Privada: false,
    Menores: false,
    RequiereValidacion: false,
    Notas: 'Notas de la reunión operativa.',
    IdAudienciaTeams: null,
    ThreadIdTeams: null,
    Archivos: null,
    Acta: null,
    TipoAudiencia: 'Operativa',
    EventIdTeams: null,
    MeetingIdTeams: null,
    IdAudienciaAugusta: null,
    postAudienciaApp: false,
  },
  {
    IdAudiencia: 2,
    Fecha: '2026-02-10',
    HoraInicio: '10:00:00',
    HoraFin: '11:30:00',
    TituloAudiencia: 'Audiencia de seguimiento',
    IdCausa: 2,
    CodBarras: 'AUD-2026-0002',
    OrganizadorUser: 'mesa@example.com',
    ObjectIdOrganizador: null,
    Estado: 'Programada',
    Privada: false,
    Menores: false,
    RequiereValidacion: true,
    Notas: 'Seguimiento del expediente.',
    IdAudienciaTeams: null,
    ThreadIdTeams: null,
    Archivos: null,
    Acta: null,
    TipoAudiencia: 'Seguimiento',
    EventIdTeams: null,
    MeetingIdTeams: null,
    IdAudienciaAugusta: null,
    postAudienciaApp: false,
  },
  {
    IdAudiencia: 3,
    Fecha: '2026-03-05',
    HoraInicio: '09:15:00',
    HoraFin: '10:45:00',
    TituloAudiencia: 'Revisión de medidas',
    IdCausa: 3,
    CodBarras: 'AUD-2026-0003',
    OrganizadorUser: 'tribunal@example.com',
    ObjectIdOrganizador: null,
    Estado: 'Confirmada',
    Privada: true,
    Menores: false,
    RequiereValidacion: false,
    Notas: 'Revisión de medidas cautelares.',
    IdAudienciaTeams: null,
    ThreadIdTeams: null,
    Archivos: null,
    Acta: null,
    TipoAudiencia: 'Revisión',
    EventIdTeams: null,
    MeetingIdTeams: null,
    IdAudienciaAugusta: null,
    postAudienciaApp: false,
  },
]

export const mockCausas: readonly Causa[] = [
  {
    IdCausa: 1,
    IdCausaAugusta: null,
    IdOrg: null,
    NombreOrganismo: 'Organismo de demostración',
    Prefijo: null,
    Numero: '1',
    Sufijo: null,
    Caratula: 'Causa de demostración',
    Estado: 'Activa',
    LocalidadJuzgado: null,
    IdUnicoCausa: null,
  },
  {
    IdCausa: 2,
    IdCausaAugusta: null,
    IdOrg: null,
    NombreOrganismo: 'Juzgado de seguimiento',
    Prefijo: 'EXP',
    Numero: '2026-002',
    Sufijo: null,
    Caratula: 'Expediente de seguimiento',
    Estado: 'En trámite',
    LocalidadJuzgado: 'Buenos Aires',
    IdUnicoCausa: null,
  },
  {
    IdCausa: 3,
    IdCausaAugusta: null,
    IdOrg: null,
    NombreOrganismo: 'Tribunal de revisión',
    Prefijo: 'MED',
    Numero: '2026-003',
    Sufijo: null,
    Caratula: 'Medidas cautelares',
    Estado: 'Activa',
    LocalidadJuzgado: 'Córdoba',
    IdUnicoCausa: null,
  },
]

function dateKey(value: string | null): string | null {
  return value === null || value.trim() === '' ? null : value.slice(0, 10)
}

export function createMockAudienciaRepository(
  audiencias: readonly Audiencia[] = mockAudiencias,
  causas: readonly Causa[] = mockCausas,
): AudienciaRepository {
  return {
    async search(filters) {
      const text = filters.text.trim().toLocaleLowerCase()

      return audiencias
      .filter((audiencia) => {
        const codigo = (audiencia.CodBarras ?? '').toLocaleLowerCase()
        const causa = causas.find((item) => item.IdCausa === audiencia.IdCausa)
        const caratula = (causa?.Caratula ?? '').toLocaleLowerCase()
        const fecha = dateKey(audiencia.Fecha)

        return (
          (text === '' ||
            codigo.includes(text) ||
            caratula.includes(text)) &&
          (filters.fromDate === null ||
            (fecha !== null && fecha >= filters.fromDate)) &&
          (filters.toDate === null ||
            (fecha !== null && fecha <= filters.toDate))
        )
        })
        .sort((left, right) => {
        const leftDate = dateKey(left.Fecha)
        const rightDate = dateKey(right.Fecha)
        if (leftDate === rightDate) return 0
        if (leftDate === null) return 1
        if (rightDate === null) return -1
        return rightDate.localeCompare(leftDate)
        })
    },
    async getCausas() {
      return [...causas]
    },
    async getById(id) {
      return audiencias.find((audiencia) => audiencia.IdAudiencia === id) ?? null
    },
  }
}

export const mockAudienciaRepository = createMockAudienciaRepository()
