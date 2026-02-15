import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import {
	Avatar,
	AvatarFallbackText,
	AvatarImage,
} from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/ThemeContext";

export default function IndexScreen() {
	const { colorMode } = useTheme();
	const isDark = colorMode === "dark";

	// Theme Colors
	const bgColor = isDark ? "#18181B" : "#F5F5F5";

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: bgColor,
			}}
		>
			<ScrollView>
				<SafeAreaView
					style={{
						flex: 1,
					}}
				>
					<Card className="border-2 border-zinc-300 dark:border-zinc-900">
						<Text className="text-2xl dark:text-zinc-200">Chat</Text>
					</Card>
					<VStack className="p-4">
						<Card>
							<Box className="flex-row">
								<Avatar className="mr-4">
									<AvatarFallbackText>JD</AvatarFallbackText>
									<AvatarImage
										source={{
											uri: "https://gluestack.github.io/public-blog-video-assets/camera.png",
										}}
									/>
								</Avatar>
								<VStack>
									<Text className="text-md mb-1 dark:text-zinc-200">
										Jane Doe
									</Text>
									<Text className="sm dark:text-zinc-200">
										So what kinda music are you into?
									</Text>
								</VStack>
							</Box>
						</Card>
					</VStack>
				</SafeAreaView>
			</ScrollView>
		</View>
	);
}
