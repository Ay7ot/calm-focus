import { create } from 'zustand'

type TimerMode = 'focus' | 'break'

interface UserPreferences {
    defaultFocusDuration: number // in minutes
    defaultBreakDuration: number // in minutes
}

interface TimerState {
    timeLeft: number
    duration: number
    isActive: boolean
    mode: TimerMode
    hasCompleted: boolean
    userPreferences: UserPreferences
    onComplete?: (durationSeconds: number, mode: TimerMode) => void
    setDuration: (seconds: number) => void
    toggleTimer: () => void
    resetTimer: () => void
    tick: () => void
    setMode: (mode: TimerMode) => void
    setOnComplete: (callback: (durationSeconds: number, mode: TimerMode) => void) => void
    setUserPreferences: (preferences: UserPreferences) => void
}

export const useTimerStore = create<TimerState>((set, get) => ({
    timeLeft: 25 * 60, // 25 minutes default
    duration: 25 * 60,
    isActive: false,
    mode: 'focus',
    hasCompleted: false,
    userPreferences: {
        defaultFocusDuration: 25,
        defaultBreakDuration: 5,
    },
    onComplete: undefined,

    setDuration: (seconds) => set({ duration: seconds, timeLeft: seconds, isActive: false, hasCompleted: false }),

    toggleTimer: () => set((state) => ({ isActive: !state.isActive })),

    resetTimer: () => set((state) => ({ timeLeft: state.duration, isActive: false, hasCompleted: false })),

    tick: () => {
        const { timeLeft, isActive, duration, mode, onComplete, hasCompleted } = get()
        if (isActive && timeLeft > 0) {
            set({ timeLeft: timeLeft - 1 })
        } else if (isActive && timeLeft === 0 && !hasCompleted) {
            set({ isActive: false, hasCompleted: true })
            // Call completion callback only once
            if (onComplete) {
                onComplete(duration, mode)
            }
        }
    },

    setMode: (mode) => {
        const { userPreferences } = get()
        const newDuration = mode === 'focus'
            ? userPreferences.defaultFocusDuration * 60
            : userPreferences.defaultBreakDuration * 60
        set({ mode, duration: newDuration, timeLeft: newDuration, isActive: false, hasCompleted: false })
    },

    setOnComplete: (callback) => set({ onComplete: callback }),

    setUserPreferences: (preferences) => {
        const { mode } = get()
        const newDuration = mode === 'focus'
            ? preferences.defaultFocusDuration * 60
            : preferences.defaultBreakDuration * 60
        set({
            userPreferences: preferences,
            duration: newDuration,
            timeLeft: newDuration,
            isActive: false,
            hasCompleted: false
        })
    },
}))

