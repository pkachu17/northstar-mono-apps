import React, { useContext, useEffect, useState } from 'react'
import { Paragraph, YStack, XStack, XGroup, Card, Button, H4, H2, ZStack } from "@my/ui/src";
import { CheckCircle2, Copy, FileEdit, PlusCircle, FileCheck2, FilePlus2, Trash, Trash2 } from '@tamagui/lucide-icons';
import { Alert, FlatList, Linking } from 'react-native';
import { useAuthentication } from 'app/utils/hooks/useAuthentication';
import { DataContext } from 'app/provider/storage';
import { actionTypes } from 'app/utils/reducer';
import RatingComponent from '@my/ui/src/RatingComponent';
import { deletePaperFromRoadmap, getPapersForRoadmap } from 'app/provider/network/papers';
import { addRoadmapToLearningList, deleteRoadmapFromLearningList } from 'app/provider/network/learningList';
import { StringConstants } from 'app/utils/strings';
import { cloneRoadmap, deleteRoadmap, getRoadmapInfo, updateRoadmap, updateRoadmapRating } from 'app/provider/network/roadmap';
import FullscreenLoader from '@my/ui/src/FullscreenLoader';
import { savePDFToDevice } from 'app/provider/storage/filestorage';
import { savePaperInfo, isPaperSaved, unSavePaperInfo } from 'app/provider/storage/asyncstorage';
import { printObj } from 'app/utils/baubles';

export const levelTitles = {
    1: "Beginner",
    2: "Intermediate",
    3: "Advanced"
}

