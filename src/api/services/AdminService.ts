import { IUser } from '@/types/user'
import { http } from '../api'
import { isCPF } from '@/util/helpers'

const controller = 'users'

export function createUser(data: IUser) {
  return http.post(`${controller}`, data)
}

export function listUser(page = 1, limit = 10, where?: any) {
  const isCpfUser = isCPF(where ? where : '')
  let search = ''
  if (isCpfUser) {
    search = where.replace(/[.-]/g, '')
  } else {
    search = where
  }
  return http.get(`${controller}?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`)
}

export function getUser(id: any) {
  return http.get(`${controller}/${id}`)
}

export function editUser(data: any) {
  return http.put(`${controller}/${data.id_user}`, data)
}

export function deleteUser(id: number) {
  return http.delete(`${controller}/${id}`)
}

export function resetPassword(id: any, data: any) {
  return http.put(`${controller}/password/${id}`, data)
}
