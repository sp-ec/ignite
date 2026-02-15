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

export default function IndexScreen() {
	return (
		<ScrollView>
			<SafeAreaView
				style={{
					flex: 1,
				}}
			>
				<Card className="border-2 border-zinc-300">
					<Text className="text-2xl ">Chat</Text>
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
								<Text className="text-md mb-1">Jane Doe</Text>
								<Text className="sm">So what kinda music are you into?</Text>
							</VStack>
						</Box>
					</Card>
				</VStack>
			</SafeAreaView>
		</ScrollView>
	);
}
