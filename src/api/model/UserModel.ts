export interface User {
  id?: number
  cpf?: string
  managerCpf?: string
  managerId?: number
  manager?: any
  status?: any
  email?: string
  name?: string
  pixKey?: string
  pixType?: string
  role?: any
  cnpj?: any
  phone?: string
  state?: any
  city?: string
  user_address?: address
  // Cluster?: any
  clustertypes?: number[]
  Group?: any
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export interface UserAdmin {
  id?: number
  name?: string
  email?: string
  password?: string
  status?: string
  confirm?: string
}

interface address {
  cep?: string
  street?: string
  number?: string
  complement?: string
  city?: string
  state?: string
  country?: string
}
