import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { useTheme } from "@/ThemeContext";

export default function BottomTabsLayout() {
	const { colorMode } = useTheme();
	const isDark = colorMode === "dark";

	// Theme Colors
	const bgColor = isDark ? "#09090B" : "#ffffff";
	const inactiveColor = isDark ? "#888888" : "#666666";
	const activeColor = "#AD46FF";
	const bubbleColor = isDark ? "#E9D4FF" : "#E9D4FF"; // Dark purple for dark mode

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: activeColor,
				tabBarInactiveTintColor: inactiveColor,
				tabBarShowLabel: true, // Cleaner look for bubble styles
				tabBarStyle: {
					backgroundColor: bgColor,
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
								backgroundColor: focused ? bubbleColor : "transparent",
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
