import create from "zustand";

interface CameraSettings {
    iso: number;
    setIso: (iso: number) => void;
    shutterSpeed: number;
    setShutterSpeed: (speed: number) => void;
    aperture: number;
    setAperture: (aperture: number) => void;
    exposure: number;
    setExposure: (exposure: number) => void;
    focusDistance: number;
    setFocusDistance: (focusDistance: number) => void;
}

export const useCameraStore = create<CameraSettings>((set) => ({
    iso: 100,
    shutterSpeed: 125,
    aperture: 8,
    exposure: 0,
    focusDistance: 0,
    setIso: (iso) => set({ iso }),
    setShutterSpeed: (shutterSpeed) => set({ shutterSpeed }),
    setAperture: (aperture) => set({ aperture }),
    setExposure: (exposure) => set({ exposure }),
    setFocusDistance: (focusDistance) => set({ focusDistance }),
}));
