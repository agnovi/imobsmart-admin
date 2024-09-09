import { ResidentialTranslationMap } from '@/types/ResidentialEnum'
import { CommercialTranslationMap } from '@/types/CommercialEnum'
export const residentialOptions = Object.entries(ResidentialTranslationMap).map(([key, value]) => ({
  label: value,
  value: key,
}))

export const comercialOptions = Object.entries(CommercialTranslationMap).map(([key, value]) => ({
  label: value,
  value: key,
}))