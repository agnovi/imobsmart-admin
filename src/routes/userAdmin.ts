export const userAdmin = [
  {
    path: '/usuarios-admin',
    name: 'UsersAdmin',
    component: () => import('../views/userAdmin/list.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/adicionar-usuario-admin',
    name: 'User admin create',
    component: () => import('../views/userAdmin/createupdate.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/editar-usuario-admin/:id',
    name: 'User admin update',
    component: () => import('../views/userAdmin/createupdate.vue'),
    meta: {
      auth: true
    }
  }
]
