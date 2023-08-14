import React, { useEffect, useState } from 'react'
import { Paragraph, YStack, Switch, H1, XStack, H3 } from "@my/ui/src";
import FileSystem from 'expo-file-system'
import { FlatList, Linking } from 'react-native';
import { PaperItem } from '../roadmap/RoadmapScreen';
import { StringConstants } from 'app/utils/strings';
import { getAllSavedPapers, savePDFToDevice } from 'app/provider/storage/filestorage';
import { getData } from 'app/provider/storage';
import { StorageKeys } from 'app/utils/storageKeys';
import { savePaperInfo, unSavePaperInfo } from 'app/provider/storage/asyncstorage';

export function SavedPapersScreen({ navigation }) {

    const [savedPapers, setSavedPapers] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchAllSavedPapers = async () => {
        setLoading(true)
        const paps = await getData(StorageKeys.app.papers)
        setSavedPapers(paps)
        setLoading(false)
    }

    useEffect(() => {
        fetchAllSavedPapers()
    }, [])

    const tappedOnPaper = (item) => {
        let paperLink = ""
        if (item.link.endsWith(".pdf")) {
            paperLink = item.link
        } else if (item.link.includes("arxiv")) {
            paperLink = item.link + ".pdf"
        } else {
            Linking.openURL(item.link)
            return
        }
        navigation.navigate(StringConstants.screenNames.VIEW_PAPER, {
            paperData: {
                name: item.name,
                link: paperLink
            }
        })
    }

    const onPullToRefresh = () => {
        fetchAllSavedPapers()
    }

    const onSaveTapped = async (paperInfo, isAlreadySaved) => {
        setLoading(true)
        if (isAlreadySaved) {
            await unSavePaperInfo(paperInfo)
            setLoading(false)
        } else {
            const uri = await savePDFToDevice(paperInfo.link, paperInfo.uid)
            await savePaperInfo(paperInfo, uri)
            setLoading(false)
        }

    }

    const EmptyPaperComponent = () => {
        return (
            <YStack f={1} mt="$5" ai="center" jc="center" space="$3" mih={180}>
                <Paragraph
                    fontSize={16}
                >{"No papers saved yet."}
                </Paragraph>
            </YStack>
        )
    }

    return (
        // <YStack f={1} jc="center" ai="center" p="$4" space>
        <FlatList
            data={savedPapers}
            keyExtractor={(item, index) => (item.name + index)}
            renderItem={
                ({ item }) =>
                    <PaperItem
                        paperInfo={item}
                        isEditable={false}
                        onPress={() => tappedOnPaper(item)}
                        onSaveTapped={onSaveTapped}
                    />
            }
            ItemSeparatorComponent={() => <XStack h="$2" />}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
                <YStack space="$4" py="$2">
                    <H3 ta="left">Here's a list of papers you have saved.</H3>
                </YStack>
            }
            style={{ flex: 1, paddingHorizontal: 16 }}
            contentContainerStyle={{ marginTop: 12, paddingBottom: 36 }}
            ListEmptyComponent={EmptyPaperComponent}
            onRefresh={onPullToRefresh}
            refreshing={loading}
        />
        // </YStack>
    )
}