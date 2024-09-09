import { http } from '../api'
import { ISector } from '@/types/sector'

const controler = 'sector'

export function create(data: ISector) {
  return http.post(`${controler}`, data)
}

export function edit(data: ISector, id: any) {
  return http.put(`${controler}/${id}`, data)
}

export function list(page = 1, limit = 10, where?: any) {
  return http.get(`${controler}?page=${page}&limit=${limit}${where ? `&where=${JSON.stringify(where)}` : ''}`)
}

export function handleDelete(id: number) {
  return http.delete(`${controler}/${id}`)
}

export function get(id: any) {
  return http.get(`${controler}/${id}`)
}
