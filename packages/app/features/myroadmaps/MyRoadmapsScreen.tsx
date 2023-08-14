import React, { useContext, useEffect, useState } from 'react'
import { Paragraph, YStack, Switch, H1, ZStack, H4, XStack, Button } from "@my/ui/src";
import { DataContext } from 'app/provider/storage';
import { useAuthentication } from 'app/utils/hooks/useAuthentication';
import { getMyRoadmaps } from 'app/provider/network/roadmap';
import { DemoCard } from '../explore/ExploreScreen';
import { FlatList, Platform } from 'react-native';
import { StringConstants } from 'app/utils/strings';
import FullscreenLoader from '@my/ui/src/FullscreenLoader';
import { isTablet } from '../../utils/baubles';

export function MyRoadmapsScreen({ navigation }) {
    const [loading, setLoading] = useState(false)
    const { user } = useAuthentication()
    const [roadmaps, setRoadmaps] = useState([])

    useEffect(() => {
        navigation?.setOptions({
            headerRight: () => (
                <Paragraph onPress={goToCreatePage} >Create</Paragraph>
            ),
        });


        const unsubscribe = navigation.addListener('focus', () => {
            // The screen is focused
            if (user) {
                // fetchRoadmaps()
            }
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        if (user) {
            fetchRoadmaps()
        }
    }, [user])


    const fetchRoadmaps = async () => {
        setLoading(true)
        let responseData = await getMyRoadmaps({ userToken: user?.stsTokenManager?.accessToken, userID: user.uid })
        setRoadmaps(responseData)
        setLoading(false)
    }

    const goToCreatePage = () => {
        navigation.navigate(StringConstants.stackNames.ROADMAP, {
            screen: StringConstants.screenNames.CREATE_ROADMAP,
            params: {
                roadmapInfo: null
            }
        })
    }

    const navigateToRoadmap = (roadmap) => {
        navigation.navigate(StringConstants.stackNames.ROADMAP, {
            screen: StringConstants.screenNames.ROADMAP,
            params: {
                roadmapData: roadmap
            }
        })
    }

    const emptyComponent = () => {
        return (
            <YStack f={1} mt="$5" ai="center" jc="center" space="$3" mih={300}>
                <Paragraph
                    fontSize={16}
                >{"Sorry you haven't created any roadmaps yet."}
                </Paragraph>
                <Button themeInverse onPress={goToCreatePage}>Create a new one</Button>
            </YStack>
        )
    }

    return (
        <ZStack f={1} jc="center" ai="center">
            <FlatList
                numColumns={(Platform.OS == 'web' || isTablet()) ? 4 : 2}
                data={roadmaps}
                renderItem={({ item, index }) => <DemoCard mr="$4" item={item} index={index} onPress={() => navigateToRoadmap(item)} />}
                ItemSeparatorComponent={() => <XStack h="$3" />}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                // bounces={false}
                style={{ flex: 1 }}
                ListHeaderComponent={<H4 ai="flex-start" py="$2" mb="$2">Here are the roadmaps you have created</H4>}
                ListEmptyComponent={emptyComponent}
                contentContainerStyle={{ padding: 18, alignContent: "flex-start" }}
                onRefresh={fetchRoadmaps}
                refreshing={loading}
            />
            {loading && <FullscreenLoader />}
        </ZStack>

    )
}