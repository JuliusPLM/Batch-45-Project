
const routes = [
  {
    path: '/',
    component: () => import('src/pages/TodoApp.vue')
    // component: () => import('layouts/MainLayout.vue'),
    // children: [
    //   { path: '', component: () => import('pages/IndexPage.vue') }
    // ]
  },
  {
    path: '/another',
    component: () => import('pages/AnotherPage.vue'),
    children: [
      { path: ':id', component: () => import('pages/IndexPage.vue') },
      { path: ':id/:user', component: () => import('pages/IndexPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
