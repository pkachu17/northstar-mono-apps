import { StorageKeys } from "app/utils/storageKeys"
import { getData, storeData } from "."
import { printObj } from "app/utils/baubles"
import { deletePaper } from "./filestorage"

export const savePaperInfo = async (paperInfo, fileURI) => {
    paperInfo.fileURI = fileURI
    let allPapers = await getData(StorageKeys.app.papers) ?? []
    allPapers.push(paperInfo)
    await storeData(StorageKeys.app.papers, allPapers)
}

export const unSavePaperInfo = async (paperInfo) => {
    let allPapers = await getData(StorageKeys.app.papers) ?? []
    let item = allPapers.filter((paper) => {
        return paper.uid == paperInfo.uid
    })
    let newSet = allPapers.filter((paper) => {
        return paper.uid != paperInfo.uid
    })
    let fileURI = item[0]?.fileURI
    await deletePaper(fileURI)
    await storeData(StorageKeys.app.papers, newSet)
}

export const isPaperSaved = async (paperInfo) => {
    let allPapers = await getData(StorageKeys.app.papers) ?? []
    let item = allPapers.filter((paper) => {
        return paper.uid == paperInfo.uid
    })
    return item.length > 0
}