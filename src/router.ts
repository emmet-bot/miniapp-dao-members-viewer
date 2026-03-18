import { createRouter, createWebHashHistory } from 'vue-router'
import MembersView from './views/MembersView.vue'

export const router = createRouter({
  history: createWebHashHistory('/miniapp-dao-members-viewer/'),
  routes: [
    {
      path: '/:chainId/:address',
      name: 'members',
      component: MembersView,
      props: true,
    },
    {
      path: '/',
      redirect: '/42/0x888033b1492161B5F867573d675d178FA56854Ae',
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/42/0x888033b1492161B5F867573d675d178FA56854Ae',
    },
  ],
})
