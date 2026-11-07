import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import LoginPage from '../pages/LoginPage.vue'
import ProfilePage from '../pages/ProfilePage.vue'
import AdminPage from '../pages/AdminPage.vue'

const routes = [
  { path: '/', redirect: '/profile' },
  { path: '/login', name: 'login', component: LoginPage, meta: { public: true } },
  { path: '/profile', name: 'profile', component: ProfilePage },
  { path: '/admin', name: 'admin', component: AdminPage, meta: { requiresAdmin: true } },
  // заглушка, если очень нужен редирект с неизвестных путей
  { path: '/:pathMatch(.*)*', redirect: '/profile' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  // Публичные страницы доступны всем
  if (to.meta.public) {
    // Если уже авторизован и идёт на /login — отправляем в профиль
    if (to.name === 'login' && auth.isAuthenticated) {
      return { name: 'profile' }
    }
    return true
  }

  // Не авторизован — на логин
  if (!auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // Только для админа
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'profile' } // или на /unauthorized (см. вариант 2)
  }

  return true
})

export default router