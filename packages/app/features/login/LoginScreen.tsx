import { Paragraph, Button, H3, Input, YStack, Label, ZStack, Image, Text, Spinner, XStack, ScrollView, } from '@my/ui'
import { useAuthentication } from 'app/utils/hooks/useAuthentication'
import { StringConstants } from 'app/utils/strings'
import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { ImageBackground, StyleSheet, TouchableHighlight } from 'react-native'
import { useLink } from 'solito/link'
import { auth } from '../../../../firebaseConfig'

export function LoginScreen({ navigation }) {
    const linkProps = useLink({
        href: '/user/nate',
    })

    const { user } = useAuthentication()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const loginPressed = () => {
        if (email === '' || password === '') {
            setError("Email and Password is mandatory")
            return;
        }
        setLoading(true)
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log("Yay!", user)
                setLoading(false)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("Nay!", error)
                setError(error.message)
                setLoading(false)
            });
    }

    useEffect(() => {
        if (email != '' || password != '') {
            setError("")
            return;
        }
    }, [email, password])

    useEffect(() => {
        if (user) {
            setEmail(user.email)
            setPassword("Lorem Ipsum Mater Soror Bratr")
            setLoading(true)
        }
    }, [user])

    // TODO: - Implement this
    const loginWithGooglePressed = () => {

    }

    // TODO: - Implement this
    const forgotPasswordPressed = () => {

    }

    const registerPressed = () => {
        navigation.navigate(StringConstants.screenNames.REGISTER)
    }

    return (
        <ZStack f={1}>
            <ScrollView f={1} contentContainerStyle={{ paddingTop: 64 }} automaticallyAdjustKeyboardInsets={true}>
                <YStack f={1} jc="center" ai="center" p="$1" space>
                    <YStack space="$4" w={'100%'} p="$4" mt="$-10">
                        <Image src={require('../../../../apps/expo/assets/icon.png')} resizeMode='contain' mah={200} als="center" />
                        <YStack space="$1">
                            <H3 ta="center">Welcome to Alasia.</H3>
                            {/* <H3 ta="center">Please enter your User ID to login.</H3> */}
                        </YStack>
                        <YStack space="$2.5" mb="$-10">
                            <YStack space="$2">
                                <Paragraph>Email*</Paragraph>
                                <Input size="$4" mx="$-1" my="$-1" borderWidth={2} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" value={email} onChangeText={setEmail} placeholder={`Enter your Email ID`} />
                            </YStack>
                            <YStack space="$2">
                                <Paragraph>Password*</Paragraph>
                                <Input size="$4" mx="$-1" my="$-1" borderWidth={2} secureTextEntry={true} autoCapitalize="none" autoCorrect={false} autoComplete='password' value={password} onChangeText={setPassword} placeholder={`Enter your Password`} />
                            </YStack>
                            {error && (
                                <Paragraph py="$2" color="$red10">{error}</Paragraph>
                            )
                            }
                        </YStack>
                    </YStack>
                    <YStack space="$4">
                        <Button onPress={loginPressed}>Login</Button>
                        {/* <Button>Signin with Google</Button> */}
                        <XStack>
                            <Paragraph>Don't have an account? </Paragraph>
                            <TouchableHighlight onPress={registerPressed}>
                                <Paragraph textDecorationLine='underline'>Register here</Paragraph>
                            </TouchableHighlight>
                        </XStack>
                    </YStack>
                </YStack>
            </ScrollView>
            {loading && (
                <XStack f={1} jc="center" ai="center" bg="$gray10" o={0.7}>
                    <Spinner f={1} size='large' jc="center" als="center" color="$red10" o={1} />
                </XStack>
            )}
        </ZStack>
    )
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    }
});
