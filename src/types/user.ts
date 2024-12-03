export interface IUser {
  id?: string | number
  token?: string
  name?: string
  email?: string
  cpf?: string
  password?: string
  status?: boolean
}

export interface IClients {
  id_client?: string | number
  name: string
  email: string
  document: string
  password: string
  phone?: string
  status: string
  type: string
  id_plan: any
}
