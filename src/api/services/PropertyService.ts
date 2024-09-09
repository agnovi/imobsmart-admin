import { http } from '../api'
import { httpImport } from '../api'
import type { IProperty } from '@/types/property'
const controller = 'property'

export function create(data: IProperty) {
  return http.post(`${controller}`, data)
}

export function editCompany(data: IProperty, id: number | string) {
  return http.put(`${controller}/${id}`, data)
}

export function listCompany(page = 1, limit = 10, where?: any) {
  return http.get(`${controller}?page=${page}&limit=${limit}${where ? `&where=${JSON.stringify(where)}` : ''}`)
}
export function AllCompany() {
  return http.get(`${controller}`)
}

export function deleteCompany(id: number | string) {
  return http.delete(`${controller}/${id}`)
}

export function getCompany(id: number | string) {
  return http.get(`${controller}/${id}`)
}

export function downloadModel() {
  return httpImport.get(`${controller}/export?isModel=1`, {
    responseType: 'blob'
  })
}
