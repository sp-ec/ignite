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
					height: 85,
					borderTopWidth: 0,
					elevation: 0,
					paddingBottom: 0,
				},
				tabBarLabelStyle: {
					marginTop: 17,
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
								width: 70,
								paddingHorizontal: 0,
								paddingVertical: 25,
								marginTop: 5,
								justifyContent: "center",
								alignItems: "center",
								position: "absolute",
								paddingBlockStart: 10,
								top: 0,
								left: -20,
								right: 0,
							}}
						>
							<Ionicons name="heart" size={size} color={color} className="" />
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
								width: 70,
								paddingHorizontal: 0,
								paddingVertical: 25,
								marginTop: 5,
								justifyContent: "center",
								alignItems: "center",
								position: "absolute",
								paddingBlockStart: 10,
								top: 0,
								left: -20,
								right: 0,
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
								width: 70,
								paddingHorizontal: 0,
								paddingVertical: 25,
								marginTop: 5,
								justifyContent: "center",
								alignItems: "center",
								position: "absolute",
								paddingBlockStart: 10,
								top: 0,
								left: -20,
								right: 0,
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
