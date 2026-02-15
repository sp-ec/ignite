import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, FlatList } from "react-native";
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
import { useFocusEffect, useRouter } from "expo-router";
import { useTheme } from "@/ThemeContext";
import { useCallback, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
	collection,
	doc,
	getDocs,
	getDoc,
	query,
	where,
} from "firebase/firestore";
import { db } from "@/FirebaseConfig";

export default function IndexScreen() {
	const [matches, setMatches] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const { colorMode } = useTheme();

	const isDark = colorMode === "dark";

	// Theme Colors
	const bgColor = isDark ? "#18181B" : "#F5F5F5";

	const router = useRouter();

	const user = getAuth().currentUser;
	const usersCollection = collection(db, "users");
	const matchesCollection = collection(db, "matches");

	const fetchFullMatchDetails = async (
		matchIds: string[],
		currentUid: string,
	) => {
		const fetchPromises = matchIds.map(async (id) => {
			const matchRef = doc(db, "matches", id);
			const matchSnap = await getDoc(matchRef);

			if (matchSnap.exists()) {
				const data = matchSnap.data();
				const otherUserUid = data.users.find(
					(uid: string) => uid !== currentUid,
				);

				let otherUserName = "Unknown User";
				let otherUserPhoto = "";

				if (otherUserUid) {
					const q = query(
						collection(db, "users"),
						where("uid", "==", otherUserUid),
					);
					const userSnap = await getDocs(q);

					if (!userSnap.empty) {
						const userData = userSnap.docs[0].data();
						otherUserName = userData.name || "Unknown";
						otherUserPhoto = userData.photos[0] || "";
					}
				}

				return {
					id: matchSnap.id,
					...data,
					displayName: otherUserName,
					displayPhoto: otherUserPhoto,
				};
			}
			return null;
		});

		const matchesData = await Promise.all(fetchPromises);
		return matchesData.filter((match) => match !== null);
	};

	useFocusEffect(
		useCallback(() => {
			const auth = getAuth();
			const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
				if (!currentUser) {
					router.replace("/login");
				} else {
					try {
						const q = query(
							usersCollection,
							where("uid", "==", currentUser.uid),
						);
						const qSnapshot = await getDocs(q);

						if (!qSnapshot.empty) {
							const currentUserDoc = qSnapshot.docs[0];
							const matchesRef = collection(
								db,
								"users",
								currentUserDoc.id,
								"matches",
							);
							const matchesSnapshot = await getDocs(matchesRef);
							const matchIds = matchesSnapshot.docs.map((doc) => doc.id.trim());

							// Pass currentUser.uid to filter out the logged-in user's name
							const fullMatches = await fetchFullMatchDetails(
								matchIds,
								currentUser.uid,
							);

							setMatches(fullMatches);
							console.log("Matches: ", fullMatches);
						}
					} catch (error) {
						console.error("Error: ", error);
					} finally {
						setLoading(false);
					}
				}
			});
			return unsubscribe;
		}, []),
	);

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

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: bgColor,
			}}
		>
			<SafeAreaView
				style={{
					flex: 1,
				}}
			>
				<Card className="border-2 border-zinc-300 dark:border-zinc-900">
					<Text className="text-2xl dark:text-zinc-200">Chat</Text>
				</Card>
				<FlatList
					data={matches}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<Pressable onPress={() => router.push(`/(chat)/${item.id}`)}>
							<Card>
								<Box className="flex-row rounded-xl">
									<Avatar className="mr-4">
										<AvatarFallbackText>{item.displayName}</AvatarFallbackText>
										<AvatarImage
											source={{
												uri:
													item.displayPhoto ||
													"https://via.placeholder.com/150",
											}}
										/>
									</Avatar>
									<VStack>
										<Text className="text-md mb-1 dark:text-zinc-200">
											{item.displayName || "Unknown User"}
										</Text>
										<Text className="sm dark:text-zinc-200 truncate text-overflow-ellipsis line-clamp-1 max-w-64">
											{typeof item.lastMessage === "object" &&
											item.lastMessage !== null
												? item.lastMessage.text
												: item.lastMessage || "No messages yet."}
										</Text>
									</VStack>
								</Box>
							</Card>
						</Pressable>
					)}
					contentContainerStyle={{ padding: 16 }}
					showsVerticalScrollIndicator={false}
				/>
			</SafeAreaView>
		</View>
	);
}
