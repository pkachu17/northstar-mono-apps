import React, { useContext, useEffect, useState } from 'react'
import { Paragraph, YStack, Switch, H1, XStack, ZStack, H4 } from "@my/ui/src";
import { AppRoutes, getRequest } from 'app/provider/network/axiosManager';
import { useAuthentication } from 'app/utils/hooks/useAuthentication';
import { FlatList, Platform } from 'react-native';
import { DemoCard } from '../explore/ExploreScreen';
import FullscreenLoader from '@my/ui/src/FullscreenLoader';
import { DataContext } from 'app/provider/storage';
import { actionTypes } from 'app/utils/reducer';
import { getLearningList } from 'app/provider/network/learningList';
import { getRoadmapInfo } from 'app/provider/network/roadmap';
import { StringConstants } from 'app/utils/strings';
import { isTablet } from '../../utils/baubles';

export function MyLearningsScreen({ navigation }) {

    const { appDispatch, appState } = useContext(DataContext)
    const learnings = appState.learningList
    const [loading, setLoading] = useState(false)
    const { user } = useAuthentication()

    const fetchLearningList = async () => {
        setLoading(true)
        let responseData = await getLearningList({ userToken: user?.stsTokenManager?.accessToken })
        let responseList: [Promise<any>?] = []
        console.log("learning list", responseData)
        appDispatch({ type: actionTypes.UPDATE_LEARNING_LIST, payload: responseData });
        setLoading(false)
    }

    const loadRoadmap = async (roadmapID) => {
        setLoading(true)
        let responseData = await getRoadmapInfo({ userToken: user?.stsTokenManager?.accessToken, roadmapID })
        return responseData
    }

    const navigateToRoadmap = (roadmap) => {
        navigation.navigate(StringConstants.stackNames.ROADMAP, {
            screen: StringConstants.screenNames.ROADMAP,
            params: {
                roadmapData: roadmap
            }
        })
    }

    useEffect(() => {
        if (user) {
            fetchLearningList()
        }
    }, [user])

    return (
        <ZStack f={1}>
            <YStack f={1} jc="center" ai="flex-start" p="$4" space>
                <YStack space="$4" maw={600}>
                    <H4>Here are the roadmaps you are currently learning</H4>
                    <FlatList
                        numColumns={(Platform.OS == 'web' || isTablet()) ? 4 : 2}
                        data={learnings}
                        renderItem={({ item, index }) => <DemoCard mr="$4" item={item} index={index} onPress={() => navigateToRoadmap(item)} />}
                        ItemSeparatorComponent={() => <XStack h="$2" />}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                        style={{ flex: 1 }}
                        ListEmptyComponent={<Paragraph als="center" justifyContent='center' fontSize={16}>Sorry you don't have any roadmaps added to your Learning List. Find some in the Explore Page</Paragraph>}
                    />
                </YStack>
            </YStack>
            {loading && <FullscreenLoader />}
        </ZStack>

    )
}