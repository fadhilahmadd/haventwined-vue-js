<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div class="w-full max-w-md rounded-2xl shadow-xl p-8 md:p-12 transition-all duration-300 hover:shadow-2xl">
            <!-- Logo -->
            <div class="flex justify-center mb-8">
                <img src="../assets/logo-2f.png" alt="Haventwined Logo" class="h-16">
            </div>

            <!-- Error Message -->
            <div v-if="error" class="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                {{ error }}
            </div>

            <!-- Form -->
            <form @submit.prevent="handleLogin" class="space-y-6">
                <!-- Email Input -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input v-model="email" type="email" required
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-300"
                        placeholder="email@contoh.com" :disabled="isLoading">
                </div>

                <!-- Password Input -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div class="relative">
                        <input v-model="password" :type="showPassword ? 'text' : 'password'" required
                            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-300 pr-12"
                            placeholder="••••••••" :disabled="isLoading">
                        <button type="button" @click="showPassword = !showPassword"
                            class="absolute right-3 top-3.5 text-gray-400 hover:text-blue-600" :disabled="isLoading">
                            <EyeIcon v-if="showPassword" class="w-6 h-6" />
                            <EyeOffIcon v-else class="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <!-- Remember & Forgot -->
                <div class="flex items-center justify-between">
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" v-model="rememberMe"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            :disabled="isLoading">
                        <span class="text-sm text-gray-600">Ingat saya</span>
                    </label>
                    <router-link to="/forgot-password" class="text-sm text-blue-600 hover:text-blue-800">
                        Lupa password?
                    </router-link>
                </div>

                <!-- Submit Button -->
                <button type="submit" :disabled="isLoading"
                    class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span v-if="isLoading" class="inline-flex items-center">
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        Memproses...
                    </span>
                    <span v-else>Masuk</span>
                </button>

                <!-- Register Link -->
                <p class="text-center text-sm text-gray-600">
                    Belum punya akun?
                    <router-link to="/register" class="text-blue-600 hover:text-blue-800 font-medium">
                        Daftar sekarang
                    </router-link>
                </p>
            </form>
        </div>
    </div>
</template>

<script>
import { EyeIcon, EyeOffIcon } from '@heroicons/vue/outline'
import axios from 'axios'

export default {
    components: { EyeIcon, EyeOffIcon },
    data() {
        return {
            email: '',
            password: '',
            showPassword: false,
            rememberMe: false,
            isLoading: false,
            error: null
        }
    },
    methods: {
        async handleLogin() {
            try {
                this.isLoading = true
                this.error = null

                // API call to Laravel backend
                const response = await axios.post('/api/login', {
                    email: this.email,
                    password: this.password
                })

                // Handle successful login
                if (response.data.success) {
                    // Store token based on "Remember Me" choice
                    const storage = this.rememberMe ? localStorage : sessionStorage
                    storage.setItem('auth_token', response.data.token)
                    
                    // Redirect to admin dashboard
                    this.$router.push('/admin')
                }

            } catch (error) {
                // Handle different error types
                if (error.response) {
                    // Laravel validation errors
                    const errors = error.response.data.errors
                    if (errors) {
                        this.error = Object.values(errors)[0][0]
                    } else {
                        this.error = error.response.data.message || 'Login gagal. Silakan coba lagi.'
                    }
                } else {
                    this.error = error.message || 'Terjadi kesalahan pada jaringan'
                }
            } finally {
                this.isLoading = false
            }
        }
    }
}
</script>