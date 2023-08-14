import { Button, H3, H4, Input, Label, Paragraph, ScrollView, TextArea, XStack, YStack, ZStack, debounce } from '@my/ui'
import { StringConstants } from 'app/utils/strings';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, FlatList, TouchableOpacity } from 'react-native';
import { PaperItem, levelTitles } from './RoadmapScreen';
import { ManualPaperAddDialog } from '@my/ui/src/ManualPaperAddDialog';
import { getAutoComplete, getPaperFromOA } from 'app/provider/network/openAlexManager';
import MySearchBar from '@my/ui/src/MySearchBar';
import { addPaperToRoadmap, updatePaperToRoadmap } from 'app/provider/network/papers';
import { useAuthentication } from 'app/utils/hooks/useAuthentication';
import FullscreenLoader from '@my/ui/src/FullscreenLoader';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist'
import { cloneDeep } from 'lodash'

export const AddPaperScreen = ({ navigation, route }) => {

    const { roadmapInfo, currentLevel, existingPapers } = route.params
    const { user } = useAuthentication()
    let searchText = useMemo(() => "", [])
    const [addedPapers, setAddedPapers] = useState(cloneDeep(existingPapers))
    const [searchedItems, setSearchedItems] = useState([])
    const [searching, setSearching] = useState(false)
    const [loading, setLoading] = useState(false)

    const isEditMode = !!existingPapers

    useEffect(() => {
        navigation?.getParent()?.setOptions({
            // headerBackTitle: "Back",
            // headerLeft: () => <HeaderBackButton onPress={() => navigation?.goBack()} label={"Back"} />,
            headerRight: null
        })
    }, [navigation]);

    const debouncedResults = useCallback(async (query) => {
        setSearching(true)
        setLoading(true)
        searchText = query
        let responseData = await getAutoComplete({ query })
        console.log("Searched response", responseData)
        setSearchedItems(responseData)
        setLoading(false)
    }, [])

    const addPaper = ({ name, url }) => {
        console.log("Adding paper for", name, url)
        const newPaper = {
            name,
            link: url
        }
        const newSet = addedPapers
        if (newSet.filter(paper => paper.link == newPaper.link).length > 0) {
            Alert.alert("Unable to add", "Paper already added.")
        } else {
            newSet.push(newPaper)
            setAddedPapers(newSet)
            searchText = ""
            setSearchedItems([])
            setSearching(false)
        }
    }

    const tappedPaper = async (paper) => {
        if (paper.url != '' && paper.url != null) {
        }
        else {
            let index = paper.id.lastIndexOf("/");
            let id = paper.id.substring(index + 1)
            let response = await getPaperFromOA({ paperID: id })
            // console.log("Paper is", JSON.stringify(response, undefined, 2))

            // TODO: - Find ways to make this typecheck robust
            // The URL can reside in other places too and sometimes the URL we get
            // may not even have PDF but be paywalled.
            if (!response.display_name || !response.host_venue?.url) {
                if (response.primary_location && response.primary_location.landing_page_url) {
                    addPaper({
                        name: response.display_name,
                        url: response.primary_location.landing_page_url
                    })
                } else {
                    Alert.alert("Unable to add", "Sorry the paper you have selected cannot be added.")
                }
            } else {
                addPaper({
                    name: response.display_name,
                    url: response.host_venue?.url
                })
            }
        }
    }

    const deletePaper = (paperInfo) => {
        const filteredPapers = addedPapers.filter(paper => paper.name != paperInfo.name)
        setAddedPapers(filteredPapers)
    }

    const addAllToRoadmap = async () => {
        let promiseList: [Promise<Any>] = []
        setLoading(true)
        addedPapers.map(async (value, index) => {
            const isExistingPaper = existingPapers.filter(paper => paper.name == value.name).length > 0
            if (isExistingPaper) {
                promiseList.push(updatePaperToRoadmap({
                    userToken: user?.stsTokenManager?.accessToken,
                    paperID: value.uid,
                    roadmapID: roadmapInfo.uid,
                    paperName: value.name,
                    paperLink: value.link,
                    difficulty: index,
                    level: currentLevel
                }))
            } else {
                promiseList.push(addPaperToRoadmap({
                    userToken: user?.stsTokenManager?.accessToken,
                    roadmapID: roadmapInfo.uid,
                    paperName: value.name,
                    paperLink: value.link,
                    difficulty: index,
                    level: currentLevel
                }))
            }
        })
        const finalRes = await Promise.all(promiseList)
        setLoading(false)
        navigation?.goBack()
    }

    const searchHeader = useCallback(() =>
    (<YStack space="$2" mb="$3" >
        <H3>{"Level - " + levelTitles[currentLevel]}</H3>
        <H3>{"Search for a paper"}</H3>
        < MySearchBar onSearching={debouncedResults} query={searchText} />
    </YStack>), [])

    const emptySearchComponent = () => {
        return (searching && !loading && (<YStack space="$3" mb="$3">
            <H4>No paper was found. Do you wanna add it manually?</H4>
            <ManualPaperAddDialog
                triggerChild={<Button>{"Add manually"}</Button>}
                onSubmit={addPaper}
            />
        </YStack>))
    }

    const headerComponent = () => {
        return (
            <FlatList
                data={searchedItems}
                renderItem={({ item }) => (
                    <YStack height={75} space="$2" onPress={() => tappedPaper(item)} bw="$1" boc="$borderColor" p="$2">
                        <Paragraph numberOfLines={2}>{item.display_name}</Paragraph>
                    </YStack>
                )}
                ListHeaderComponent={searchHeader}
                ListEmptyComponent={emptySearchComponent}
                style={{}}
                contentContainerStyle={{ paddingHorizontal: 16, backgroundColor: "blue" }}
                keyExtractor={(item, index) => (item.display_name + index)}
            />
        )
    }

    const footerComponent = () => {
        return (
            <Button themeInverse size="$4" my="$7" onPress={addAllToRoadmap}>{isEditMode ? "Save Papers" : "Add Papers"}</Button>
        )
    }

    const renderPaperItem = ({ item, drag, isActive }) => {

        return (
            <ScaleDecorator>
                <TouchableOpacity
                    onLongPress={drag}
                    disabled={isActive}
                >
                    <PaperItem
                        paperInfo={item}
                        isEditable={true}
                        onDelete={deletePaper}
                        my="$2"
                    />
                </TouchableOpacity>
            </ScaleDecorator>
        )
    }
    return (
        <ZStack f={1}>
            <DraggableFlatList
                data={addedPapers}
                onDragEnd={({ data }) => setAddedPapers(data)}
                keyExtractor={(item, index) => (item.name + index)}
                renderItem={renderPaperItem}
                ListHeaderComponent={headerComponent}
                contentContainerStyle={{ padding: 24 }}
                ListEmptyComponent={(<H4 f={1} mt="$3">{"No papers added yet. Search for one to add it"}</H4>)}
                ListFooterComponent={() => (addedPapers.length > 0 && footerComponent())}
                ItemSeparatorComponent={() => <XStack h={15} />}
                keyboardShouldPersistTaps={'handled'}
            // style={{ flex: 0.5 }}
            />
            {loading && <FullscreenLoader />}
        </ZStack>
    )
}