export function RoadmapScreen({ navigation, route }) {

    const { user } = useAuthentication()

    const { roadmapData } = route.params
    const [roadmapInfo, setRoadmapInfo] = useState(roadmapData)
    const [papersData, setPapersData] = useState([])
    const [dataForLevel, setDataForLevel] = useState([])
    const { appDispatch, appState } = useContext(DataContext)
    const [currentLevel, setCurrentLevel] = useState<number>(roadmapInfo?.levels > 0 ? 1 : 0)
    const [loading, setLoading] = useState(false)
    const [hasRated, setHasRated] = useState(false)

    const isRoadmapInLearningList = () => {
        let flag = false
        appState.learningList.forEach(element => {
            if (element.uid == roadmapInfo.uid) {
                flag = true
            }
        })
        return flag
    }
    const isMyRoadmap = () => {
        return roadmapInfo.userUID == user?.uid
    }

    useEffect(() => {
        if (user) {
            fetchPapers()
        }
    }, [user])

    useEffect(() => {
        setRoadmapInfo(roadmapData)
    }, [roadmapData])

    useEffect(() => {
        let options = {
            headerTitle: roadmapInfo.name
        }
        if (isMyRoadmap()) {
            options["headerRight"] = () => (
                <Paragraph onPress={goToCreatePage} >Edit</Paragraph>
            )
        }
        navigation?.getParent()?.setOptions(options);

        const unsubscribe = navigation.addListener('focus', () => {
            // The screen is focused
            if (user) {
                fetchPapers()
            }
            navigation.getParent()?.setOptions(options);
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation, user]);

    useEffect(() => {
        const filteredPapers = papersData.filter(paper => paper.level == currentLevel).sort((a, b) => a.difficulty - b.difficulty)
        setDataForLevel(filteredPapers)
    }, [currentLevel, papersData])

    const fetchRoadmap = async () => {
        setLoading(true)
        const roadmapData = await getRoadmapInfo({ userToken: user?.stsTokenManager?.accessToken, roadmapID: roadmapInfo.uid })
        setRoadmapInfo(roadmapData)
        setLoading(false)
    }

    const fetchPapers = async () => {
        setLoading(true)
        const papersData = await getPapersForRoadmap({ userToken: user?.stsTokenManager?.accessToken, roadmapID: roadmapInfo.uid })
        setPapersData(papersData)
        console.log("papers", papersData)
        setLoading(false)
    }

    const addToList = async () => {
        const addedResponse = await addRoadmapToLearningList({ userToken: user?.stsTokenManager?.accessToken, roadmapID: roadmapInfo.uid })
        appDispatch({ type: actionTypes.ADD_TO_LEARNING_LIST, payload: roadmapInfo });
    }

    const addNewPaper = async () => {
        navigation.push(StringConstants.screenNames.ADD_PAPER, {
            roadmapInfo,
            currentLevel,
            existingPapers: dataForLevel
        })
    }

    const removeFromList = async () => {
        const addedList = await deleteRoadmapFromLearningList({ userToken: user?.stsTokenManager?.accessToken, roadmapID: roadmapInfo.uid })
        const updatedList = appState.learningList.filter(element => {
            return element.uid !== roadmapInfo.uid
        })
        appDispatch({ type: actionTypes.UPDATE_LEARNING_LIST, payload: updatedList });
    }

    const addLevel = async () => {
        const updatedRoadmapInfo = { ...roadmapInfo, levels: roadmapInfo.levels + 1 }
        const response = await updateRoadmap({
            userToken: user?.stsTokenManager?.accessToken,
            roadmapInfo: updatedRoadmapInfo
        }).catch(err => {
            console.log("Errored while adding new level to roadmap", err)
        })
        setRoadmapInfo({ ...roadmapInfo, ...response })
        // Automatically set the newest created level to be selected
        setCurrentLevel(response.levels)
    }

    const sendDeleteRequest = async () => {
        const response = await deleteRoadmap({
            userToken: user?.stsTokenManager?.accessToken,
            roadmapInfo
        }).catch(err => {
            console.log("Errored while deleting roadmap", err)
        })
        navigation?.goBack()
    }

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

    const goToCreatePage = () => {
        navigation.navigate(StringConstants.stackNames.ROADMAP, {
            screen: StringConstants.screenNames.CREATE_ROADMAP,
            params: {
                roadmapInfo
            }
        })
    }

    const onTappedRating = async (rating, roadmapInfo) => {
        const response = await updateRoadmapRating({
            userToken: user?.stsTokenManager?.accessToken,
            roadmapID: roadmapInfo.uid,
            rating
        }).catch(err => {
            console.log("Cant rate roadmap", err)
            if (err.detail) {
                Alert.alert("Error", "You have already rated this roadmap!")
                setHasRated(true)
            }
        })
        console.log("Rating response", response)
    }

    const onTappedDeletePaper = async (paperInfo) => {
        setLoading(true)
        const response = await deletePaperFromRoadmap({
            userToken: user?.stsTokenManager?.accessToken,
            roadmapID: roadmapInfo.uid,
            paperID: paperInfo.uid
        }).catch(err => console.error("Couldnt delete paper with", err))

        const filteredPapers = papersData.filter(paper => paper.uid != paperInfo.uid)
        setPapersData(filteredPapers)
        setLoading(false)
    }

    const clonePaper = async () => {
        const response = await cloneRoadmap({
            userToken: user?.stsTokenManager?.accessToken,
            roadmapID: roadmapInfo.uid,
        }).catch(err => console.error("Errored cloning roadmap with"))
        const newRoadmap = await getRoadmapInfo({
            userToken: user?.stsTokenManager?.accessToken,
            roadmapID: response
        })
        navigation.push(StringConstants.screenNames.ROADMAP, {
            roadmapData: newRoadmap
        })
    }

    const onPullToRefresh = () => {
        fetchPapers()
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

    const RoadmapHeader = ({ }) => {
        return (
            <YStack space="$1" jc="center">
                <H2 mih={55} numberOfLines={0}>{roadmapInfo.name}</H2>
                <Paragraph numberOfLines={0}>{roadmapInfo.description}</Paragraph>
                <RatingComponent
                    defaultRating={roadmapInfo.rating}
                    totalCount={roadmapInfo.ratingCount}
                    isEditable={!hasRated && isRoadmapInLearningList()}
                    onRatingChange={(rating) => onTappedRating(rating, roadmapInfo)} />
            </YStack>
        )
    }

    const ActionBar = ({ ...props }) => {
        const isInList = isRoadmapInLearningList()
        return (
            <YStack f={1} jc="flex-start" ai="flex-start" space="$2" {...props} themeInverse>
                <XStack f={0.5} space="$3" >
                    <Button
                        icon={isInList ? CheckCircle2 : PlusCircle}
                        size="$3"
                        onPress={isInList ? removeFromList : addToList}
                    >{(isInList ? "Remove from " : "Add to ") + "list"}
                    </Button>
                    <Button icon={Copy} size="$3" onPress={clonePaper}>Clone</Button>
                </XStack>
                {isMyRoadmap() && (
                    <XStack f={0.5} space="$3" >
                        <Button icon={FileEdit} size="$3" onPress={addNewPaper}>Edit Papers</Button>
                        <Button icon={Trash2} size="$3" onPress={sendDeleteRequest}>Delete Roadmap</Button>
                    </XStack>
                )}
            </YStack>
        )
    }


    const LevelsHeader = ({ levelCount = 1, ...props }) => {
        return (
            <XStack f={1} space="$2" jc="flex-start" ai="center" {...props}>
                <XGroup f={1} space="$0.5" bg="$colorTransparent">
                    {[...Array(levelCount).keys()].map((item, index) => {
                        return (
                            <Button
                                f={1}
                                size="$3"
                                key={item + index}
                                themeInverse={index + 1 == currentLevel}
                                onPress={() => setCurrentLevel(index + 1)}
                                p="$-0.5"
                            >
                                {levelTitles[index + 1]}
                            </Button>)
                    }
                    )}
                </XGroup>
                {(roadmapInfo.levels <= 2) && (isMyRoadmap()) &&
                    < PlusCircle
                        f={1}
                        als="center"
                        size="$2"
                        onPress={addLevel}
                        marginHorizontal={16}
                    />}
            </XStack>


        )
    }

    const addPaperButton = () => {
        if (isMyRoadmap()) {
            return (<Button themeInverse onPress={addNewPaper}>Add Paper</Button>)
        } else {
            return <></>
        }
    }

    const EmptyPaperComponent = () => {
        return (
            <YStack f={1} mt="$5" ai="center" jc="center" space="$3" mih={180}>
                <Paragraph
                    fontSize={16}
                >{"No papers added yet."}
                </Paragraph>
                {addPaperButton}
            </YStack>
        )
    }

    return (
        <ZStack f={1}>
            <FlatList
                data={dataForLevel}
                keyExtractor={(item, index) => (item.name + index)}
                renderItem={({ item }) =>
                    <PaperItem
                        paperInfo={item}
                        isEditable={isMyRoadmap()}
                        onPress={() => tappedOnPaper(item)}
                        onDelete={onTappedDeletePaper}
                        onSaveTapped={onSaveTapped}
                    />
                }
                ItemSeparatorComponent={() => <XStack h="$2" />}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <YStack space="$4" mb="$5">
                        <RoadmapHeader />
                        <ActionBar />
                        <LevelsHeader mt="$2" levelCount={roadmapInfo.levels} />
                    </YStack>
                }
                style={{ flex: 1, marginHorizontal: 24 }}
                contentContainerStyle={{ marginTop: 24, paddingBottom: 36 }}
                ListEmptyComponent={EmptyPaperComponent}
                ListFooterComponent={addPaperButton}
                ListFooterComponentStyle={{ marginVertical: 24 }}
                onRefresh={onPullToRefresh}
                refreshing={loading}
            />
            {loading && <FullscreenLoader />}
        </ZStack>

    )
}

export const PaperItem = ({ paperInfo, isEditable, onDelete, onPress, onSaveTapped }) => {
    const [isAlreadySaved, setIsAlreadySaved] = useState(true)
    const isPDFLink = paperInfo.link.includes(".pdf")
    const showSaveButton = isPDFLink
    const showDeleteButton = isEditable && !!onDelete

    useEffect(() => {
        (async function () {
            setIsAlreadySaved(await isPaperSaved(paperInfo))
        })()
    })
    return (
        <Card elevate size="$4" bordered height={200} onPress={onPress}>
            <Card.Header padded space="$2">
                <H4 numberOfLines={2}>{paperInfo.name}</H4>
                <Paragraph theme="alt2" numberOfLines={1}>{paperInfo.link}</Paragraph>
            </Card.Header>
            {(
                <Card.Footer padded>
                    <XStack f={1}>
                        {showSaveButton && <Button br="$10" icon={isAlreadySaved ? FileCheck2 : FilePlus2} themeInverse onPress={() => onSaveTapped(paperInfo, isAlreadySaved)}>{isAlreadySaved ? "Saved" : "Save"}</Button>}
                        <XStack f={1} />
                        {showDeleteButton && <Button br="$10" icon={Trash} themeInverse onPress={() => onDelete(paperInfo)}>Delete</Button>}
                    </XStack>
                </Card.Footer>
            )}
        </Card>
    )
}