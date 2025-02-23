<template>
    <div class="event-card overflow-hidden animate-fade-in">
        <!-- Event image at top -->
        <img v-if="event.image" :src="event.image" alt="Event Image" class="w-full h-40 object-cover" />
        <div class="p-6">
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-lg font-bold text-gray-900">
                    {{ event.title }}
                </h3>
                <span class="status-badge" :class="event.status === 'closed'
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-blue-50 text-blue-800'">
                    {{ event.status === 'closed' ? 'Pendaftaran Ditutup' : 'Daftar Sekarang' }}
                </span>
            </div>
            <div class="space-y-2">
                <div class="flex items-center text-sm text-gray-500">
                    <CalendarIcon class="w-4 h-4 mr-2" />
                    <span>{{ formatDate(event.startDate) }} - {{ formatDate(event.endDate) }}</span>
                </div>
                <div class="flex items-center text-sm text-gray-600">
                    <LocationMarkerIcon class="w-4 h-4 mr-2" />
                    <span>{{ event.location }}</span>
                </div>
            </div>
            <div class="mt-4 pt-3 border-t border-gray-100">
                <span class="text-sm text-gray-500 flex items-center">
                    <UserGroupIcon class="w-4 h-4 mr-2" />
                    {{ event.attendees }} peserta
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { CalendarIcon, LocationMarkerIcon, UserGroupIcon } from '@heroicons/vue/outline'

export default {
    name: 'EventCard',
    components: { CalendarIcon, LocationMarkerIcon, UserGroupIcon },
    props: ['event'],
    methods: {
        formatDate(dateStr) {
            const options = { day: 'numeric', month: 'short', year: 'numeric' }
            return new Date(dateStr).toLocaleDateString('id-ID', options)
        }
    }
}
</script>