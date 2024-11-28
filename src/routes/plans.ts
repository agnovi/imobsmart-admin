export const plans = [
  {
    path: '/planos',
    name: 'Plans',
    component: () => import('../views/plans/list.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/adicionar-planos',
    name: 'Plans create',
    component: () => import('../views/plans/createupdate.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/editar-planos/:id',
    name: 'Plans update',
    component: () => import('../views/plans/createupdate.vue'),
    meta: {
      auth: true
    }
  }
]
