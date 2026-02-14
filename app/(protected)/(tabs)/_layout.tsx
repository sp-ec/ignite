import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

export default function BottomTabsLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: "#AD46FF",
				tabBarInactiveTintColor: "#666",
				tabBarShowLabel: true, // Cleaner look for bubble styles
				tabBarStyle: {
					backgroundColor: "#fff",
					height: 92,
					borderTopWidth: 0,
					elevation: 0,
					marginBottom: -10,
				},
				tabBarLabelStyle: {
					marginTop: 15,
					fontSize: 12,
					fontWeight: "600",
				},
			}}
		>
			<Tabs.Screen
				name="(swipe)"
				options={{
					title: "Swipe",

					tabBarIcon: ({ color, size, focused }) => (
						<View
							style={{
								backgroundColor: focused ? "#E9D4FF" : "transparent",
								borderRadius: 20,
								paddingHorizontal: 35,
								paddingVertical: 25,
								marginBottom: -10,
								marginTop: 34,
								paddingBlockStart: 10,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Ionicons ios="heart" name="heart" size={size} color={color} />
						</View>
					),
				}}
			/>
			<Tabs.Screen
				name="(chat)"
				options={{
					title: "Chat",
					tabBarIcon: ({ color, size, focused }) => (
						<View
							style={{
								backgroundColor: focused ? "#E9D4FF" : "transparent",
								borderRadius: 20,
								paddingHorizontal: 35,
								paddingVertical: 25,
								marginBottom: -10,
								marginTop: 34,
								paddingBlockStart: 10,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Ionicons name="chatbox-ellipses" size={size} color={color} />
						</View>
					),
				}}
			/>
			<Tabs.Screen
				name="(profile)"
				options={{
					title: "Profile",
					tabBarIcon: ({ color, size, focused }) => (
						<View
							style={{
								backgroundColor: focused ? "#E9D4FF" : "transparent",
								borderRadius: 20,
								paddingHorizontal: 35,
								paddingVertical: 25,
								marginBottom: -10,
								marginTop: 34,
								paddingBlockStart: 10,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Ionicons name="person-circle" size={size} color={color} />
						</View>
					),
				}}
			/>
		</Tabs>
	);
}
