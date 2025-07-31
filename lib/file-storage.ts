// lib/file-storage.ts

interface StoredFile {
    name: string;
    type: string;
    data: string; // base64
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

export const storeFileInLocalStorage = async (key: string, file: File): Promise<void> => {
    try {
        const base64Data = await fileToBase64(file);
        const fileData: StoredFile = {
            name: file.name,
            type: file.type,
            data: base64Data,
        };
        localStorage.setItem(key, JSON.stringify(fileData));
    } catch (error) {
        console.error(`[storeFileInLocalStorage] Error storing file with key "${key}":`, error);
        throw new Error('Failed to store file in local storage.');
    }
};

export const getFileFromLocalStorage = async (key: string): Promise<File | null> => {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    try {
        // New format: stored as a JSON object
        const { name, type, data } = JSON.parse(stored) as StoredFile;
        const byteCharacters = atob(data.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new File([byteArray], name, { type });
    } catch (e) {
        // Fallback for old format: stored as a raw data URI string
        if (stored.startsWith('data:')) {
            console.warn(`[getFileFromLocalStorage] Found data in a legacy format for key "${key}". The app will attempt to continue, but some features may not work as expected without a file name. Please consider re-uploading the file.`);
            
            try {
                const response = await fetch(stored);
                const blob = await response.blob();
                // We don't have the original file name, so we have to make one up.
                const fileName = key.startsWith('billA') ? 'document_A' : 'document_B';
                return new File([blob], fileName, { type: blob.type });

            } catch (fetchError) {
                 console.error(`[getFileFromLocalStorage] Could not recover file from legacy data URI for key "${key}":`, fetchError);
                 localStorage.removeItem(key); // Clear invalid data
                 return null;
            }
        }
        
        console.error(`[getFileFromLocalStorage] Failed to parse file from localStorage with key "${key}". The data may be corrupt. Clearing it.`, e);
        localStorage.removeItem(key); // Clear invalid data
        return null;
    }
};
