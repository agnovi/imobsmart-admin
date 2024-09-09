import { http } from '../api'

const controller = 'contactUs'

export function listContact(page = 1, limit = 10) {
  return http.get(`${controller}?page=${page}&limit=${limit}`)
}
