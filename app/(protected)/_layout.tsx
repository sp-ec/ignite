import { auth } from "@/FirebaseConfig";
import { Redirect, Stack } from "expo-router";
import { useContext } from "react";

const isLoggedIn = false;

export default function ProtectedLayout() {
  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
