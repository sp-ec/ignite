import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Image } from "@/components/ui/image";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { ScrollView } from "react-native";
import { useState } from "react";
import { Dimensions } from "react-native";
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
} from "react-native-reanimated";

const capitalize = (str: string) => {
	if (!str) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export default function IndexScreen() {
	const [gender, setGender] = useState("woman");
	const [isRejecting, setIsRejecting] = useState(false);
	const [isAccepting, setIsAccepting] = useState(false);

	const translateX = useSharedValue(0);

	const panGesture = Gesture.Pan()
		.activeOffsetX([-10, 10])
		.onUpdate((event) => {
			translateX.value = event.translationX;
			if (event.translationX > SWIPE_THRESHOLD) {
				setIsAccepting(true);
				setIsRejecting(false);
			} else if (event.translationX < -SWIPE_THRESHOLD) {
				setIsRejecting(true);
				setIsAccepting(false);
			} else {
				setIsAccepting(false);
				setIsRejecting(false);
			}
		})
		.onEnd(() => {
			if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
				const direction = translateX.value > 0 ? "right" : "left";
				translateX.value = withSpring(
					direction === "right" ? SCREEN_WIDTH * 1.2 : -SCREEN_WIDTH * 1.2,
					{},
					() => {
						// Reset position after swipe animation completes
						translateX.value = 0;
					},
				);
			} else {
				translateX.value = withSpring(0);
			}
		});

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateX: translateX.value },
			{ rotate: `${translateX.value / 60}deg` }, // Adds that "Tinder" tilt
		],
	}));

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ScrollView
				contentContainerStyle={{
					flexGrow: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
				showsVerticalScrollIndicator={false}
			>
				<GestureDetector gesture={panGesture}>
					<Animated.View style={animatedStyle}>
						<SafeAreaView
							style={{
								flex: 1,
							}}
						>
							<Card className=" m-2 w-[380px] rounded-xl mb-4 pb-0 border-2 border-zinc-300">
								<VStack>
									<Card className="mb-2 p-0 flex">
										<Image
											source={{
												uri: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
											}}
											alt="Profile Picture"
											className="w-[360px] h-[380px] rounded-md"
										/>
										<HStack className="justify-between p-4">
											<Text className="text-2xl">Jane, 28</Text>
											<HStack className="justify-start items-center">
												{gender === "man" ? (
													<Ionicons name="male" size={24} color={"#000"} />
												) : gender === "woman" ? (
													<Ionicons name="female" size={24} color={"#000"} />
												) : (
													<Ionicons
														name="male-female"
														size={24}
														color={"#000"}
													/>
												)}
												<Text className="text-lg ml-2">
													{capitalize(gender)}
												</Text>
											</HStack>
										</HStack>
									</Card>

									<Card className="mb-4">
										<Text className="text-lg mt-4 ">
											Meow meow meow Meow meow meow Meow meow meow Meow meow
											meow Meow meow meow Meow meow meow Meow meow meow Meow
											meow meow Meow meow meow Meow meow meow Meow meow
											meow{" "}
										</Text>
									</Card>
									<Image
										source={{
											uri: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
										}}
										alt="Profile Picture"
										className="w-[380px] h-[380px] rounded-xl mb-4"
									/>
									<Image
										source={{
											uri: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
										}}
										alt="Profile Picture"
										className="w-[380px] h-[380px] rounded-xl mb-4"
									/>
								</VStack>
							</Card>
						</SafeAreaView>
					</Animated.View>
				</GestureDetector>
			</ScrollView>
		</GestureHandlerRootView>
	);
}
