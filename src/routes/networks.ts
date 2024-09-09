export const networks = [
  {
    path: '/redes',
    name: 'Redes',
    component: () => import('../views/networks/list-networks.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/adicionar-rede',
    name: 'Adicionar rede',
    component: () => import('../views/networks/createupdate-network.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/editar-rede/:id',
    name: 'Editar rede',
    component: () => import('../views/networks/createupdate-network.vue'),
    meta: {
      auth: true
    }
  }
]
