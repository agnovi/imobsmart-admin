import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import { useToast } from 'vue-toastification'

import useAuth from '../composables/useSession'

const { VITE_APP_API_URL, VITE_APP_IMPORT_API_URL } = import.meta.env

export const httpImport = axios.create({
  baseURL: VITE_APP_IMPORT_API_URL.toString(),
  timeout: 60000
})

httpImport.interceptors.request.use(
  (request) =>
    requestHandler(request, {
      bearer: true
    }),
  (error) => errorHandler(error)
)

const requestHandler = (request: any, header?: any) => {
  const { token } = useAuth()

  if (!request.headers) request.headers = {}

  if (header?.bearer === true) request.headers.Authorization = `Bearer ${token.value}`

  request.headers.contentType = header?.contentType || 'application/json'

  return request
}

const responseHandler = (response: any) => {
  return response
}

const errorHandler = async (error: any, ignore?: boolean) => {
  const { response } = error
  if (response && response.status === 401) {
    const toast = useToast()
    toast.error('Acesso negado!')
    const { logout } = useAuth()
    return logout()
  } else if (response && response.status === 500) {
    const toast = useToast()
    toast.error(response?.data?.message)
    return Promise.reject(error)
  } else {
    const toast = useToast()
    toast.error(
      Array.isArray(response?.data?.message)
        ? response?.data?.message?.join(', ')
        : response?.data?.message
    )
    return Promise.reject(error)
  }
}

const axiosInstance = (config?: AxiosRequestConfig) =>
  axios.create({
    baseURL: VITE_APP_API_URL,
    timeout: config?.timeout || 60000
  })

export const http = axiosInstance()

http.interceptors.response.use(
  (response) => responseHandler(response),
  async (error) => await errorHandler(error, true)
)

http.interceptors.request.use(
  (request) =>
    requestHandler(request, {
      bearer: true
    }),
  (error) => errorHandler(error)
)
