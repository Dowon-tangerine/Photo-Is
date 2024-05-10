// CameraSettings.tsx
import React from "react";

interface CameraSettingsProps {
    iso: number;
    setIso: React.Dispatch<React.SetStateAction<number>>;
    shutterSpeed: number;
    setShutterSpeed: React.Dispatch<React.SetStateAction<number>>;
    aperture: number;
    setAperture: React.Dispatch<React.SetStateAction<number>>;
}

const CameraSettings: React.FC<CameraSettingsProps> = ({
    iso,
    setIso,
    shutterSpeed,
    setShutterSpeed,
    aperture,
    setAperture,
}) => {
    return (
        <div className=" font-bookkGothic w-[100%]">
            <div className="py-6 px-6 ">
                <div className="flex justify-between items-center">
                    <label className="text-white">심도 / ISO</label>
                    <img src="./imgs/question.png" alt="" className="w-[18px] h-[18px]" />
                </div>

                <input
                    type="range"
                    min="100"
                    max="3200"
                    value={iso}
                    onChange={(e) => setIso(parseInt(e.target.value))}
                    className="w-full mt-4"
                />
            </div>
            <div className="py-6 px-6">
                <div className="flex justify-between items-center">
                    <label className="text-white">셔터 스피드 / SS</label>
                    <img src="./imgs/question.png" alt="" className="w-[18px] h-[18px]" />
                </div>

                <input
                    type="range"
                    min="1"
                    max="1000"
                    value={shutterSpeed}
                    onChange={(e) => setShutterSpeed(parseInt(e.target.value))}
                    className="w-full mt-4"
                />
            </div>
            <div className="py-6 px-6">
                <div className="flex justify-between items-center">
                    <label className="text-white">조리개 / Aperture</label>
                    <img src="./imgs/question.png" alt="" className="w-[18px] h-[18px]" />
                </div>

                {/* <label> f/{aperture}</label> */}
                <input
                    type="range"
                    min="1.4"
                    max="22"
                    step="0.1"
                    value={aperture}
                    onChange={(e) => setAperture(parseFloat(e.target.value))}
                    className="w-full mt-4"
                />
            </div>
        </div>
    );
};

export default CameraSettings;
