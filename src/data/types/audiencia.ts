export interface Audiencia {
  IdAudiencia: number
  Fecha: string | null
  HoraInicio: string | null
  HoraFin: string | null
  TituloAudiencia: string | null
  IdCausa: number | null
  CodBarras: string | null
  OrganizadorUser: string | null
  ObjectIdOrganizador: string | null
  Estado: string | null
  Privada: boolean | null
  Menores: boolean | null
  RequiereValidacion: boolean | null
  Notas: string | null
  IdAudienciaTeams: string | null
  ThreadIdTeams: string | null
  Archivos: string | null
  Acta: string | null
  TipoAudiencia: string | null
  EventIdTeams: string | null
  MeetingIdTeams: string | null
  IdAudienciaAugusta: string | null
  postAudienciaApp: boolean | null
  VideoUrl?: string | null
  VideoId?: string | null
}
