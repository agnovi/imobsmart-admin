import { IUser } from '@/types/user'
import { http } from '../api'
import { httpImport } from '../api'
import { isCPF } from '@/util/helpers'

const controller = 'clients'

export function createUser(data: any) {
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

export function listUserWithoutPagination(name?: string) {
  return http.get(`${controller}${name ? `?search=${name}` : ''}`)
}

export function deleteUser(id: number) {
  return http.delete(`${controller}/${id}`)
}

export function getUser(id: any) {
  return http.get(`${controller}/${id}`)
}

export function editUser(data: any) {
  return http.put(`${controller}/${data.id}`, data)
}

export function recoverTokenValidation(token: any) {
  return http.post(`${controller}/first-access/${token}`)
}

export function updateStatusUser(
  payload: { status: string },
  idUser: string | number,
  token: string
) {
  return http.put(`${controller}/update-status/${idUser}?token=${token}`, payload)
}

export function completeRegistration(id: any, payload: IUser) {
  return http.put(`${controller}/complete-registration/${id}`, payload)
}

export function downloadModel() {
  return httpImport.get(`${controller}/export?isModel=1`, {
    responseType: 'blob'
  })
}

export function firstAccess(email: string) {
  return http.post(`${controller}/recoverToken-send/${email}`)
}

export function getSupervisorbyRole(roleId: number) {
  return http.get(`${controller}/supervisors-role/${roleId}`)
}
