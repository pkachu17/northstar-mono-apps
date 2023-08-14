import React, { useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../../../firebaseConfig'

export function useAuthentication() {
    const [user, setUser] = useState<User>()
    React.useEffect(() => {
        const unsubscribeFromAuthStatuChanged = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                console.log("User has been signed in with token", user?.stsTokenManager?.accessToken)
                setUser(user);
            } else {
                // User is signed out
                console.log("User has been signed out")
                setUser(undefined);
            }
        });

        return unsubscribeFromAuthStatuChanged;
    }, []);

    return {
        user
    };
}