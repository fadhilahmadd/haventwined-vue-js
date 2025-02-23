<template>
    <div class="min-h-screen bg-gray-100">
      <!-- Sidebar -->
      <aside class="bg-white w-64 fixed h-full shadow-lg">
        <div class="p-4 border-b">
          <h2 class="text-xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        <nav class="mt-4">
          <router-link 
            to="/admin/dashboard" 
            class="block px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
          >
            Dashboard
          </router-link>
        </nav>
      </aside>
  
      <!-- Main Content -->
      <main class="ml-64 p-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-2xl font-bold text-gray-800">Selamat Datang,</h1>
          <div class="flex items-center space-x-4">
            <!-- Halaman Utama Button -->
            <a 
              href="/" 
              target="_blank"
              class="flex items-center text-blue-600 hover:text-blue-800"
            >
              <!-- Optionally, you can include a home icon here -->
              Halaman Utama
            </a>
            <div class="h-6 border-l border-gray-300 mx-2"></div>
            <!-- Logout Button -->
            <button 
              @click="handleLogout"
              class="flex items-center text-red-600 hover:text-red-800"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
  
        <!-- Content -->
        <router-view></router-view>
      </main>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      handleLogout() {
        localStorage.removeItem('auth_token')
        sessionStorage.removeItem('auth_token')
        this.$router.push('/')
      }
    }
  }
  </script>
  