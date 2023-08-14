import { Paragraph } from '@my/ui';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { LoginScreen } from 'app/features/login/LoginScreen'
import { RegisterScreen } from 'app/features/register/RegisterScreen';
import { useAuthentication } from 'app/utils/hooks/useAuthentication';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ExploreScreen } from '../../features/explore/ExploreScreen'
import { Archive, Book, Component, Download, Map, Search, User } from '@tamagui/lucide-icons';
import { MyLearningsScreen } from 'app/features/learn/MyLearningsScreen';
import { SavedPapersScreen } from 'app/features/saved/SavedPapersScreen';
import { ProfileScreen } from 'app/features/profile/ProfileScreen';
import { StringConstants } from 'app/utils/strings';
import { RoadmapScreen } from 'app/features/roadmap/RoadmapScreen';
import { CreateRoadmapScreen } from 'app/features/roadmap/CreateRoadmapScreen';
import { MyRoadmapsScreen } from 'app/features/myroadmaps/MyRoadmapsScreen';
import { AddPaperScreen } from 'app/features/roadmap/AddPaperScreen';
import { ViewPaperScreen } from 'app/features/roadmap/ViewPaperScreen';

const LoggedInTab = createBottomTabNavigator<{
  ExploreStack: undefined,
  LearnStack: undefined,
  RoadmapStack: undefined,
  ProfileStack: undefined,
}>()

const LoggedOutStack = createNativeStackNavigator<{
  Login: undefined,
  Register: undefined
}>()

// TODO: - Make this work dynamically
function getHeaderTitle(route) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';

  switch (routeName) {
    case StringConstants.screenNames.ROADMAP:
      return 'News feed';
    case 'Profile':
      return 'My profile';
    case 'Account':
      return 'My account';
  }
}

export function NativeNavigation() {
  let { user } = useAuthentication()
  if (!user) {
    return (
      <LoggedOutStack.Navigator>
        <LoggedOutStack.Screen
          name={StringConstants.screenNames.LOGIN}
          component={LoginScreen}
          options={{
            title: StringConstants.screenTitles.LOGIN
          }}
        />
        <LoggedOutStack.Screen
          name={StringConstants.screenNames.REGISTER}
          component={RegisterScreen}
          options={{
            title: StringConstants.screenTitles.REGISTER
          }}
        />
      </LoggedOutStack.Navigator>
    )
  } else {
    return (
      <LoggedInTab.Navigator screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => tabBarIconGetter({ route, focused, color, size }),
        tabBarLabelStyle: { fontWeight: '700' },
        headerTitleAlign: 'center'
      })}>
        <LoggedInTab.Screen
          name={StringConstants.stackNames.EXPLORE}
          component={ExploreStackComponent}
          options={{
            title: StringConstants.stackTitles.EXPLORE
          }}
        />
        <LoggedInTab.Screen
          name={StringConstants.stackNames.LEARN}
          component={LearnStackComponent}
          options={{
            title: StringConstants.stackTitles.LEARN,
          }}
        />
        <LoggedInTab.Screen
          name={StringConstants.stackNames.MY_ROADMAPS}
          component={MyRoadmapsStackComponent}
          options={{
            title: StringConstants.stackTitles.MY_ROADMAPS,
          }}
        />
        <LoggedInTab.Screen
          name={StringConstants.stackNames.PROFILE}
          component={ProfileStackComponent}
          options={{
            title: StringConstants.stackTitles.PROFILE,
          }}
        />
      </LoggedInTab.Navigator>
    )
  }
}

const RoadmapStack = createNativeStackNavigator<{
  Roadmap: undefined
  CreateRoadmap: undefined
  AddPaper: undefined
  ViewPaper: undefined
}>()
const RoadmapStackComponent = () => {
  return (
    <RoadmapStack.Navigator
      screenOptions={{
        headerShown: false
      }}>
      <RoadmapStack.Screen
        name={StringConstants.screenNames.ROADMAP}
        component={RoadmapScreen}
        options={{
          title: StringConstants.screenTitles.ROADMAP,
        }}
      />
      <RoadmapStack.Screen
        name={StringConstants.screenNames.CREATE_ROADMAP}
        component={CreateRoadmapScreen}
        options={{
        }}
      />
      <RoadmapStack.Screen
        name={StringConstants.screenNames.ADD_PAPER}
        component={AddPaperScreen}
        options={{
          title: StringConstants.screenTitles.ADD_PAPER,
        }}
      />
      <RoadmapStack.Screen
        name={StringConstants.screenNames.VIEW_PAPER}
        component={ViewPaperScreen}
      />
    </RoadmapStack.Navigator>
  )
}

