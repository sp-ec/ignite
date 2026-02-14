import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function BottomTabsLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: "#ff6b6b",
				tabBarStyle: {
					backgroundColor: "#fff",
					height: 65,
					paddingBottom: 10,
				},
			}}
		>
			<Tabs.Screen
				name="(swipe)"
				options={{
					title: "Swipe",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="copy-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="(chat)"
				options={{
					title: "Chat",
					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name="chatbox-ellipses-outline"
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="(profile)"
				options={{
					title: "Profile",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="person-circle-outline" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
