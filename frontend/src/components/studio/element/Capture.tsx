import { FunctionComponent, useEffect, Dispatch, SetStateAction } from "react";
import { useThree } from "@react-three/fiber";

interface CaptureProps {
    setTakeScreenshot: Dispatch<SetStateAction<(() => void) | null>>;
}

const Capture: FunctionComponent<CaptureProps> = ({ setTakeScreenshot }) => {
    const { gl } = useThree();

    useEffect(() => {
        const captureScreenshot = () => {
            requestAnimationFrame(() => {
                gl.domElement.toBlob((blob: Blob | null) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        // 이미지 처리 로직 여기에 추가

                        // 예: 밝기 조절, depth of field 시뮬레이션 등
                        const link = document.createElement("a");
                        link.style.display = "none";
                        link.href = url;
                        link.download = "canvas-snapshot.png";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                });
            });
        };

        setTakeScreenshot(() => captureScreenshot);

        return () => {
            setTakeScreenshot(null);
        };
    }, [gl]);

    return null; // 실제로 렌더링되는 내용은 없음
};

export default Capture;