'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Send } from 'lucide-react'
import Select from '@/components/Select'
import Toast from '@/components/Toast'
import { createPost } from '../actions'

const categoryOptions = [
    {
        value: 'general',
        label: 'General Chat',
        description: 'Casual conversations and everyday topics',
        icon: '💬'
    },
    {
        value: 'strategies',
        label: 'Strategies & Tips',
        description: 'Share and learn focus techniques',
        icon: '💡'
    },
    {
        value: 'wins',
        label: 'Small Wins',
        description: 'Celebrate your achievements',
        icon: '🎉'
    },
    {
        value: 'venting',
        label: 'Venting (Safe Space)',
        description: 'Share struggles in a supportive environment',
        icon: '💙'
    }
]

export default function NewPostForm() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
    const formRef = useRef<HTMLFormElement>(null)

    const handleSubmit = async (formData: FormData) => {
        startTransition(async () => {
            const result = await createPost(formData)

            if (result?.error) {
                setToast({ message: result.error, type: 'error' })
            } else {
                setToast({ message: 'Discussion posted successfully!', type: 'success' })
                formRef.current?.reset()
                setTimeout(() => {
                    router.push('/forum')
                }, 1500)
            }
        })
    }

    return (
        <>
            <div className="card">
                <form ref={formRef} action={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="category" className="block text-sm font-semibold text-on-surface mb-2">
                            Category
                        </label>
                        <Select
                            name="category"
                            id="category"
                            options={categoryOptions}
                            defaultValue="general"
                            required
                        />
                        <p className="text-xs text-on-surface-secondary mt-2">
                            Choose the most relevant category for your discussion
                        </p>
                    </div>

                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-on-surface mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            placeholder="What's on your mind?"
                            className="input w-full"
                            disabled={isPending}
                        />
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-semibold text-on-surface mb-2">
                            Content
                        </label>
                        <textarea
                            name="content"
                            id="content"
                            required
                            rows={12}
                            placeholder="Share your thoughts, experiences, or questions..."
                            className="input w-full min-h-[240px] py-3 resize-none"
                            disabled={isPending}
                        />
                        <p className="text-xs text-on-surface-secondary mt-2">
                            Be respectful and supportive. This is a safe space.
                        </p>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-border">
                        <Link href="/forum" className="btn btn-secondary">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Posting...
                                </>
                            ) : (
                                <>
                                    <Send size={18} />
                                    Post Discussion
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Guidelines Card */}
            <div className="card bg-backplate mt-6">
                <h3 className="font-semibold text-on-surface mb-4 flex items-center gap-2">
                    <span className="text-lg">💙</span>
                    Community Guidelines
                </h3>
                <ul className="space-y-3 text-sm text-on-surface-secondary">
                    <li className="flex items-start gap-3">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Be kind and supportive to all community members</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Share your experiences honestly but respectfully</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-primary mt-0.5">•</span>
                        <span>No medical advice - always consult healthcare professionals</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Respect privacy - don't share others' personal information</span>
                    </li>
                </ul>
            </div>

            {toast && (
                <Toast
                    isOpen={toast !== null}
                    message={toast.message}
                    variant={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    )
}

