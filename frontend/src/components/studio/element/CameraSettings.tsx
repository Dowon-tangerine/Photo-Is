import React, { useState } from "react";
import { useCameraStore } from "../store/useCameraStore";

const CameraSettings: React.FC = () => {
    const apertureValues = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22, 32];
    const shutterSpeedValues = [1, 2, 4, 8, 15, 30, 60, 125, 250, 500, 1000, 2000, 4000];
    const isoValues = [100, 200, 400, 800, 1600, 3200, 6400, 12800];
    const { aperture, iso, shutterSpeed, exposure, setIso, setShutterSpeed, setAperture, setExposure } =
        useCameraStore();

    const updateExposure = (currentValue: any, newValue: any, valuesArray: any) => {
        const currentIndex = valuesArray.indexOf(currentValue);
        const newIndex = valuesArray.indexOf(newValue);
        const exposureChange = newIndex - currentIndex;
        setExposure(exposure + exposureChange);
    };
    const handleApertureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAperture = apertureValues[parseInt(event.target.value)];
        updateExposure(aperture, newAperture, apertureValues);
        setAperture(apertureValues[parseInt(event.target.value)]);
    };

    const handleIsoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newISO = isoValues[parseInt(event.target.value)];
        updateExposure(iso, newISO, isoValues);
        setIso(isoValues[parseInt(event.target.value)]);
    };
    const handleShutterSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newShutterSpeed = shutterSpeedValues[parseInt(event.target.value)];
        updateExposure(shutterSpeed, newShutterSpeed, shutterSpeedValues);
        setShutterSpeed(shutterSpeedValues[parseInt(event.target.value)]);
    };

    return (
        <div className="font-bookkGothic w-[100%]">
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
                    <div>
                        <label>1 / {shutterSpeed}</label>
                    </div>
                </div>
                <input
                    type="range"
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
                        <label>심도 / ISO</label>
                        <img src="/imgs/question.png" alt="" className="ml-3 w-[18px] h-[18px]" />
                    </div>
                    <div>
                        <label>{iso}</label>
                    </div>
                </div>
                <input
                    type="range"
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