const ExploreStack = createNativeStackNavigator<{
  Explore: undefined,
  RoadmapStack: undefined
}>()
const ExploreStackComponent = () => {
  return (
    <ExploreStack.Navigator>
      <ExploreStack.Screen
        name={StringConstants.screenNames.EXPLORE}
        component={ExploreScreen}
        options={{
          title: StringConstants.screenTitles.EXPLORE,
          headerRight: () => (
            <Paragraph>Logout</Paragraph>
          ),
        }}
      />
      <ExploreStack.Screen
        name={StringConstants.stackNames.ROADMAP}
        component={RoadmapStackComponent}
        options={{
          headerTitle: StringConstants.screenTitles.ROADMAP,
        }}
      />
    </ExploreStack.Navigator>
  )
}

const LearnStack = createNativeStackNavigator<{
  MyLearnings: undefined,
  RoadmapStack: undefined
}>()
const LearnStackComponent = () => {
  return (
    <LearnStack.Navigator>
      <LearnStack.Screen
        name={StringConstants.screenNames.MY_LEARNINGS}
        component={MyLearningsScreen}
        options={{
          title: StringConstants.screenTitles.MY_LEARNINGS
        }}
      />
      <LearnStack.Screen
        name={StringConstants.stackNames.ROADMAP}
        component={RoadmapStackComponent}
        options={{
          headerTitle: StringConstants.screenTitles.ROADMAP,
        }}
      />
    </LearnStack.Navigator>
  )
}

const MyRoadmapsStack = createNativeStackNavigator<{
  MyRoadmaps: undefined,
  RoadmapStack: undefined
}>()
const MyRoadmapsStackComponent = () => {
  return (
    <MyRoadmapsStack.Navigator>
      <MyRoadmapsStack.Screen
        name={StringConstants.screenNames.MY_ROADMAPS}
        component={MyRoadmapsScreen}
        options={{
          title: StringConstants.screenTitles.MY_ROADMAPS
        }}
      />
      <MyRoadmapsStack.Screen
        name={StringConstants.stackNames.ROADMAP}
        component={RoadmapStackComponent}
        options={{
          headerTitle: StringConstants.screenTitles.ROADMAP,
        }}
      />
    </MyRoadmapsStack.Navigator>
  )
}

// TODO: - Replace this with My Learnings
const SavedStack = createNativeStackNavigator<{
  SavedPapers: undefined,
}>()
const SavedStackComponent = () => {
  return (
    <SavedStack.Navigator>
      <SavedStack.Screen
        name={StringConstants.screenNames.SAVED_PAPERS}
        component={SavedPapersScreen}
        options={{
          title: StringConstants.screenTitles.SAVED_PAPERS,
          headerRight: () => (
            <Paragraph>Logout</Paragraph>
          ),
        }}
      />
    </SavedStack.Navigator>
  )
}

const ProfileStack = createNativeStackNavigator<{
  Profile: undefined,
  Settings: undefined,
  SavedStack: undefined
}>()
const ProfileStackComponent = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name={StringConstants.screenNames.PROFILE}
        component={ProfileScreen}
        options={{
          title: StringConstants.screenTitles.PROFILE,
          headerRight: () => (
            <Paragraph>Logout</Paragraph>
          ),
        }}
      />
      <SavedStack.Screen
        name={StringConstants.screenNames.SAVED_PAPERS}
        component={SavedPapersScreen}
        options={{
          title: StringConstants.screenTitles.SAVED_PAPERS
        }}
      />
      <RoadmapStack.Screen
        name={StringConstants.screenNames.VIEW_PAPER}
        component={ViewPaperScreen}
      />
    </ProfileStack.Navigator>
  )
}

const tabBarIconGetter = ({ route, focused, color, size }) => {
  let fillColor = focused ? 'color' : 'transparent'
  if (route.name === StringConstants.stackNames.EXPLORE) {
    return <Search size={size} />
  } else if (route.name === StringConstants.stackNames.LEARN) {
    return <Book size={size} />
  } else if (route.name === StringConstants.stackNames.MY_ROADMAPS) {
    return <Map size={size} />
  } else if (route.name === StringConstants.stackNames.SAVED) {
    return <Download size={size} />
  } else if (route.name === StringConstants.stackNames.PROFILE) {
    return <User size={size} />
  }
}