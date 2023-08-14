import AsyncStorage from '@react-native-async-storage/async-storage';
import { actionTypes } from 'app/utils/reducer';
import { StorageKeys } from 'app/utils/storageKeys';
import React, { useEffect, useReducer } from 'react';

export const storeData = async (key: string, value: any) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
        // saving error
    }
}

export const getData = async (key: string) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        // error reading value
    }
}

const storageInitialState = {
    theme: 'light',
    devMode: true
}

const storageReducer = (state, action) => {
    switch (action.type) {
        case actionTypes.TOGGLE_THEME:
            const newTheme = state.theme === 'light' ? 'dark' : 'light'
            console.log("we togglin to", newTheme)
            return { ...state, theme: newTheme }
        case actionTypes.RESTORE:
            return { ...state, ...action.payload }
        default:
            return state
    }
}

export const DataContext = React.createContext()

export const DataProvider = ({ appDispatch, appState, children }) => {

    // This is not app level state, this is for the async storage reducer.
    const [storageState, storageDispatch] = useReducer(storageReducer, storageInitialState)

    useEffect(() => {
        async function rehydrate() {
            console.log("we rehydratin")
            const storedState = await getData(StorageKeys.app.state)
            if (storedState) {
                storageDispatch({ type: actionTypes.RESTORE, payload: storedState })
            }
        }

        rehydrate()
    }, []);

    // Make this clever and be efficient
    useEffect(() => {
        console.log("we re-storing cuz somethin changed")
        storeData(StorageKeys.app.state, storageState);
        appDispatch({ type: actionTypes.HYDRATE, payload: storageState });
    }, [storageState])

    return <DataContext.Provider value={{ storageState, storageDispatch, appState, appDispatch }}>{children}</DataContext.Provider>
};