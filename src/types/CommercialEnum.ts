export enum Commercial {
  SHOP_SALON_COMMERCIAL_OUTLET = 'SHOP_SALON_COMMERCIAL_OUTLET',
  COMMERCIAL_SET_ROOM = 'COMMERCIAL_SET_ROOM',
  COMMERCIAL_HOUSE = 'COMMERCIAL_HOUSE',
  HOTEL_MOTEL_INN = 'HOTEL_MOTEL_INN',
  FLOOR_CORPORATES_LAB = 'FLOOR_CORPORATES_LAB',
  ENTIRE_BUILDING = 'ENTIRE_BUILDING',
  LAND_COMMERCIAL_LOTS = 'LAND_COMMERCIAL_LOTS',
  WAREHOUSE_DEPOSIT = 'WAREHOUSE_DEPOSIT',
  GARAGE = 'GARAGE',
}

export const CommercialTranslationMap: Record<Commercial, string> = {
  [Commercial.SHOP_SALON_COMMERCIAL_OUTLET]: 'Loja/Salão/Ponto Comercial',
  [Commercial.COMMERCIAL_SET_ROOM]: 'Conjunto/Sala Comercial',
  [Commercial.COMMERCIAL_HOUSE]: 'Casa Comercial',
  [Commercial.HOTEL_MOTEL_INN]: 'Hotel/Motel/Pousada',
  [Commercial.FLOOR_CORPORATES_LAB]: 'Andar Corporativo/Laboratório',
  [Commercial.ENTIRE_BUILDING]: 'Prédio Inteiro',
  [Commercial.LAND_COMMERCIAL_LOTS]: 'Terreno/Lote Comercial',
  [Commercial.WAREHOUSE_DEPOSIT]: 'Galpão/Depósito',
  [Commercial.GARAGE]: 'Garagem',
}