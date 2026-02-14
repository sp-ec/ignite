import {
  Stack,
  useRouter,
  useSegments,
  useRootNavigationState,
} from "expo-router";
import { use, useEffect } from "react";

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

export default function RootLayout() {
  return (
    
    <GluestackUIProvider mode="dark">
      <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(protected)" options={{ headerShown: false }} />
    </Stack>
    </GluestackUIProvider>
  
  );
}
