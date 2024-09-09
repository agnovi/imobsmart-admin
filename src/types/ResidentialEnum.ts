export enum Residential {
  APARTMENT = 'APARTMENT',
  STUDIO = 'STUDIO',
  KITNET = 'KITNET',
  HOME = 'HOME',
  TOWN_HOUSE = 'TOWN_HOUSE',
  CONDOMINIUM_HOUSE = 'CONDOMINIUM_HOUSE',
  VILLAGE_HOUSE = 'VILLAGE_HOUSE',
  COVERAGE = 'COVERAGE',
  FLAT = 'FLAT',
  LOFT = 'LOFT',
  LAND_LOT_CONDOMINIUM = 'LAND_LOT_CONDOMINIUM',
  FARM = 'FARM',
}

export const ResidentialTranslationMap: Record<Residential, string> = {
  [Residential.APARTMENT]: 'Apartamento',
  [Residential.STUDIO]: 'Estúdio',
  [Residential.KITNET]: 'Kitnet',
  [Residential.HOME]: 'Casa',
  [Residential.TOWN_HOUSE]: 'Casa de Vila',
  [Residential.CONDOMINIUM_HOUSE]: 'Casa de Condomínio',
  [Residential.VILLAGE_HOUSE]: 'Casa de Vila',
  [Residential.COVERAGE]: 'Cobertura',
  [Residential.FLAT]: 'Flat',
  [Residential.LOFT]: 'Loft',
  [Residential.LAND_LOT_CONDOMINIUM]: 'Terreno em Condomínio',
  [Residential.FARM]: 'Chácara/Sítio',
};
