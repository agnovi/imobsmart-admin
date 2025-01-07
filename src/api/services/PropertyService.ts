import { http } from '../api'
import { httpImport } from '../api'
import type { IProperty } from '@/types/property'
const controller = 'property'

export function create(data: IProperty) {
  return http.post(`${controller}`, data)
}

export function edit(data: IProperty, id: number | string) {
  return http.patch(`${controller}/${id}`, data)
}

export function list(filters?: any) {
  let queryParams: string[] = [];

  // Finalidade (venda, locação)
  if (filters?.finalidade?.venda || filters?.finalidade?.locacao) {
    const finalidade = [];
    if (filters.finalidade.venda) finalidade.push("venda");
    if (filters.finalidade.locacao) finalidade.push("locacao");
    queryParams.push(`finalidade=${finalidade.join(",")}`);
  }
  // Preço mínimo setar
  if (filters.isFilterModal) {
    const priceMin = String(filters.price.min).replace(/\s/g, "");
    queryParams.push(`valorMin=${priceMin}`);
  }

  // Preço máximo
  if (filters.isFilterModal) {
    const priceMax = String(filters.price.max).replace(/\s/g, "");
    queryParams.push(`valorMax=${priceMax}`);
  }

  // Área mínima e máxima
  if (filters?.area?.min) {
    queryParams.push(`areaMin=${filters.area.min}`);
  }
  if (filters?.area?.max) {
    queryParams.push(`areaMax=${filters.area.max}`);
  }

  // Logradouro
  if (filters?.logradouro) {
    queryParams.push(`logradouro=${filters.logradouro}`);
  }

  // Referência
  if (filters?.reference) {
    queryParams.push(`referencia=${filters.reference}`);
  }

  // Tipo de imóvel
  if (filters?.type) {
    queryParams.push(`tipoDoImovel=${filters.type}`);
  }

  // Número de garagens, quartos e suítes
  if (filters?.garage && filters.garage.length > 0) {
    queryParams.push(`nGaragem=${filters.garage}`);
  }
  if (filters?.bedroom && filters.bedroom.length > 0) {
    queryParams.push(`nQuarto=${filters.bedroom}`);
  }
  if (filters?.suite && filters.suite.length > 0) {
    queryParams.push(`nSuite=${filters.suite}`);
  }

  // Cidades
  if (filters?.cities?.length) {
    queryParams.push(`cidades=${filters.cities.join(",")}`);
  }

  // Bairros
  if (filters?.neighborhoods?.length) {
    queryParams.push(`bairros=${filters.neighborhoods.join(",")}`);
  }

  // nome tabela
  if (filters?.nameTable) {
    queryParams.push(`nameTable=${filters.nameTable}`);
  }

  // nome link tabela
  if (filters?.linkTable) {
    queryParams.push(`linkTable=${filters.linkTable}`);
  }

  // search
  if (filters?.search) {
    queryParams = [`search=${filters.search}`];
  }
  
  //query page
  if (filters?.page) {
    queryParams.push(`page=${filters.page}`);
  }
  
  //query limit
  if (filters?.limit) {
    queryParams.push(`limit=${filters.limit}`);
  }
  
  // Montar URL final com os parâmetros de query
  const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";

  return http.get(`${controller}${queryString}`)
}
export function AllCompany() {
  return http.get(`${controller}`)
}

export function deleteItem(id: number | string) {
  return http.delete(`${controller}/${id}`)
}

export function getById(id: number | string) {
  return http.get(`${controller}/${id}`)
}

export function downloadModel() {
  return httpImport.get(`${controller}/export?isModel=1`, {
    responseType: 'blob'
  })
}
