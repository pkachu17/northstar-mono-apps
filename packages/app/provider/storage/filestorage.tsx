import * as FileSystem from 'expo-file-system';

const papersDirectory = FileSystem.documentDirectory + "papers/"

export const savePDFToDevice = async (pdfURL: string, id: string) => {
    const fileName = id + ".pdf"
    const downloadResumable = FileSystem.createDownloadResumable(
        pdfURL,
        papersDirectory + fileName,
        {}
    );
    try {
        const directoryInfo = await FileSystem.getInfoAsync(papersDirectory);
        if (!directoryInfo.exists) {
            await FileSystem.makeDirectoryAsync(papersDirectory, {
                intermediates: true
            });
        }

        const { uri } = await downloadResumable.downloadAsync();
        return uri
    } catch (e) {
        console.error(e);
    }
}

export const deletePaper = async (fileURI: string) => {
    try {
        await FileSystem.deleteAsync(fileURI);
    } catch (e) {
        console.error(e);
    }
}

export const getAllSavedPapers = async () => {
    let dir = await FileSystem.readDirectoryAsync(papersDirectory);
    let paps = []
    dir.forEach((val) => {
        paps.push(papersDirectory + val)
    });

    return paps
}