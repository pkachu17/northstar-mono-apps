import { Paragraph, YStack } from "@my/ui/src"
import { isPaperSaved } from "app/provider/storage/asyncstorage";
import { savePDFToDevice } from "app/provider/storage/filestorage";
import { printObj } from "app/utils/baubles";
import React, { useEffect, useState } from 'react'
import PDFReader from 'rn-pdf-reader-js'

export function ViewPaperScreen({ navigation, route }) {

    const { paperData } = route.params

    const [isAlreadySaved, setIsAlreadySaved] = useState(false)

    useEffect(() => {
        (async () => {
            setIsAlreadySaved(await isPaperSaved(paperData))
        })()
    })
    useEffect(() => {
        navigation?.getParent()?.setOptions({
            headerTitle: paperData?.name ?? "Read Paper",
            headerRight: null
        })
    }, [navigation, isAlreadySaved]);


    const saveTapped = async () => {
        const saveStatus = await savePDFToDevice(paperData.link, paperData.id)
    }

    return (
        <YStack f={1}>
            <PDFReader
                source={{
                    uri: paperData.link
                }}
            />
        </YStack>
    )
}