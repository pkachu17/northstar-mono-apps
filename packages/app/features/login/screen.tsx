import { Paragraph, Button, H3, Input, YStack, Label, ZStack, Image, Text, Spinner, XStack, AlertDialog } from '@my/ui'
import { DemoAlert } from '@my/ui/src/DemoAlert'

import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { ImageBackground, StyleSheet } from 'react-native'
import { useLink } from 'solito/link'
import { auth } from '../../../../firebaseConfig'

export function LoginScreen() {
    const linkProps = useLink({
        href: '/user/nate',
    })

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

    const loginWithGooglePressed = () => {

    }

    return (
        // <ImageBackground source={Images.tree} style={styles.image}>
        <ZStack f={1}>
            <YStack f={1} jc="center" ai="center" p="$1" space>
                <YStack space="$4" w={'100%'} p="$4">
                    <YStack space="$1">
                        <H3 ta="center">Welcome to Alasia.</H3>
                        {/* <H3 ta="center">Please enter your User ID to login.</H3> */}
                    </YStack>
                    <YStack space="$2.5">
                        <YStack space="$2">
                            <Paragraph>Email</Paragraph>
                            <Input size="$4" mx="$-1" my="$-1" borderWidth={2} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" value={email} onChangeText={setEmail} />
                        </YStack>
                        <YStack space="$2">
                            <Paragraph>Password</Paragraph>
                            <Input size="$4" mx="$-1" my="$-1" borderWidth={2} secureTextEntry={true} autoCapitalize="none" autoCorrect={false} autoComplete='password' value={password} onChangeText={setPassword} />
                        </YStack>
                        {error && <Paragraph py="$2" color="$red10">{error}</Paragraph>}
                    </YStack>
                </YStack>
                <YStack space="$4">
                    <Button onPress={loginPressed}>Login</Button>
                    <AlertDialog native>
                        <AlertDialog.Trigger asChild>
                            <Button>Signin with Google</Button>
                        </AlertDialog.Trigger>
                        <AlertDialog.Portal>
                            <AlertDialog.Overlay
                                key="overlay"
                                animation="quick"
                                o={0.5}
                                enterStyle={{ o: 0 }}
                                exitStyle={{ o: 0 }}
                            />
                        </AlertDialog.Portal>
                        <AlertDialog.Content
                            bordered
                            elevate
                            key="content"
                            animation={[
                                'quick',
                                {
                                    opacity: {
                                        overshootClamping: true,
                                    },
                                },
                            ]}
                            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                            x={0}
                            scale={1}
                            opacity={1}
                            y={0}
                        >
                            <YStack>
                                <AlertDialog.Title>Under construction</AlertDialog.Title>
                                <AlertDialog.Description>
                                    This feature is a work in progress!
                                </AlertDialog.Description>
                                <AlertDialog.Cancel asChild>
                                    <Button>Ok</Button>
                                </AlertDialog.Cancel>
                            </YStack>
                        </AlertDialog.Content>
                    </AlertDialog>
                </YStack>

            </YStack>
            {loading && (
                <XStack f={1} jc="center" ai="center" bg="$gray10" o={0.7}>
                    <Spinner f={1} size='large' jc="center" als="center" color="$red10" o={1} />
                </XStack>
            )}
        </ZStack>

        // </ImageBackground>
    )
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    }
});
