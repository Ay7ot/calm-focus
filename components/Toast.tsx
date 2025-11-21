'use client'

import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'

interface ToastProps {
    isOpen: boolean
    onClose: () => void
    message: string
    variant?: 'success' | 'error' | 'info' | 'warning'
    duration?: number
}

export default function Toast({
    isOpen,
    onClose,
    message,
    variant = 'info',
    duration = 3000,
}: ToastProps) {
    useEffect(() => {
        if (isOpen && duration > 0) {
            const timer = setTimeout(onClose, duration)
            return () => clearTimeout(timer)
        }
    }, [isOpen, duration, onClose])

    if (!isOpen) return null

    const variantStyles = {
        success: {
            icon: <CheckCircle size={20} />,
            classes: 'bg-success border-success text-white',
        },
        error: {
            icon: <AlertCircle size={20} />,
            classes: 'bg-error border-error text-white',
        },
        warning: {
            icon: <AlertTriangle size={20} />,
            classes: 'bg-warning border-warning text-white',
        },
        info: {
            icon: <Info size={20} />,
            classes: 'bg-primary border-primary text-white',
        },
    }

    const currentVariant = variantStyles[variant]

    return (
        <div className="fixed top-4 right-4 z-50 animate-slideInRight">
            <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[300px] max-w-md ${currentVariant.classes}`}
            >
                {currentVariant.icon}
                <p className="flex-1 text-sm font-medium">{message}</p>
                <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-black transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    )
}

