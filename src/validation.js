import { defineRule } from 'vee-validate'

defineRule('required', value => {
  if (!value) return 'Field wajib diisi'
  return true
})

defineRule('after_date', (value, [startDate]) => {
  if (new Date(value) < new Date(startDate)) {
    return 'Tanggal berakhir harus setelah tanggal mulai'
  }
  return true
})

defineRule('min_value', (value, [min]) => {
  if (Number(value) < min) return `Harus lebih besar dari ${min}`
  return true
})