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

export function list(page = 1, limit = 10, search?: string) {

  return http.get(`${controller}?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`)
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
