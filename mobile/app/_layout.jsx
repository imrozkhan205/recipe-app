import { Slot } from "expo-router";
import {ClerkProvider} from '@clerk/clerk-expo'
import {tokenCache} from '@clerk/clerk-expo/token-cache'
import { SafeAreaView } from "react-native-safe-area-context";
import SafeScreen from '@/components/SafeScreen'
import {COLORS} from '../constants/colors.js'
export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} >
      <SafeScreen >
      <Slot />
      </SafeScreen>
    </ClerkProvider>
  )
}
