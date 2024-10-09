import { IUser } from '@/types/user'
import { http } from '../api'

const controler = 'auth'

export function login(user: Pick<IUser, 'email' | 'password'>) {
  return http.post(`${controler}/admin`, user)
}

export function refreshToken(refreshToken: string) {
  return http.post(`${controler}/refreshtoken`, { refreshtoken: refreshToken })
}

export function validateToken(token: any) {
  return http.post(`user/recoverToken-validation/${token}`)
}

export function sendEmail(email: string) {
  return http.put(`user/forgot/password/${email}`)
}

export function resetPassword(id: any, data: any) {
  return http.put(`user/reset/password/${id}`, data)
}
