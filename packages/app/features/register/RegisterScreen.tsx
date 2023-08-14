import { Paragraph, Button, H3, Input, YStack, Label, ZStack, Image, Text, Spinner, XStack, Form } from '@my/ui'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { auth, firestoreDB } from '../../../../firebaseConfig'
import { doc, getFirestore, addDoc, collection } from "firebase/firestore";
import { useAuthentication } from 'app/utils/hooks/useAuthentication'
import { DataContext } from 'app/provider/storage'
import { actionTypes } from 'app/utils/reducer'

export function RegisterScreen() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [reEnterPassword, setReEnterPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<'off' | 'submitting' | 'submitted'>('off')
    const { appDispatch } = useContext(DataContext)

    const addUserToReducer = async (uid) => {
        appDispatch({
            type: actionTypes.REGISTER_USER, payload: {
                authProvider: "local",
                name: name,
                email: email,
                uid: uid
            }
        });
    }

    const registerPressed = () => {
        if (email === '' || password === '') {
            setError("Email and Password is mandatory")
            return;
        }
        setLoading(true)


        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                addUserToReducer(user.uid)
                console.log("Registered and logged in!", user)
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

    return (
        <ZStack f={1}>
            <YStack f={1} jc="center" ai="center" p="$4" space>
                <H3 ta="center">Registration</H3>
                <Form
                    ai="center"
                    jc="center"
                    space="$3"
                    onSubmit={() => setStatus('submitting')}
                    bw={1}
                    br="$4"
                    p="$4"
                    miw={300}
                >
                    <YStack space="$2">
                        <Paragraph>Name</Paragraph>
                        <Input bw="$2" size="$4" miw={300} borderWidth={2} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" value={name} onChangeText={setName} placeholder="Enter your Name" />
                    </YStack>
                    <YStack space="$2">
                        <Paragraph>Email *</Paragraph>
                        <Input bw="$2" size="$4" miw={300} mx="$-1" my="$-1" borderWidth={2} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" value={email} onChangeText={setEmail} placeholder="Enter your Email" />
                    </YStack>
                    <YStack space="$2">
                        <Paragraph>Password *</Paragraph>
                        <Input bw="$2" size="$4" miw={300} mx="$-1" my="$-1" borderWidth={2} secureTextEntry={true} autoCapitalize="none" autoCorrect={false} autoComplete='password' value={password} onChangeText={setPassword} placeholder="Set a password" />
                    </YStack>
                    <YStack space="$2">
                        <Paragraph>Re-enter Password *</Paragraph>
                        <Input bw="$2" size="$4" miw={300} mx="$-1" my="$-1" borderWidth={2} secureTextEntry={true} autoCapitalize="none" autoCorrect={false} autoComplete='password' value={reEnterPassword} onChangeText={setReEnterPassword} placeholder="Re-enter your password" />
                    </YStack>
                    {error && <Text py="$5">{error}</Text>}
                    <Form.Trigger>
                        <Button als="center" size="$4" my="$8" miw={250} onPress={registerPressed} themeInverse>Register</Button>
                    </Form.Trigger>
                </Form>
            </YStack>
            {
                loading && (
                    <XStack f={1} jc="center" ai="center" bg="$gray10" o={0.7}>
                        <Spinner f={1} size='large' jc="center" als="center" color="$red10" o={1} />
                    </XStack>
                )
            }
        </ZStack >
    )
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    }
});
