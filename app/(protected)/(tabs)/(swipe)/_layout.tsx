import { Stack } from "expo-router";

export default function SwipeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Swipe" }} />
    </Stack>
  );
}
