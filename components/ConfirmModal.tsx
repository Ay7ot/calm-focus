'use client'

import { X, AlertTriangle, Info, CheckCircle } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface ConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning' | 'info' | 'success'
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'warning',
}: ConfirmModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    const handleConfirm = () => {
        onConfirm()
    }

    if (!isOpen) return null

    const variantStyles = {
        danger: {
            icon: <AlertTriangle size={48} className="text-error" />,
            confirmButton: 'bg-error hover:bg-error/90 text-white',
        },
        warning: {
            icon: <AlertTriangle size={48} className="text-warning" />,
            confirmButton: 'bg-warning hover:bg-warning/90 text-white',
        },
        info: {
            icon: <Info size={48} className="text-primary" />,
            confirmButton: 'bg-primary hover:bg-primary-dark text-on-primary',
        },
        success: {
            icon: <CheckCircle size={48} className="text-success" />,
            confirmButton: 'bg-success hover:bg-success/90 text-white',
        },
    }

    const currentVariant = variantStyles[variant]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div
                ref={modalRef}
                className="bg-surface border border-border rounded-lg shadow-xl max-w-md w-full"
            >
                {/* Icon & Content */}
                <div className="p-6 text-center">
                    <div className="flex justify-center mb-4">{currentVariant.icon}</div>

                    <h2 className="text-xl font-bold text-on-surface mb-2">{title}</h2>
                    <p className="text-on-surface-secondary text-sm leading-relaxed">{message}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 px-6 pb-6">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-surface-elevated text-on-surface font-medium hover:bg-backplate transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={confirmText.includes('...') || confirmText.toLowerCase().includes('deleting') || confirmText.toLowerCase().includes('saving')}
                        className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${currentVariant.confirmButton} flex items-center justify-center gap-2`}
                    >
                        {(confirmText.includes('...') || confirmText.toLowerCase().includes('deleting') || confirmText.toLowerCase().includes('saving')) && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        )}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}

