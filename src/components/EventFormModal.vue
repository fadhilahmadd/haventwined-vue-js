<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg w-full max-w-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">
          {{ event?.id ? 'Edit Event' : 'Buat Event Baru' }}
        </h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          &times;
        </button>
      </div>

      <Form @submit="handleSubmit" class="space-y-4">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Judul Event</label>
          <Field name="title" v-model="formData.title" rules="required" class="w-full px-3 py-2 border rounded-md" />
          <ErrorMessage name="title" class="text-red-500 text-sm" />
        </div>

        <!-- Dates -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
            <Field name="startDate" type="date" v-model="formData.startDate" rules="required"
              class="w-full px-3 py-2 border rounded-md" />
            <ErrorMessage name="startDate" class="text-red-500 text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Berakhir</label>
            <Field name="endDate" type="date" v-model="formData.endDate" rules="required|after_date:startDate"
              class="w-full px-3 py-2 border rounded-md" />
            <ErrorMessage name="endDate" class="text-red-500 text-sm" />
          </div>
        </div>

        <!-- Location -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
          <Field name="location" v-model="formData.location" rules="required"
            class="w-full px-3 py-2 border rounded-md" />
          <ErrorMessage name="location" class="text-red-500 text-sm" />
        </div>

        <!-- Attendees -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Perkiraan Peserta</label>
          <Field name="attendees" type="number" v-model="formData.attendees" rules="required|min_value:1"
            class="w-full px-3 py-2 border rounded-md" />
          <ErrorMessage name="attendees" class="text-red-500 text-sm" />
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <Field name="status" as="select" v-model="formData.status" rules="required"
            class="w-full px-3 py-2 border rounded-md">
            <option value="open">Buka</option>
            <option value="closed">Tutup</option>
          </Field>
          <ErrorMessage name="status" class="text-red-500 text-sm" />
        </div>

        <!-- Image Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Gambar Event</label>
          <input type="file" accept="image/*" @change="handleImageUpload"
            class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          <img v-if="previewImage" :src="previewImage" class="mt-2 h-32 object-cover rounded" />
          <img v-if="event.image && !previewImage" :src="event.image" class="mt-2 h-32 object-cover rounded" />
        </div>

        <!-- Buttons -->
        <div class="flex justify-end space-x-4">
          <button type="button" @click="$emit('close')" class="px-4 py-2 text-gray-700 hover:text-gray-900">
            Batal
          </button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Simpan
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate'

export default {
  components: { Form, Field, ErrorMessage },
  props: {
    show: {  // Add this prop
      type: Boolean,
      required: true
    },
    event: {
      type: Object,
      default: () => ({}),
      validator: (value) => !!value && typeof value === 'object'
    }
  },
  data() {
    return {
      formData: {
        title: '',
        startDate: '',
        endDate: '',
        location: '',
        attendees: '',
        status: 'open',
        image: null
      },
      previewImage: null
    }
  },
  watch: {
    event: {
      immediate: true,
      handler(newVal) {
        if (newVal?.id) { // Use optional chaining
          this.formData = {
            ...newVal,
            image: null // Reset image input when editing
          };
          this.previewImage = null;
        } else {
          this.resetForm();
        }
      }
    }
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.formData.image = file
        this.previewImage = URL.createObjectURL(file)
      }
    },
    handleSubmit() {
      this.$emit('save', {
        ...this.formData,
        id: this.event.id || null
      })
    },
    resetForm() {
      this.formData = {
        title: '',
        startDate: '',
        endDate: '',
        location: '',
        attendees: '',
        status: 'open',
        image: null
      }
      this.previewImage = null
    }
  }
}
</script>