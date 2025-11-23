'use client'

import { useState, useTransition, useRef } from 'react'
import { MessageSquare } from 'lucide-react'
import Toast from '@/components/Toast'
import { createComment } from './actions'

interface CommentFormProps {
    postId: string
    userInitial: string
}

export default function CommentForm({ postId, userInitial }: CommentFormProps) {
    const [isPending, startTransition] = useTransition()
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
    const formRef = useRef<HTMLFormElement>(null)

    const handleSubmit = async (formData: FormData) => {
        startTransition(async () => {
            const result = await createComment(formData)

            if (result?.error) {
                setToast({ message: result.error, type: 'error' })
            } else {
                setToast({ message: 'Comment posted successfully!', type: 'success' })
                formRef.current?.reset()
            }
        })
    }

    return (
        <>
            <form ref={formRef} action={handleSubmit} className="mb-6 pb-6 border-b border-border">
                <input type="hidden" name="post_id" value={postId} />
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                        {userInitial}
                    </div>
                    <div className="flex-1">
                        <textarea
                            name="content"
                            required
                            rows={3}
                            placeholder="Add your thoughts..."
                            className="input w-full resize-none mb-3"
                            disabled={isPending}
                        />
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
                                    <MessageSquare size={18} />
                                    Post Comment
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>

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


