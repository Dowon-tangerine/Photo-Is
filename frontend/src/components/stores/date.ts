import { create } from 'zustand';

interface DateStatus {
    startDate: Date | null;
    endDate: Date | null;
    updateDateStatus: (startDate: Date | null, endDate: Date | null) => void;
    getStartDate: () => Date | null;
    getEndDate: () => Date | null;
}

const useDatePick = create<DateStatus>((set, get) => ({
    startDate: null,
    endDate: null,
    updateDateStatus: (startDate: Date | null, endDate: Date | null) => {
        set({ startDate, endDate });
    },
    getStartDate: () => get().startDate,
    getEndDate: () => get().endDate,
}));

export default useDatePick;
