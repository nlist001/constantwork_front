import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'todo',
      component: () => import('../views/todo/TodoView.vue'),
    },
    {
      path: '/task/create',
      name: 'createTask',
      component: () => import('../views/todo/AddEditTask.vue'),
    },
    {
      path: '/task/:id',
      name: 'editTask',
      component: () => import('../views/todo/AddEditTask.vue'),
    },
    

    // {
    //   path: '/about',
    //   name: 'about',

    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

export default router
