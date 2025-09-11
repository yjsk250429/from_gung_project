import { create } from 'zustand';
import { tourclassData } from '../api/tourclassData';

export const useTourClassStore = create(set=>{
    return{
        tourClass:tourclassData,
        setTour:()=>set((state)=>({
            tourClass:state.tourClass.filter((t)=>t.category === 'tour')
        })),
        setClass:()=>set((state)=>({
            tourClass:state.tourClass.filter((c)=>c.category === 'class')
        }))
    }

});

export const usexxStore = create((set, get) => ({
    // state
    data: [],

    // actions
    onReset: () => set({ data: [] }),
}));
