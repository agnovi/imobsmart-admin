import { http } from '../api'
import { IRole } from '@/types/role'

const controler = 'role'

export function create(data: IRole) {
  return http.post(`${controler}`, data)
}

export function edit(data: IRole, id: any) {
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
