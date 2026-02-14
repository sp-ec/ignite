import {
  Stack,
  useRouter,
  useSegments,
  useRootNavigationState,
} from "expo-router";
import { AuthProvider } from "@/utils/authContext";
import { use, useEffect } from "react";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(protected)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
