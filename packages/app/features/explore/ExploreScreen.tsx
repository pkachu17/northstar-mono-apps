import { Anchor, Button, Card, CardProps, H1, H2, H3, Input, Paragraph, Separator, Sheet, XStack, YStack, ZStack, Image, H4, H6, debounce, Spinner } from '@my/ui'
import FullscreenLoader from '@my/ui/src/FullscreenLoader';
import RatingComponent from '@my/ui/src/RatingComponent';
import { Star, StarHalf, StarOff, UserCheck } from '@tamagui/lucide-icons'
import { useAuthentication } from 'app/utils/hooks/useAuthentication';
import { StringConstants } from 'app/utils/strings';
import { signOut } from 'firebase/auth';
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { FlatList, Platform } from 'react-native';
import { auth } from '../../../../firebaseConfig';
import { getAllRoadmaps, getSearchRequest } from '../../provider/network/roadmap';
import UXImage from '../../assets/illustrations/3647007.png';
import PSImage from '../../assets/illustrations/4991639.png';
import DVImage from '../../assets/illustrations/9814.png';
import IlImage from '../../assets/illustrations/Wavy_Bus-35_Single-03.png';
import { DataContext } from 'app/provider/storage';
import { addUser } from 'app/provider/network/firebaseManager';
import { isTablet } from '../../utils/baubles';

const numberOfItems = (Platform.OS == 'web' || isTablet()) ? 4 : 2

