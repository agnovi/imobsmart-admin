export const products = [
  {
    path: '/categorias-produtos',
    name: 'Categorias produtos',
    component: () => import('../views/products/list-categories.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/adicionar-categorias',
    name: 'Adicionar Categoria',
    component: () => import('../views/products/createupdate-categories.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/editar-categorias/:id',
    name: 'Editar categoria produto',
    component: () => import('../views/products/createupdate-categories.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/produtos',
    name: 'Produtos',
    component: () => import('../views/products/list-products.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/adicionar-produto',
    name: 'Adicionar Produto',
    component: () => import('../views/products/createupdate-products.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/editar-produto/:id',
    name: 'Editar produtos',
    component: () => import('../views/products/createupdate-products.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/importar-produtos',
    name: 'Importar produtos',
    component: () => import('../views/products/import-products.vue'),
    meta: {
      auth: true
    }
  }
]
