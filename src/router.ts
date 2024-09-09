import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import useAuth from '@/composables/useSession'

import Dashboard from './views/Dashboard.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Login',
    component: () => import('./views/auth/Login.vue'),
    meta: { layout: 'empty' }
  },
  {
    path: '/recuperar-senha',
    name: 'Recuperar senha',
    component: () => import('./views/auth/recovery-password.vue'),
    meta: { layout: 'empty' }
  },

  {
    path: '/redefinir-credenciais',
    name: 'Redefinir senha',
    component: () => import('./views/auth/redefine-password.vue'),
    meta: { layout: 'empty' }
  },
  {
    path: '/usuarios-admin',
    name: 'UsersAdmin',
    component: () => import('./views/userAdmin/list.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/adicionar-usuario-admin',
    name: 'User admin create',
    component: () => import('./views/userAdmin/createupdate.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/editar-usuario-admin/:id',
    name: 'User admin update',
    component: () => import('./views/userAdmin/createupdate.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/usuarios',
    name: 'Users',
    component: () => import('./views/user/list.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/adicionar-usuario',
    name: 'User create',
    component: () => import('./views/user/createupdate.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/editar-usuario/:id',
    name: 'User update',
    component: () => import('./views/user/createupdate.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/importar',
    name: 'Importar',
    component: () => import('./views/ImportUsers.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      auth: true
    }
  },
  {
    path: '/perfil',
    name: 'Profile',
    component: () => import('./views/Profile.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/cargos',
    name: 'Cargos',
    component: () => import('./views/role/list-role.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/adicionar-cargo',
    name: 'Adicionar cargo',
    component: () => import('./views/role/createupdate-role.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/editar-cargo/:id',
    name: 'Editar cargo',
    component: () => import('./views/role/createupdate-role.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/setores',
    name: 'Setores',
    component: () => import('./views/sector/list-sector.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/adicionar-setor',
    name: 'Adicionar setor',
    component: () => import('./views/sector/createupdate-sector.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/editar-setor/:id',
    name: 'Editar setor',
    component: () => import('./views/sector/createupdate-sector.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/imoveis',
    name: 'Imóveis',
    component: () => import('./views/property/list.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/adicionar-imovel',
    name: 'Adicionar imovel',
    component: () => import('./views/property/createupdate.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/editar-imovel/:id',
    name: 'Editar imovel',
    component: () => import('./views/property/createupdate.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/importar-usuarios',
    name: 'ImportarUsuarios',
    component: () => import('./views/ImportUsers.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/importar-imoveis',
    name: 'ImportarImoveis',
    component: () => import('./views/ImportCompanies.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/importacoes',
    name: 'Importacoes',
    component: () => import('./views/import/list-import.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/contatos',
    name: 'Contatos',
    component: () => import('./views/contacts/list-contacts.vue'),
    meta: {
      auth: true
    }
  },
  // fim
  {
    path: '/:pathMath(.*)*',
    redirect: {
      name: 'Login'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const { token } = useAuth()

  if (to.meta.auth && !token.value) {
    return next('/')
  }
  if (to.path === '/' && token.value) {
    return next('/dashboard')
  }
  next(true)
})

export default router
