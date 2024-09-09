import { http } from '../api'

const contRoler = 'Role'
const RoleItens = 'Role'

export function createRole(data: any) {
  return http.post(`${contRoler}`, data)
}

export function editRole(data: any, id: any) {
  return http.put(`${contRoler}/${id}`, data)
}

export function listRole(where?: any) {
  return http.get(`${contRoler}${where ? `?where=${JSON.stringify(where)}` : ''}`)
}

export function deleteRole(id: number) {
  return http.delete(`${contRoler}/${id}`)
}

export function getRole(id: any) {
  return http.get(`${contRoler}/${id}`)
}

export function createRoleItens(data: any) {
  return http.post(`${RoleItens}/create-many`, data)
}

export function editRoleItens(data: any, id: any) {
  return http.put(`${RoleItens}/update-many/${id}`, data)
}

export function getRoleItens(id: any) {
  return http.get(`${RoleItens}/${id}`)
}
