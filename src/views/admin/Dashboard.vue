<template>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold">Kelola Event</h3>
        <button @click="createNewEvent" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Buat Event Baru
        </button>
      </div>
  
      <!-- Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-blue-50 p-4 rounded-lg">
          <h4 class="text-gray-500">Total Event</h4>
          <p class="text-3xl font-bold text-blue-600">{{ stats.total_events }}</p>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
          <h4 class="text-gray-500">Event Aktif</h4>
          <p class="text-3xl font-bold text-green-600">{{ stats.open_events }}</p>
        </div>
        <div class="bg-red-50 p-4 rounded-lg">
          <h4 class="text-gray-500">Event Berakhir</h4>
          <p class="text-3xl font-bold text-red-600">{{ stats.closed_events }}</p>
        </div>
        <div class="bg-purple-50 p-4 rounded-lg">
          <h4 class="text-gray-500">Rata-rata Peserta</h4>
          <p class="text-3xl font-bold text-purple-600">{{ stats.avg_attendees }}</p>
        </div>
      </div>
  
      <!-- Events Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="text-left border-b">
              <th class="pb-3">Gambar</th>
              <th class="pb-3">Judul</th>
              <th class="pb-3">Tanggal</th>
              <th class="pb-3">Lokasi</th>
              <th class="pb-3">Status</th>
              <th class="pb-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in events" :key="event.id" class="border-b">
              <td class="py-4">
                <img :src="event.image" class="w-20 h-12 object-cover rounded">
              </td>
              <td class="py-4">{{ event.title }}</td>
              <td class="py-4">
                {{ formatDate(event.startDate) }} - {{ formatDate(event.endDate) }}
              </td>
              <td class="py-4">{{ event.location }}</td>
              <td class="py-4">
                <span :class="statusClass(event.status)" class="px-3 py-1 rounded-full text-sm">
                  {{ event.status === 'open' ? 'Buka' : 'Tutup' }}
                </span>
              </td>
              <td class="py-4 space-x-2">
                <button @click="editEvent(event)" class="text-blue-600 hover:text-blue-800">
                  Edit
                </button>
                <button @click="deleteEvent(event.id)" class="text-red-600 hover:text-red-800">
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Create/Edit Modal -->
      <EventFormModal :show="showCreateModal || showEditModal" :event="selectedEvent" @close="closeModal"
        @save="handleSave" />
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import EventFormModal from '@/components/EventFormModal.vue'
  import { Form, Field, ErrorMessage } from 'vee-validate'
  
  export default {
    components: {
      EventFormModal,
      Form,
      Field,
      ErrorMessage
    },
    data() {
      return {
        events: [],
        stats: {
          total_events: 0,
          open_events: 0,
          closed_events: 0,
          avg_attendees: 0
        },
        showCreateModal: false,
        showEditModal: false,
        selectedEvent: null
      }
    },
    mounted() {
      this.fetchEvents()
      this.fetchStats()
    },
    methods: {
      async fetchEvents() {
        try {
          const response = await axios.get('/api/events')
          this.events = response.data.data
        } catch (error) {
          console.error('Error fetching events:', error)
          alert('Gagal memuat daftar event.')
        }
      },
      async fetchStats() {
        try {
          const response = await axios.get('/api/events/stats')
          this.stats = response.data
        } catch (error) {
          console.error('Error fetching stats:', error)
          alert('Gagal memuat statistik event.')
        }
      },
      statusClass(status) {
        return {
          'bg-green-100 text-green-800': status === 'open',
          'bg-red-100 text-red-800': status === 'closed'
        }
      },
      formatDate(dateStr) {
        const options = { day: 'numeric', month: 'short', year: 'numeric' }
        return new Date(dateStr).toLocaleDateString('id-ID', options)
      },
      editEvent(event) {
        this.selectedEvent = { ...event }
        this.showEditModal = true
        this.showCreateModal = false 
      },
      async deleteEvent(id) {
        if (confirm('Apakah Anda yakin ingin menghapus event ini?')) {
          try {
            const response = await axios.delete(`/api/events/${id}`)
            alert(response.data.message) 
            this.fetchEvents()
            this.fetchStats()
          } catch (error) {
            console.error('Error deleting event:', error)
            alert('Gagal menghapus event.')
          }
        }
      },
      createNewEvent() {
        this.selectedEvent = {} 
        this.showCreateModal = true
      },
      closeModal() {
        this.showCreateModal = false
        this.showEditModal = false
        this.selectedEvent = {} 
      },
      async handleSave(eventData) {
        const formData = new FormData()
        Object.entries(eventData).forEach(([key, value]) => {
          if (value) formData.append(key, value)
        })
  
        try {
          let response
          if (eventData.id) {
            formData.append('_method', 'PUT')
            response = await axios.post(`/api/events/${eventData.id}`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            })
          } else {
            response = await axios.post('/api/events', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            })
          }
          if (response.data.message) {
            alert(response.data.message)
          }
          this.fetchEvents()
          this.fetchStats()
          this.closeModal()
        } catch (error) {
          console.error('Error saving event:', error)
          alert('Gagal menyimpan event.')
        }
      }
    }
  }
  </script>
  