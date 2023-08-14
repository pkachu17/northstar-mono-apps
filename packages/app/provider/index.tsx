import config from '../tamagui.config'
import { NavigationProvider } from './navigation'
import { TamaguiProvider, TamaguiProviderProps } from '@my/ui'
import { useColorScheme } from 'react-native';
import { actionTypes } from 'app/utils/reducer';
import { useReducer } from 'react';
import { DataProvider } from './storage';

// THIS SERVES THE ENTIRE APP
// THIS IS ALWAYS SOURCE OF TRUTH FOR ALL COMPONENTS FOR APP LEVEL DATA.
// IF YOU NEED ASYNCSTORAGE DATA, GO TO DATAPROVIDER FOR ITS REDUCER.
const initalState = {
  theme: 'light',
  learningList: [],

  // Either adult mode or child
  mode: "adult",

  // The payload for Firestore's DB entry
  userToBeRegistered: {}
}

// THIS IS THE APP LEVEL REDUCER
const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.HYDRATE:
      return { ...state, ...action.payload }
    case actionTypes.UPDATE_LEARNING_LIST:
      return { ...state, learningList: action.payload }
    case actionTypes.ADD_TO_LEARNING_LIST:
      return { ...state, learningList: [...state.learningList, action.payload] }
    case actionTypes.REGISTER_USER:
      return { ...state, userToBeRegistered: action.payload }
    case actionTypes.SWITCH_MODE:
      return { ...state, mode: action.payload }
    default:
      return state
  }
}

export function Provider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {
  const scheme = useColorScheme();
  const defaultTheme = scheme === 'dark' ? 'dark' : 'light'
  const [state, dispatch] = useReducer(reducer, { ...initalState, theme: defaultTheme })
  return (
    <DataProvider appDispatch={dispatch} appState={state}>
      <TamaguiProvider config={config} disableInjectCSS defaultTheme={state.theme} {...rest}>
        <NavigationProvider>{children}</NavigationProvider>
      </TamaguiProvider>
    </DataProvider>
  )
}
