import { create } from 'zustand';

export const useAAAStore = create((set, get) => ({
    // state
    data: [],

    // actions
    onReset: () => set({ data: [] }),
}));
