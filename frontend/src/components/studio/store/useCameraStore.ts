import create from "zustand";

interface CameraSettings {
    iso: number;
    shutterSpeed: number;
    aperture: number;
    exposure: number;
    setIso: (iso: number) => void;
    setShutterSpeed: (speed: number) => void;
    setAperture: (aperture: number) => void;
    setExposure: (exposure: number) => void;
}

export const useCameraStore = create<CameraSettings>((set) => ({
    iso: 100,
    shutterSpeed: 125,
    aperture: 8,
    exposure: 0,
    setIso: (iso) => set({ iso }),
    setShutterSpeed: (shutterSpeed) => set({ shutterSpeed }),
    setAperture: (aperture) => set({ aperture }),
    setExposure: (exposure) => set({ exposure }),
}));
