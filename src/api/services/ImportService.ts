import { http } from '../api'

const controller = 'importService'

export function importUsers(file: any, user_id: string | null) {
    return http.post(`${controller}/user?userId=${user_id}`, file)
}

export function importCompanies(file: any, user_id: string | null) {
    return http.post(`${controller}/company?userId=${user_id}`, file)
}

export function importResults(file: any, user_id: string | null, campaign_id: string | null, month: string | null) {
    return http.post(`${controller}/result?userId=${user_id}&campaignId=${campaign_id}&period=2024/${month}`, file)
}

export function importCredits(file: any, user_id: string | null) {
    return http.post(`${controller}/transactions?userId=${user_id}`, file)
}
