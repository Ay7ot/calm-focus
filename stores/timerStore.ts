import { create } from 'zustand'

type TimerMode = 'focus' | 'break'

interface TimerState {
    timeLeft: number
    duration: number
    isActive: boolean
    mode: TimerMode
    setDuration: (seconds: number) => void
    toggleTimer: () => void
    resetTimer: () => void
    tick: () => void
    setMode: (mode: TimerMode) => void
}

export const useTimerStore = create<TimerState>((set, get) => ({
    timeLeft: 25 * 60, // 25 minutes default
    duration: 25 * 60,
    isActive: false,
    mode: 'focus',

    setDuration: (seconds) => set({ duration: seconds, timeLeft: seconds, isActive: false }),

    toggleTimer: () => set((state) => ({ isActive: !state.isActive })),

    resetTimer: () => set((state) => ({ timeLeft: state.duration, isActive: false })),

    tick: () => {
        const { timeLeft, isActive } = get()
        if (isActive && timeLeft > 0) {
            set({ timeLeft: timeLeft - 1 })
        } else if (isActive && timeLeft === 0) {
            set({ isActive: false })
            // Play sound or notify here?
        }
    },

    setMode: (mode) => {
        const newDuration = mode === 'focus' ? 25 * 60 : 5 * 60
        set({ mode, duration: newDuration, timeLeft: newDuration, isActive: false })
    },
}))

