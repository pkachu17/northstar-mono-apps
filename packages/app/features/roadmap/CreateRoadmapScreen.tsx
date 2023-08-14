import { Button, Form, Input, Paragraph, ScrollView, Spinner, TextArea, XStack, YStack, useTheme } from '@my/ui'
import { Cross, MinusCircle, PlusCircle, X, XCircle } from '@tamagui/lucide-icons'
import { createNewRoadmap, updateRoadmap } from 'app/provider/network/roadmap'
import { useAuthentication } from 'app/utils/hooks/useAuthentication'
import { StringConstants } from 'app/utils/strings'
import React, { useEffect, useState } from 'react'
import Tags from 'react-native-tags'

export const CreateRoadmapScreen = ({ navigation, route }) => {
    const { roadmapInfo, isClone } = route.params
    console.log("Roadmap passed", roadmapInfo)
    const [status, setStatus] = useState<'off' | 'submitting' | 'ready'>('off')
    const [roadmapName, setRoadmapName] = useState(roadmapInfo?.name ?? "")
    const [roadmapDesc, setRoadmapDesc] = useState(roadmapInfo?.description ?? "")
    const [roadmapTags, setRoadmapTags] = useState(roadmapInfo?.tags ?? [])
    const [noOfLevels, setNoOfLevels] = useState(roadmapInfo?.levels ?? 0)
    const { user } = useAuthentication()

    const isEditMode = !!roadmapInfo

    useEffect(() => {
        if (status === 'submitting') {
            sendRequest()
        }
    }, [status])

    useEffect(() => {
        navigation?.getParent()?.setOptions({
            headerTitle: isEditMode ? StringConstants.screenTitles.EDIT_ROADMAP : StringConstants.screenTitles.CREATE_ROADMAP,
            headerRight: null
        })
    }, [navigation]);

    const sendRequest = async () => {
        if (isEditMode) {
            const newRoadmap = {
                ...roadmapInfo,
                name: roadmapName,
                description: roadmapDesc,
                tags: roadmapTags,
                levels: noOfLevels,
            }
            const response = await updateRoadmap({
                userToken: user?.stsTokenManager?.accessToken,
                roadmapInfo: newRoadmap
            }).catch(err => {
                console.error("Errored updating roadmap")
            })
            navigateToRoadmap(newRoadmap)
        } else {
            const response = await createNewRoadmap({
                userToken: user?.stsTokenManager?.accessToken,
                name: roadmapName,
                description: roadmapDesc,
                tags: roadmapTags,
                levels: noOfLevels
            }).catch(err => {
                console.log("Errored while creating roadmap", err)
            })
            console.log("Creating roadmap", response)
            navigateToRoadmap(response)
        }
    }

    const updateLevel = (isBump = true) => {
        const updatedLevelValue = isBump ? noOfLevels + 1 : noOfLevels - 1
        setNoOfLevels(updatedLevelValue)
    }

    useEffect(() => {
        if (roadmapName && noOfLevels > 0) {
            setStatus('ready')
        } else {
            setStatus('off')
        }
    }, [roadmapName, noOfLevels])

    const navigateToRoadmap = (roadmap) => {
        navigation.navigate(StringConstants.stackNames.ROADMAP, {
            screen: StringConstants.screenNames.ROADMAP,
            params: {
                roadmapData: roadmap
            }
        })
    }

    const ctaText = isEditMode ? "Save Roadmap" : "Create Roadmap"

    return (
        <ScrollView>
            <Form
                py="$2" px="$4" mt="$4" space="$3"
                onSubmit={() => setStatus('submitting')}
            >
                <XStack alignItems="center" space="$4">
                    <Paragraph width={90} htmlFor="name">
                        Name
                    </Paragraph>
                    <Input flex={1} id="name" value={roadmapName} placeholder='Enter a name' onChangeText={setRoadmapName} autoCapitalize="none" autoCorrect={false} />
                </XStack>
                <XStack alignItems="center" space="$4">
                    <Paragraph width={90} htmlFor="name">
                        Description
                    </Paragraph>
                    <TextArea f={1} minHeight={140} value={roadmapDesc} onChangeText={setRoadmapDesc} placeholder="Enter a description..." numberOfLines={3} autoCapitalize="none" autoCorrect={false} />
                </XStack>
                <XStack alignItems="center" space="$4">
                    <Paragraph width={90} htmlFor="name">
                        Tags
                    </Paragraph>
                    <AddTagComponent roadmapTags={roadmapTags} setRoadmapTags={setRoadmapTags} />
                </XStack>
                <XStack alignItems="center" space="$4">
                    <Paragraph width={90} htmlFor="name">
                        Levels
                    </Paragraph>
                    <XStack space="$4">
                        <MinusCircle disabled={noOfLevels == 0 ? true : false} onPress={() => updateLevel(false)} />
                        <Paragraph>{noOfLevels}</Paragraph>
                        <PlusCircle disabled={noOfLevels == 3 ? true : false} onPress={updateLevel} />
                    </XStack>
                </XStack>
                <Form.Trigger asChild disabled={status === 'off'}>
                    <Button themeInverse icon={status === 'submitting' ? () => <Spinner /> : undefined}>{ctaText}</Button>
                </Form.Trigger>
            </Form>
        </ScrollView>
    )
}

const AddTagComponent = ({ roadmapTags, setRoadmapTags }) => {
    const theme = useTheme()
    return (
        <Tags
            textInputProps={{
                placeholder: "Enter tags for your roadmap",
                autoCapitalize: "none",
                autoCorrect: false,

            }}
            initialTags={roadmapTags}
            onChangeTags={tags => setRoadmapTags(tags)}
            onTagPress={(index, tagLabel, event, deleted) =>
                console.log(index, tagLabel, event, deleted ? "deleted" : "not deleted")
            }
            containerStyle={{ justifyContent: "center" }}
            inputStyle={{ borderRadius: 3, backgroundColor: theme.background.val, color: theme.color.val }}
            renderTag={({ tag, index, onPress, deleteTagOnPress, readonly }) => (
                <XStack
                    key={`${tag}-${index}`}
                    onPress={onPress}
                    pt="$1"
                    themeInverse
                    bg="$background"
                    br="$6"
                    px="$2"
                    mx="$1.5"
                    mt="$1.5"
                    space="$1"
                    jc="center"
                    ai="center"
                >
                    <Paragraph als="center">{tag}</Paragraph>
                    <X size="0.75" />
                </XStack>
            )}
            style={{ flex: 1, }}
        />
    )
}