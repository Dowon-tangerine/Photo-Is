import React, { useEffect, useState } from "react";
import { useCameraStore } from "../store/useCameraStore";

const CameraSettings: React.FC = () => {
    const apertureValues = [32, 22, 16, 11, 8, 5.6, 4, 2.8, 2, 1.4];
    const shutterSpeedValues = [4000, 2000, 1000, 500, 250, 125, 60, 30, 15, 8, 4, 2, 1];
    const isoValues = [100, 200, 400, 800, 1600, 3200, 6400, 12800];
    const options = ["Av", "Tv", "M"];
    const [selectedOption, setSelectedOption] = useState<string>(options[0]);
    const [shutterSpeedDisable, setShutterSpeedDisable] = useState(true);
    const [isoDisable, setIsoDisable] = useState(false);
    const [apertureDisable, setApertureDisable] = useState(false);

    const handleClick = (option: string) => {
        setSelectedOption(option);
    };
    const { aperture, iso, shutterSpeed, exposure, setIso, setShutterSpeed, setAperture, setExposure } =
        useCameraStore();

    // 노출 update
    const updateExposure = (currentIndex: number, newIndex: number) => {
        const exposureChange = newIndex - currentIndex;
        setExposure(exposure + exposureChange);
    };

    const handleApertureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newIndex = parseInt(event.target.value);
        const newAperture = apertureValues[newIndex];
        const currentIndex = apertureValues.indexOf(aperture);
        setAperture(newAperture);
        updateExposure(currentIndex, newIndex);
    };

    const handleIsoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newIndex = parseInt(event.target.value);
        const newISO = isoValues[newIndex];
        const currentIndex = isoValues.indexOf(iso);
        setIso(newISO);
        updateExposure(currentIndex, newIndex);
    };

    const handleShutterSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newIndex = parseInt(event.target.value);
        const newShutterSpeed = shutterSpeedValues[newIndex];
        const currentIndex = shutterSpeedValues.indexOf(shutterSpeed);
        setShutterSpeed(newShutterSpeed);
        updateExposure(currentIndex, newIndex);
    };

    // 모드 조절
    useEffect(() => {
        if (selectedOption === "Av") {
            setApertureDisable(false);
            setIsoDisable(false);
            setShutterSpeedDisable(true);
        } else if (selectedOption === "Tv") {
            setApertureDisable(true);
            setIsoDisable(false);
            setShutterSpeedDisable(false);
        } else {
            setApertureDisable(false);
            setIsoDisable(false);
            setShutterSpeedDisable(false);
        }
    }, [selectedOption]);

    return (
        <div className="font-bookkGothic w-[100%] flex flex-col">
            <div className="py-6 px-6">
                <div className="text-white flex justify-between">
                    <div className="flex items-center pb-3">
                        <label>모드 / Mode</label>
                        <img src="/imgs/question.png" alt="" className="ml-3 w-[18px] h-[18px]" />
                    </div>
                </div>
                <div className="mode flex justify-center w-full rounded-sm overflow-hidden font-bookkGothicBold">
                    {options.map((option) => (
                        <button
                            key={option}
                            onClick={() => handleClick(option)}
                            className={`flex-grow px-4 py-2  ${
                                selectedOption === option ? "bg-blue-500 text-black" : "bg-white text-black"
                            } focus:outline-none`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
            <div className="py-6 px-6">
                <div className="text-white flex justify-between">
                    <div className="flex items-center pb-3">
                        <label>조리개 / Aperture</label>
                        <img src="/imgs/question.png" alt="" className="ml-3 w-[18px] h-[18px]" />
                    </div>
                    <div>
                        <label>F {aperture}</label>
                    </div>
                </div>
                <input
                    type="range"
                    disabled={apertureDisable}
                    min="0"
                    max={apertureValues.length - 1}
                    value={apertureValues.indexOf(aperture)}
                    onChange={handleApertureChange}
                    className="w-full"
                />
            </div>
            <div className="py-6 px-6">
                <div className="text-white flex justify-between">
                    <div className="flex items-center pb-3">
                        <label>셔터스피드 / SS</label>
                        <img src="/imgs/question.png" alt="" className="ml-3 w-[18px] h-[18px]" />
                    </div>
                    <div>{(shutterSpeed == 1 && <label>1 </label>) || <label>1 / {shutterSpeed}</label>}</div>
                </div>
                <input
                    type="range"
                    disabled={shutterSpeedDisable}
                    min="0"
                    max={shutterSpeedValues.length - 1}
                    value={shutterSpeedValues.indexOf(shutterSpeed)}
                    onChange={handleShutterSpeedChange}
                    className="w-full"
                />
            </div>
            <div className="py-6 px-6">
                <div className="text-white flex justify-between">
                    <div className="flex items-center pb-3">
                        <label>감도 / ISO</label>
                        <img src="/imgs/question.png" alt="" className="ml-3 w-[18px] h-[18px]" />
                    </div>
                    <div>
                        <label>{iso}</label>
                    </div>
                </div>
                <input
                    type="range"
                    disabled={isoDisable}
                    min="0"
                    max={isoValues.length - 1}
                    value={isoValues.indexOf(iso)}
                    onChange={handleIsoChange}
                    className="w-full"
                />
            </div>
        </div>
    );
};

export default CameraSettings;
