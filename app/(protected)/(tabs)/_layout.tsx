import { Tabs } from "expo-router";

export default function BottomTabsLayout() {
  return (
    <Tabs screenOptions={{}}>
      <Tabs.Screen name="swipe" options={{ title: "Swipe" }} />
      <Tabs.Screen name="chat" options={{ title: "Chat" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
