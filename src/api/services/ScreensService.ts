import { http } from '../api'

const contr = 'screens'

export function create(data: any) {
    return http.post(`${contr}`, data)
}

export function edit(data: any, id: any) {
    return http.put(`${contr}/${id}`, data)
}

export function list(page = 1, limit = 10, where?: any) {
    return http.get(`${contr}?page=${page}&limit=${limit}${where ? `?where=${JSON.stringify(where)}` : ''}`)
}

export function deleteScreen(id: number) {
    return http.delete(`${contr}/${id}`)
}

export function get(id: any) {
    return http.get(`${contr}/${id}`)
}
