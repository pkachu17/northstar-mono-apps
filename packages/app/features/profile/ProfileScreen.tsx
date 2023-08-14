import React, { useContext, useEffect } from 'react'
import { Paragraph, YStack, Switch, H1, XStack, Avatar, ListItem, Button } from "@my/ui/src";
import { ChevronRight, Edit, Settings } from '@tamagui/lucide-icons';
import { StringConstants } from 'app/utils/strings';
import { actionTypes } from 'app/utils/reducer';
import { DataContext } from 'app/provider/storage';

export function ProfileScreen({ navigation }) {

    const { storageDispatch, appState } = useContext(DataContext)

    const toggleDarkMode = () => {
        storageDispatch({ type: actionTypes.TOGGLE_THEME })
    }

    const navigateToSavedPapers = () => {
        navigation.navigate(StringConstants.screenNames.SAVED_PAPERS)
    }

    useEffect(() => {
        // navigation?.setOptions({
        //     headerLeft: () => (
        //         <XStack onPress={goToUserSettings} >
        //             <Settings size="$1.5" />
        //         </XStack>
        //     )
        // });
    }, [navigation]);

    const ToggleSwitch = (props) => {
        const id = `switch-${props.size.toString().slice(1)}`
        return (<Switch id={id} size={props.size} defaultChecked={appState.theme == 'dark'} onPress={toggleDarkMode}>
            <Switch.Thumb animation="quick" />
        </Switch>)
    }

    const navigateToPrivacyPolicy = () => {
        // TODO: - Add Privacy Policy redirect here
        // navigation.navigate("PastCheckinsScreen")
    }

    const navigateToTAndC = () => {
        // TODO: - Add T&C redirect here
        // navigation.navigate("PastCheckinsScreen")
    }

    return (
        <YStack f={1} jc="flex-start" ai="flex-start" py="$4" space="$4">
            <XStack jc="center" ai="center" space="$5" bg="$background" p="$4">
                {/* <Avatar circular size="$10">
                    <Avatar.Image
                        accessibilityLabel="Cam"
                        src="https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80"
                    />
                    <Avatar.Fallback backgroundColor="$blue10" />
                </Avatar> */}
                <YStack f={1} jc="center" ai="flex-start" space="$2" px="$1.5">
                    <Paragraph fontSize={19}>{"Bhargav Vasist"}</Paragraph>
                    <Paragraph color="$color9">{"bhargav@test.com"}</Paragraph>
                </YStack>
                {/* <Button size="$3" iconAfter={<Edit size="$1" />} /> */}
            </XStack>
            <YStack>
                <ListItem
                    title="Dark Mode"
                    iconAfter={<ToggleSwitch size="$3" />}
                    bg="$background"
                    p="$4"
                />
                <ListItem
                    title="Saved Papers"
                    iconAfter={ChevronRight}
                    onPress={navigateToSavedPapers}
                    bg="$background"
                    p="$4"
                />
                <ListItem
                    title="Privacy Policy"
                    iconAfter={ChevronRight}
                    onPress={navigateToPrivacyPolicy}
                    bg="$background"
                    p="$4"
                />
                <ListItem
                    title="Terms and Conditions"
                    iconAfter={ChevronRight}
                    onPress={navigateToPrivacyPolicy}
                    bg="$background"
                    p="$4"
                />
            </YStack>
        </YStack>
    )
}