import { db } from "@/FirebaseConfig";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { ActivityIndicator, View } from "react-native";
import {
	Timestamp,
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	setDoc,
	where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Dimensions, ScrollView } from "react-native";
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
	withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/ThemeContext";
import { router } from "expo-router";

const capitalize = (str: string) => {
	if (!str) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export default function IndexScreen() {
	const [showRejectIcon, setShowRejectIcon] = useState(false);
	const [showAcceptIcon, setShowAcceptIcon] = useState(false);

	const [profiles, setProfiles] = useState<any[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [loading, setLoading] = useState(true);

	const translateX = useSharedValue(0);

	const currentProfile =
		profiles.length > 0 && currentIndex < profiles.length
			? profiles[currentIndex]
			: null;

	useEffect(() => {
		const getProfiles = async () => {
			setLoading(true);
			const currentUser = getAuth().currentUser;

			if (!currentUser) {
				router.replace("/login");
				return;
			}

			try {
				const currentUserDoc = await getDoc(doc(db, "users", currentUser.uid));
				if (!currentUserDoc.exists()) return;

				const currentUserData = currentUserDoc.data();

				const passesSnapshot = await getDocs(
					collection(db, "users", currentUser.uid, "passes"),
				);
				const passesUids = passesSnapshot.docs.map((doc) => doc.id);

				const likesSnapshot = await getDocs(
					collection(db, "users", currentUser.uid, "likes"),
				);
				const likesUids = likesSnapshot.docs.map((doc) => doc.id);

				const usersRef = collection(db, "users");

				const today = new Date();
				const minAge = currentUserData.ageRange[0];
				const maxAge = currentUserData.ageRange[1];

				const youngestBirthdate = Timestamp.fromDate(
					new Date(
						today.getFullYear() - minAge,
						today.getMonth(),
						today.getDate(),
					),
				);

				const oldestBirthdate = Timestamp.fromDate(
					new Date(
						today.getFullYear() - maxAge - 1,
						today.getMonth(),
						today.getDate(),
					),
				);

				const q = query(
					usersRef,
					where("dob", ">=", oldestBirthdate),
					where("dob", "<=", youngestBirthdate),
				);

				const usersSnapshot = await getDocs(q);

				const users = usersSnapshot.docs
					.map((doc) => ({
						uid: doc.id,
						...(doc.data() as any),
					}))
					.filter(
						(user) =>
							user.uid !== currentUser.uid &&
							!passesUids.includes(user.uid) &&
							!likesUids.includes(user.uid) &&
							currentUserData.genderPreference.includes(user.gender),
					);
				console.log(users);
				setProfiles(users);
			} catch (error) {
				console.log("Error fetching profiles: ", error);
				alert("Failed to load profiles");
			} finally {
				setLoading(false);
			}
		};
		getProfiles();
	}, []);

	const handleSwipe = async (
		swipedUserId: string,
		direction: "left" | "right",
	) => {
		const currentUser = getAuth().currentUser;
		if (!currentUser) return;

		const userId = currentUser.uid;

		if (direction === "right") {
			const likeRef = doc(db, "users", userId, "likes", swipedUserId);
			await setDoc(likeRef, { createdAt: new Date() });

			const reverseLikeRef = doc(db, "users", swipedUserId, "likes", userId);
			const reverseDoc = await getDoc(reverseLikeRef);

			if (reverseDoc.exists()) {
				const matchId = [userId, swipedUserId].sort().join("_");
				const matchRef = doc(db, "matches", matchId);

				await setDoc(matchRef, {
					users: [userId, swipedUserId],
					createdAt: new Date(),
				});

				const userMatchRef = doc(db, "users", userId, "matches", matchId);
				await setDoc(userMatchRef, {
					createdAt: new Date(),
				});

				const otherUserMatchRef = doc(
					db,
					"users",
					swipedUserId,
					"matches",
					matchId,
				);
				await setDoc(otherUserMatchRef, {
					createdAt: new Date(),
				});
			}
		} else {
			const passRef = doc(db, "users", userId, "passes", swipedUserId);
			await setDoc(passRef, {
				createdAt: new Date(),
			});
		}
	};

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

				const swipedProfile = profiles[currentIndex];
				if (!swipedProfile) return;

				translateX.value = withSpring(
					direction === "right" ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5,
					{},
					() => {
						translateX.value = 0;
						runOnJS(setShowRejectIcon)(false);
						runOnJS(setShowAcceptIcon)(false);
						// Pass the specific ID captured above
						runOnJS(handleSwipe)(swipedProfile.uid, direction);
						runOnJS(setCurrentIndex)(currentIndex + 1);
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

	const { colorMode } = useTheme();
	const isDark = colorMode === "dark";

	// Theme Colors
	const bgColor = isDark ? "#18181B" : "#F5F5F5";
	const bgReverseColor = isDark ? "#F5F5F5" : "#18181B";

	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: bgColor,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<SafeAreaView
					style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
				>
					<ActivityIndicator size="large" color="AD46FF" />
				</SafeAreaView>
			</View>
		);
	}

	if (currentIndex >= profiles.length || (!currentProfile && !loading)) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: bgColor,
				}}
			>
				<Text className="text-xl">No more profiles found!</Text>
			</View>
		);
	}

	if (!loading && profiles.length === 0) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: bgColor,
				}}
			>
				<Text className="text-xl">No profiles match your criteria.</Text>
			</View>
		);
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<GestureDetector gesture={panGesture}>
				<View
					style={{
						flex: 1,
						backgroundColor: bgColor,
					}}
				>
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
									<Card className=" m-2 w-[380px] rounded-xl mb-4 pb-2 pt-6 light:border-2 light:border-zinc-300">
										<VStack>
											<Card className="mb-4 p-2 bg-zinc-200 dark:bg-zinc-800 flex rounded-xl">
												<Image
													source={{
														uri: currentProfile.photos[0],
													}}
													alt="Profile Picture"
													className="w-[360px] h-[380px] rounded-xl"
												/>
												<HStack className="justify-between p-4">
													<Text className="text-2xl">
														{currentProfile.name},{" "}
														{Math.floor(
															(Date.now() - currentProfile.dob.toDate()) /
																31536000000,
														)}
													</Text>
													<HStack className="justify-start items-center">
														{currentProfile.gender === "man" ? (
															<Ionicons
																name="male"
																size={24}
																color={bgReverseColor}
															/>
														) : currentProfile.gender === "woman" ? (
															<Ionicons
																name="female"
																size={24}
																color={bgReverseColor}
															/>
														) : (
															<Ionicons
																name="male-female"
																size={24}
																color={bgReverseColor}
															/>
														)}
														<Text className="text-lg ml-2">
															{capitalize(currentProfile.gender)}
														</Text>
													</HStack>
												</HStack>
											</Card>

											<Card className="mb-4 bg-zinc-200 dark:bg-zinc-800">
												<Text className="text-lg">
													{currentProfile.bio || "No bio available"}
												</Text>
											</Card>
											{currentProfile.photos.length > 1 && (
												<Image
													source={{
														uri: currentProfile.photos[1] || null,
													}}
													alt="Profile Picture"
													className="w-[360px] h-[380px] rounded-xl mb-4"
												/>
											)}

											{currentProfile.photos.length > 2 && (
												<Image
													source={{
														uri: currentProfile.photos[2] || null,
													}}
													alt="Profile Picture"
													className="w-[360px] h-[380px] rounded-xl"
												/>
											)}
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
				</View>
			</GestureDetector>
		</GestureHandlerRootView>
	);
}
