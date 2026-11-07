<template>
  <div class="page">
    <h1>Вход</h1>

    <form @submit.prevent="onSubmit">
      <div>
        <label>Логин</label>
        <input v-model="username" type="text" placeholder="admin / user" />
      </div>
      <div>
        <label>Пароль</label>
        <input v-model="password" type="password" placeholder="admin123 / user123" />
      </div>

      <p v-if="error" class="error">{{ error }}</p>

      <button type="submit">Войти</button>
    </form>

    <p class="hint">admin / admin123 — админ, user / user123 — пользователь</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const username = ref('')
const password = ref('')
const error = ref('')

const onSubmit = () => {
  error.value = ''
  try {
    authStore.login({ username: username.value, password: password.value })
    const redirect = route.query.redirect || '/profile'
    router.push(redirect)
  } catch (e) {
    error.value = e.message
  }
}
</script>

<style scoped>
.page { max-width: 320px; }
form > div { margin-bottom: 0.75rem; display: flex; flex-direction: column; }
input { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
button { padding: 0.7rem 1rem; background: #3082f6; color: white; border: none; border-radius: 4px; cursor: pointer; }
.error { color: #c62828; }
.hint { color: #777; font-size: 0.85rem; margin-top: 1rem; }
</style>