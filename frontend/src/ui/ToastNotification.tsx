'use client'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

export default function ToastNotification() {
    return <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        limit={3}
    />
}
