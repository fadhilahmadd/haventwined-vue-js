<template>
    <main class="min-h-screen bg-gray-50">

        <!-- Hero / Top Banner -->
        <section class="relative bg-[#4e598c] text-white">
            <div class="max-w-7xl mx-auto px-4 py-8 md:py-8 flex flex-col md:flex-row items-start md:items-center">
                <!-- Left text content -->
                <div class="md:w-1/2 space-y-4">
                    <img src="../assets/logo-2f.png" alt="Haventwined Logo" class="w-auto h-16 md:h-18">
                </div>

                <!-- Right image -->
                <div class="md:w-1/2 mt-8 md:mt-0 flex justify-end">
                    <router-link to="/login"
                        class="mt-2 inline-block bg-white text-blue-600 px-3 py-2 rounded-md font-semibold hover:bg-blue-100 transition-colors">
                        Masuk
                    </router-link>
                </div>
            </div>
        </section>

        <!-- CTA Banner: Jadilah Tenant -->
        <section class="bg-[#4e598c] py-6 shadow-sm border-b border-gray-100">
            <div
                class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div class="text-center md:text-left">
                    <h2 class="text-xl md:text-2xl font-semibold text-white">
                        Jadilah Tenant pada Event Pilihanmu
                    </h2>
                    <p class="text-white mt-1">
                        Mudah, Cepat, dan Tepat untuk mempromosikan produk kamu.
                    </p>
                </div>
                <!-- Replaced button with BannerCarousel -->
                <BannerCarousel />
            </div>
        </section>

        <!-- Event Terpopuler -->
        <div class="max-w-7xl mx-auto px-4 py-12">
            <section class="mb-16">
                <h2 class="section-heading">Event Terpopuler</h2>
                <p class="mb-6 text-gray-600">
                    Yuk kepoin event yang lagi trending. Temukan pengalaman seru bersama kami!
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <EventCard v-for="event in popularEvents" :key="event.id" :event="event" />
                </div>
            </section>

            <!-- Event Terdekat / Pendaftaran Ditutup -->
            <section class="mb-12">
                <h2 class="text-xl md:text-2xl font-semibold mb-4">Pendaftaran Segera Ditutup</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <EventCard v-for="event in closingEvents" :key="event.id" :event="event" />
                </div>
            </section>

            <!-- Rekomendasi Event (example) -->
            <section class="mb-16">
                <h2 class="section-heading">Rekomendasi Event</h2>
                <p class="mb-6 text-gray-600">
                    Coba event pilihan yang cocok untuk kamu.
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- You can reuse EventCard or create a new one for recommended events -->
                    <EventCard v-for="(event, index) in popularEvents" :key="'reco-' + index" :event="event" />
                </div>
                <div class="text-center mt-8">
                    <button
                        class="inline-block bg-blue-600 text-white px-5 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors">
                        Tampilkan Lebih Banyak Event
                    </button>
                </div>
            </section>
        </div>

        <!-- Footer -->
        <FooterSection />
    </main>
</template>

<script>
import EventCard from '@/components/EventCard.vue'
import FooterSection from '@/components/FooterSection.vue'
import BannerCarousel from '@/components/BannerCarousel.vue'
import axios from 'axios'

export default {
    components: { EventCard, FooterSection, BannerCarousel },
    data() {
        return {
            popularEvents: [],
            closingEvents: [],
            recommendedEvents: []
        }
    },
    async mounted() {
        await this.fetchEvents()
    },
    methods: {
        async fetchEvents() {
            try {
                const response = await axios.get('/api/events')
                const allEvents = response.data.data

                // Get popular events (sorted by attendees)
                this.popularEvents = [...allEvents]
                    .sort((a, b) => b.attendees - a.attendees)
                    .slice(0, 3)

                // Get closing soon events (within 7 days)
                const today = new Date()
                this.closingEvents = allEvents.filter(event => {
                    const endDate = new Date(event.endDate)
                    const timeDiff = endDate - today
                    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
                    return daysDiff > 0 && daysDiff <= 7 && event.status === 'open'
                }).slice(0, 4)

                // Get recommended events (mix of popular and closing)
                this.recommendedEvents = [...this.popularEvents, ...this.closingEvents]
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3)

            } catch (error) {
                console.error('Error fetching events:', error)
                alert('Gagal memuat daftar event.')
            }
        },
        getEventStatus(endDate) {
            const today = new Date()
            const eventEnd = new Date(endDate)
            return eventEnd > today ? 'open' : 'closed'
        }
    }
}
</script>