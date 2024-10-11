import { useStorage } from '@vueuse/core'
import * as authService from '@/api/services/AuthService'
import { IUser } from '@/types/user'
import router from '@/router'

const userState = useStorage('user', { id: '' } as any)
const token = useStorage('token', '')

export default () => {
  function login(user: Pick<IUser, 'email' | 'password'>) {
    return authService.login({ email: user.email, password: user.password }).then((res) => {
      if (res.data.access_token) {
        userState.value = { ...res.data }
        token.value = res.data.access_token
        return res.data
      } else {
        return { error: true, response: res.data }
      }
    })
  }

  const logout = async () => {
    token.value = null
    userState.value = {}
    router.push('/')
  }

  const refreshAccessToken = async (refresh_token: string) => {
    return authService.refreshToken(refresh_token).then((res) => {
      userState.value = { ...res.data }
    })
  }

  return {
    userState,
    token,
    login,
    logout,
    refreshAccessToken
  }
}
