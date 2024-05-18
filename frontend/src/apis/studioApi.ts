// api.ts

export interface PhotoInfo {
    title: string;
    accessType: string;
    hashtagList: string[];
}

export interface UploadPhotoPayload {
    photoInfo: PhotoInfo;
    photo: string;
}

export const uploadPhoto = async (payload: UploadPhotoPayload): Promise<any> => {
    try {
        const response = await fetch("/api/photos/upload", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};
