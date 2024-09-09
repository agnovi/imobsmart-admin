export interface Icampaign {
  name: string
  limitDate: string
  id?: number | string
  regulation?: string
  howWorks?: string
  managerId?: string | number
  participants?: { id: number; name: string }[]
  tables?: { id: number; name: string }[]
  images?: any
  regional?: number[]
  groups?: number[]
  roles?: number[]
  classes?: number[]
  type?: string
  dateInitial?: string
  dateFinal?: string
  urlPdf?: string
  isMain?: boolean
  networkIds?: []
  clustertypes?: any[]
  productsIds?: any[]
}

export interface IcampaignParticipant {
  userId: number | string
  campaignId: number | string
  id?: string | number
}
