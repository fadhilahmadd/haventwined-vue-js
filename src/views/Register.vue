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

            <form @submit.prevent="handleRegister" class="space-y-6">
                <!-- Name Input -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                    <input v-model="name" type="text" required
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-300"
                        placeholder="Nama lengkap kamu" :disabled="isLoading">
                </div>

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

                <!-- Confirm Password Input -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password</label>
                    <div class="relative">
                        <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" required
                            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-300 pr-12"
                            placeholder="••••••••" :disabled="isLoading">
                        <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                            class="absolute right-3 top-3.5 text-gray-400 hover:text-blue-600" :disabled="isLoading">
                            <EyeIcon v-if="showConfirmPassword" class="w-6 h-6" />
                            <EyeOffIcon v-else class="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <!-- Terms Checkbox -->
                <div class="flex items-center">
                    <input type="checkbox" v-model="agreeTerms" required
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" :disabled="isLoading">
                    <span class="ml-2 text-sm text-gray-600">
                        Saya setuju dengan
                        <a href="#" class="text-blue-600 hover:text-blue-800">Syarat & Ketentuan</a>
                    </span>
                </div>

                <!-- Submit Button -->
                <button type="submit" :disabled="isLoading"
                    class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    <span v-if="isLoading">Mendaftarkan...</span>
                    <span v-else>Daftar Sekarang</span>
                </button>

                <!-- Login Link -->
                <p class="text-center text-sm text-gray-600">
                    Sudah punya akun?
                    <router-link to="/login" class="text-blue-600 hover:text-blue-800 font-medium">
                        Masuk disini
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
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            showPassword: false,
            showConfirmPassword: false,
            agreeTerms: false,
            isLoading: false,
            error: null
        }
    },
    methods: {
        async handleRegister() {
            try {
                this.isLoading = true
                this.error = null

                // Frontend validation
                if (this.password !== this.confirmPassword) {
                    throw new Error('Password dan konfirmasi password tidak sama')
                }

                // API call to Laravel backend
                const response = await axios.post('/api/register', {
                    name: this.name,
                    email: this.email,
                    password: this.password,
                    password_confirmation: this.confirmPassword
                })

                // Handle successful registration
                if (response.data.success) {
                    // Store token in localStorage
                    localStorage.setItem('auth_token', response.data.token)

                    this.$router.push('/login')
                }

            } catch (error) {
                // Handle different error types
                if (error.response) {
                    // Laravel validation errors
                    const errors = error.response.data.errors
                    if (errors) {
                        this.error = Object.values(errors)[0][0]
                    } else {
                        this.error = error.response.data.message || 'Registrasi gagal. Silakan coba lagi.'
                    }
                } else {
                    this.error = error.message
                }
            } finally {
                this.isLoading = false
            }
        }
    }
}
</script>