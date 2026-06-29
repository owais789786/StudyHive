// src/utils/toast.js
import toast from 'react-hot-toast'

export const showSuccess = (msg) => toast.success(msg)
export const showError = (msg) => toast.error(msg)
export const showLoading = (msg) => toast.loading(msg)
export const showInfo = (msg) => toast(msg, {
    icon: 'ℹ️',
    style: {
        background: '#110E1F', // Aap ka dark theme background
        color: '#fff',
        border: '1px solid rgba(140, 48, 229, 0.2)' // Halka sa purple border
    }
})