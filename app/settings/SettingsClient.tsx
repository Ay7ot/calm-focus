'use client'

import { useState, useTransition, useRef } from 'react'
import { User, Settings, Save } from 'lucide-react'
import Toast from '@/components/Toast'
import { updateProfile } from './actions'

interface SettingsClientProps {
  userEmail: string
  username: string
  fullName: string
  dailyGoal: number
  defaultFocusDuration: number
  defaultBreakDuration: number
}

type Tab = 'profile' | 'preferences'

export default function SettingsClient({
  userEmail,
  username,
  fullName,
  dailyGoal,
  defaultFocusDuration,
  defaultBreakDuration
}: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [isPending, startTransition] = useTransition()
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const profileFormRef = useRef<HTMLFormElement>(null)
  const preferencesFormRef = useRef<HTMLFormElement>(null)

  const handleProfileSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateProfile(formData)

      if (result?.error) {
        setToast({ message: result.error, type: 'error' })
      } else {
        setToast({ message: 'Profile updated successfully!', type: 'success' })
      }
    })
  }

  const handlePreferencesSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateProfile(formData)

      if (result?.error) {
        setToast({ message: result.error, type: 'error' })
      } else {
        setToast({ message: 'Preferences updated successfully!', type: 'success' })
        // Reload the page to update the timer store
        window.location.reload()
      }
    })
  }

  return (
    <div className="mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12 max-w-4xl">

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'profile'
            ? 'text-primary border-b-2 border-primary'
            : 'text-on-surface-secondary hover:text-on-surface'
            }`}
        >
          <User size={18} />
          Profile
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'preferences'
            ? 'text-primary border-b-2 border-primary'
            : 'text-on-surface-secondary hover:text-on-surface'
            }`}
        >
          <Settings size={18} />
          Preferences
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card">
          <h2 className="text-xl font-bold text-on-surface mb-6">Profile Information</h2>

          <form ref={profileFormRef} action={handleProfileSubmit} className="space-y-6">
            {/* Email (Read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-on-surface mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={userEmail}
                disabled
                className="input w-full bg-backplate cursor-not-allowed"
              />
              <p className="text-xs text-on-surface-secondary mt-2">
                Email cannot be changed. Contact support if you need assistance.
              </p>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-on-surface mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                defaultValue={username}
                required
                placeholder="Choose a username"
                className="input w-full"
                disabled={isPending}
              />
              <p className="text-xs text-on-surface-secondary mt-2">
                Your username is visible to other community members.
              </p>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-semibold text-on-surface mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                id="full_name"
                defaultValue={fullName}
                placeholder="Your full name (optional)"
                className="input w-full"
                disabled={isPending}
              />
              <p className="text-xs text-on-surface-secondary mt-2">
                Optional. Your full name is private and not shown publicly.
              </p>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-border">
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="card">
          <h2 className="text-xl font-bold text-on-surface mb-6">Focus Preferences</h2>

          <form ref={preferencesFormRef} action={handlePreferencesSubmit} className="space-y-6">
            {/* Daily Goal */}
            <div>
              <label htmlFor="daily_goal" className="block text-sm font-semibold text-on-surface mb-2">
                Daily Focus Goal
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  name="daily_goal"
                  id="daily_goal"
                  min="1"
                  max="20"
                  defaultValue={dailyGoal}
                  required
                  className="input w-32"
                  disabled={isPending}
                />
                <span className="text-sm text-on-surface">sessions per day</span>
              </div>
              <p className="text-xs text-on-surface-secondary mt-2">
                Set your daily target for focus sessions.
              </p>
            </div>

            {/* Default Timer Duration */}
            <div>
              <label htmlFor="default_focus_duration" className="block text-sm font-semibold text-on-surface mb-2">
                Default Timer Duration
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  name="default_focus_duration"
                  id="default_focus_duration"
                  min="5"
                  max="60"
                  step="5"
                  defaultValue={defaultFocusDuration}
                  required
                  className="input w-32"
                  disabled={isPending}
                />
                <span className="text-sm text-on-surface">minutes</span>
              </div>
              <p className="text-xs text-on-surface-secondary mt-2">
                Default duration for focus sessions (5-60 minutes).
              </p>
            </div>

            {/* Break Duration */}
            <div>
              <label htmlFor="default_break_duration" className="block text-sm font-semibold text-on-surface mb-2">
                Default Break Duration
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  name="default_break_duration"
                  id="default_break_duration"
                  min="1"
                  max="30"
                  defaultValue={defaultBreakDuration}
                  required
                  className="input w-32"
                  disabled={isPending}
                />
                <span className="text-sm text-on-surface">minutes</span>
              </div>
              <p className="text-xs text-on-surface-secondary mt-2">
                Default duration for break sessions (1-30 minutes).
              </p>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-border">
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          isOpen={toast !== null}
          message={toast.message}
          variant={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}