export function ExploreScreen({ navigation }) {

  const { user } = useAuthentication()
  const [roadmaps, setRoadmaps] = useState([])
  const [loading, setLoading] = useState(false)
  // const [loadingMore, setLoadingMore] = useState(false)
  const [searching, setSearching] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [loadOffset, setLoadOffset] = useState(2)

  const { appState } = useContext(DataContext)

  const logout = () => {
    signOut(auth).then(() => {
    }).catch((err) => {
    })
  }

  // This acts as a cleanup place when component is unmounted.
  useEffect(() => {
    return () => {
      debouncedSearchText.cancel()
    }
  })

  useEffect(() => {
    navigation?.setOptions({
      headerRight: () => (
        <Paragraph onPress={logout} >Logout</Paragraph>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (!user) {
      return
    }
    fetchRoadmaps()
  }, [user])

  useEffect(() => {
    if (searchText) {
      getSearchedRoadmaps()
    } else if (user) {
      fetchRoadmaps()
    }
  }, [user, searchText])

  const fetchRoadmaps = async () => {
    setLoading(true)
    let responseData = await getAllRoadmaps({ userToken: user?.stsTokenManager?.accessToken })
    setRoadmaps(responseData.roadmapData)
    setLoading(false)
  }

  const fetchMoreRoadmaps = async () => {
    if (!!searchText) {
      return
    }
    setLoading(true)
    let responseData = await getAllRoadmaps({ userToken: user?.stsTokenManager?.accessToken, params: { page: loadOffset, size: 10 } })
    setLoadOffset(responseData.page + 1)
    setRoadmaps([...roadmaps, ...responseData.roadmapData])
    setLoading(false)
  }

  // TODO: - Ask backend to make this the same route
  const getSearchedRoadmaps = async () => {
    setSearching(true)
    let responseData = await getSearchRequest({ userToken: user?.stsTokenManager?.accessToken, query: searchText })
    setRoadmaps(responseData.items)
    setSearching(false)
  }

  const onHandleInputChange = (text) => {
    setSearchText(text)
  }

  const debouncedSearchText = useMemo(() => {
    return debounce(onHandleInputChange, 300)
  }, [])

  const navigateToRoadmap = (item) => {
    navigation.navigate(StringConstants.stackNames.ROADMAP, {
      screen: StringConstants.screenNames.ROADMAP,
      params: {
        roadmapData: item
      }
    })
  }

  const searchHeader = () => {
    return (
      <YStack space="$2" pb="$4">
        <H3 ta="center">Welcome to Alasia</H3>
        <Paragraph ta="center">
          Learn something new today!
        </Paragraph>
        <XStack jc="center" ai="center" space="$3">
          <Input size="$4" w={"75%"} placeholder={`Search..`} onChangeText={debouncedSearchText} />
          <Button size="$4" fontSize={14}>Go</Button>
        </XStack>
      </YStack >
    )
  }


  useEffect(() => {
    if (appState.userToBeRegistered) {
      const addToFirebase = async () => {
        let { name, email, uid } = appState.userToBeRegistered
        // TODO: - Update this to reflect SignInWithGoogle when we add that
        const req = await addUser({ userName: name, userEmail: email, firebaseUID: uid, authProvider: "local" })
          .catch(err => {
            console.log("Cannot add user", err)
          })
        console.log("Added user to firebase", req)
      }
      // TODO: - Fix this user adding feature for Firebase
      // addToFirebase()
    }
  }, [appState])

  return (
    <ZStack f={1} jc="center" ai="center">
      <YStack f={1} jc="flex-start" ai="center" px="$2" space="$2">
        <FlatList
          numColumns={numberOfItems}
          data={roadmaps}
          renderItem={({ item, index }) => <DemoCard item={item} index={index} onPress={() => navigateToRoadmap(item)} />}
          ItemSeparatorComponent={() => <XStack h="$1.5" />}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          horizontal={false}
          directionalLockEnabled={true}
          style={{ flex: 1 }}
          ListHeaderComponent={searchHeader()}
          contentContainerStyle={{ paddingBottom: 24, paddingTop: 16 }}
          onEndReachedThreshold={0.25}
          onEndReached={fetchMoreRoadmaps}
          onRefresh={fetchRoadmaps}
          refreshing={loading}
        />
      </YStack>
      {searching && <FullscreenLoader bg="$shadowColorFocus" />}
      {/* {loading && <FullscreenLoader />} */}
    </ZStack>
  )
}

export const DemoCard = ({ item, ...props }) => {
  const numberOfItems = (Platform.OS == 'web' || isTablet()) ? 4 : 2
  const marginRight = ((props.index + 1) % (numberOfItems) == 0) ? "$0" : "$4"
  return (
    <Card w="$13" h="$20" theme="light" elevate bordered {...props} mr={marginRight}>
      <Card.Header f={0.45} padded>
        <Image
          resizeMethod="auto"
          resizeMode="contain"
          width={"100%"}
          height={'100%'}
          src={getIllustration(props.index % 3)}
        />
      </Card.Header>
      <Card.Footer f={0.75} bg="$background">
        <YStack f={1} p="$2.5">
          <Paragraph
            fontSize={16}
            numberOfLines={2}
            fontWeight="700"
            lineHeight={20}
            height={42}
          >{item.name}</Paragraph>
          <XStack jc="flex-start" ai="center" space="$2">
            <Button padded={false} p="$-0.5" icon={<UserCheck size="$1" />} bc="transparent" />
            <Paragraph f={1} als="center" fontSize={14} numberOfLines={2}>{item.author}</Paragraph>
          </XStack>
          <XStack f={1} jc="flex-start" ai="center" space="$1.5">
            <Star size="$1" />
            {
              item.ratingCount > 0 ?
                <XStack f={1} jc="flex-start" ai="center" space="$1.5">
                  <Paragraph als="center" fontSize={13} mt="$-1">{item.rating}</Paragraph>
                  <Paragraph als="center" fontSize={13} mt="$-1">{"(" + item.ratingCount + ")"}</Paragraph>
                </XStack>
                : (
                  <Paragraph als="center" fontSize={13}>{"No Ratings"}</Paragraph>
                )
            }

          </XStack>
        </YStack>
      </Card.Footer>
      <Card.Background bc={getBackground(props.index % 3)} />
    </Card>
  )
}

export const getIllustration = (id) => {
  return id === 0 ? UXImage : id === 1 ? PSImage : id === 2 ? IlImage : DVImage;
};

export const getBackground = (id) => {
  return id === 0
    ? '#FDAAB0'
    : id === 1
      ? '#E296DE'
      : id === 2
        ? '#9E7CF4'
        : '#96D8CA';
};