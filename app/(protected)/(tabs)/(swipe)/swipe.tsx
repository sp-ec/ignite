import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { VStack } from "@/components/ui/vstack";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Dimensions, ScrollView, Text } from "react-native";
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
	SlideInLeft,
	SlideInRight,
	SlideOutLeft,
	SlideOutRight,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withSpring
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const capitalize = (str: string) => {
	if (!str) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export default function IndexScreen() {
	const [gender, setGender] = useState("woman");

	const [showRejectIcon, setShowRejectIcon] = useState(false);
	const [showAcceptIcon, setShowAcceptIcon] = useState(false);

	const translateX = useSharedValue(0);

	const panGesture = Gesture.Pan()
		.activeOffsetX([-10, 10])
		.onUpdate((event) => {
			translateX.value = event.translationX;

			if (Math.abs(event.translationX) > SWIPE_THRESHOLD * 0.2) {
				const isRightSwipe = event.translationX > 0;
				if (isRightSwipe && !showAcceptIcon) {
					runOnJS(setShowAcceptIcon)(true);
					runOnJS(setShowRejectIcon)(false);
				} else if (!isRightSwipe && !showRejectIcon) {
					runOnJS(setShowRejectIcon)(true);
					runOnJS(setShowAcceptIcon)(false);
				}
			} else {
				if (showAcceptIcon) runOnJS(setShowAcceptIcon)(false);
				if (showRejectIcon) runOnJS(setShowRejectIcon)(false);
			}
		})
		.onEnd(() => {
			if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
				const direction = translateX.value > 0 ? "right" : "left";
				translateX.value = withSpring(
					direction === "right" ? SCREEN_WIDTH * 1.2 : -SCREEN_WIDTH * 1.2,
					{},
					() => {
						translateX.value = 0;
						runOnJS(setShowRejectIcon)(false);
						runOnJS(setShowAcceptIcon)(false);
					},
				);
			} else {
				translateX.value = withSpring(0);
				runOnJS(setShowRejectIcon)(false);
				runOnJS(setShowAcceptIcon)(false);
			}
		});

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateX: translateX.value },
			{ rotate: `${translateX.value / 60}deg` },
		],
	}));

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<GestureDetector gesture={panGesture}>
				{}
				<Animated.View style={{ flex: 1 }}>
					<ScrollView
						contentContainerStyle={{
							flexGrow: 1,
							justifyContent: "center",
							alignItems: "center",
						}}
						showsVerticalScrollIndicator={false}
					>
						<Animated.View style={animatedStyle}>
							<SafeAreaView style={{ flex: 1 }}>
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
										{}
									</VStack>
								</Card>
							</SafeAreaView>
						</Animated.View>
					</ScrollView>

					{}
					{showRejectIcon && (
						<Animated.View
							className="absolute z-50 inset-0 justify-center items-start"
							pointerEvents="none"
							style={{ elevation: 10 }}
							entering={SlideInLeft.duration(300)}
							exiting={SlideOutLeft.duration(300)}
						>
							<Ionicons
								name="close"
								size={32}
								color={"#FF637E"}
								className="p-3 bg-red-100 rounded-full ml-4"
								style={{ overflow: "hidden" }} 
							/>
						</Animated.View>
					)}
					{showAcceptIcon && (
						<Animated.View
							className="absolute z-50 inset-0 justify-center items-end"
							pointerEvents="none"
							style={{ elevation: 10 }}
							entering={SlideInRight.duration(300)}
							exiting={SlideOutRight.duration(300)}
						>
							<Ionicons
								name="heart"
								size={32}
								color={"#AD46FF"}
								className="p-3 bg-purple-100 rounded-full mr-4"
								style={{ overflow: "hidden" }} 
							/>
						</Animated.View>
					)}
				</Animated.View>
			</GestureDetector>
		</GestureHandlerRootView>
	);
}
