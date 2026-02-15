import { useLocalSearchParams } from "expo-router";
import { useState, useLayoutEffect, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat"; // Standard chat UI lib
import {
	collection,
	addDoc,
	getDoc,
	getDocs,
	orderBy,
	query,
	where,
	onSnapshot,
	serverTimestamp,
	doc,
	updateDoc,
} from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import {
	Avatar,
	AvatarFallbackText,
	AvatarImage,
} from "@/components/ui/avatar";
import { getAuth } from "firebase/auth";
import { HStack } from "@/components/ui/hstack";
import { useRouter } from "expo-router";

export interface IMessage {
	_id: string | number;
	text: string;
	createdAt: Date | number;
	user: {
		_id: string | number;
		name: string;
		avatar?: string;
	};
}
import { db, auth } from "@/FirebaseConfig";
import { ActivityIndicator, View } from "react-native";
import { useTheme } from "@/ThemeContext";
import { Button, ButtonText } from "@/components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import {
	Accordion,
	AccordionItem,
	AccordionHeader,
	AccordionTrigger,
	AccordionTitleText,
	AccordionContent,
	AccordionContentText,
	AccordionIcon,
} from "@/components/ui/accordion";
import { ChevronDownIcon } from "@/components/ui/icon";
import { ChevronUpIcon } from "@/components/ui/icon";

export const getChatPartnerProfile = async (
	chatId: string,
	currentUserId: string,
) => {
	try {
		// 1. Fetch the Match Document to find out who is in the chat
		const matchRef = doc(db, "matches", chatId);
		const matchSnap = await getDoc(matchRef);

		if (!matchSnap.exists()) return null;

		const matchData = matchSnap.data();

		// 2. Find the UID that is NOT the current user
		const otherUserUid = matchData.users?.find(
			(uid: string) => uid !== currentUserId,
		);

		if (!otherUserUid) return null;

		// 3. Query the Users collection for that specific UID
		const q = query(collection(db, "users"), where("uid", "==", otherUserUid));
		const userSnap = await getDocs(q);

		if (!userSnap.empty) {
			const userData = userSnap.docs[0].data();
			return {
				uid: otherUserUid,
				name: userData.name || "Unknown User",
				photo: userData.photos?.[0] || null,
			};
		}

		return null;
	} catch (error) {
		console.error("Error fetching chat partner:", error);
		return null;
	}
};

export default function ChatRoom() {
	const { id } = useLocalSearchParams();
	const [loading, setLoading] = useState(true);
	const [partner, setPartner] = useState<{
		uid: string;
		name: string;
		photo: string | null;
	} | null>(null);
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [isExpanded, setIsExpanded] = useState(false);

	const { colorMode } = useTheme();
	const isDark = colorMode === "dark";

	const router = useRouter();

	// Theme Colors
	const bgColor = isDark ? "#18181B" : "#F5F5F5";

	useLayoutEffect(() => {
		const q = query(
			collection(db, "matches", id as string, "messages"),
			orderBy("createdAt", "desc"),
		);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			return setMessages(
				snapshot.docs.map((doc) => ({
					_id: doc.id,
					createdAt: doc.data().createdAt.toDate(),
					text: doc.data().text,
					user: doc.data().user,
				})),
			);
		});
		return unsubscribe;
	}, [id]);

	useEffect(() => {
		const loadPartnerInfo = async () => {
			try {
				const auth = getAuth();
				if (!auth.currentUser || !id) return;

				const profile = await getChatPartnerProfile(
					id as string,
					auth.currentUser.uid,
				);

				if (profile) {
					setPartner(profile);
					console.log("Partner: ", partner);
				}
			} catch (error) {
				console.log("Error loading partner info: ", error);
				alert("Failed to load chat partner info");
			} finally {
				setLoading(false);
			}
		};

		loadPartnerInfo();
	}, []);

	const onSend = useCallback(
		(messages: IMessage[] = []) => {
			const { _id, createdAt, text, user } = messages[0];

			// 1. Add to messages subcollection
			addDoc(collection(db, "matches", id as string, "messages"), {
				_id,
				createdAt,
				text,
				user,
			});

			// 2. Update parent doc for the "Last Message" preview
			updateDoc(doc(db, "matches", id as string), {
				lastMessage: { text, createdAt: serverTimestamp() },
			});

			console.log("Partner: ", partner);
		},
		[id],
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
					<HStack className="flex justify-between items-center">
						<HStack className="justify-start items-center">
							<Avatar className="mr-4">
								<AvatarFallbackText>{partner?.name}</AvatarFallbackText>
								<AvatarImage
									source={{
										uri: partner?.photo || "https://via.placeholder.com/150",
									}}
								/>
							</Avatar>
							<Text className="text-2xl dark:text-zinc-200">
								{partner?.name}
							</Text>
						</HStack>

						<Button
							className="text-md bg-zinc-700 dark:bg-zinc-200 w-12 h-12 p-0 rounded-lg"
							onPress={() => {
								router.navigate("/chat");
							}}
						>
							<ButtonText className="text-md">
								<Ionicons name="arrow-back-outline" size={24} color={bgColor} />
							</ButtonText>
						</Button>
					</HStack>
				</Card>
				<Accordion
					className="w-[90%] m-5 border border-outline-300"
					type="multiple"
				>
					<AccordionItem value="a" className="border-b border-outline-300">
						<AccordionHeader className="bg-background-0">
							<AccordionTrigger>
								{({ isExpanded }: { isExpanded: boolean }) => {
									return (
										<>
											<AccordionTitleText>Ignite AI</AccordionTitleText>
											{isExpanded ? (
												<AccordionIcon as={ChevronUpIcon} />
											) : (
												<AccordionIcon as={ChevronDownIcon} />
											)}
										</>
									);
								}}
							</AccordionTrigger>
						</AccordionHeader>
						<AccordionContent className="mt-0 pt-2 bg-background-50">
							<Button></Button>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
				<View className="flex-1 -mb-9">
					<GiftedChat
						renderAvatar={() => (
							<Avatar className="mb-2 ml-1 mr-1" size="sm">
								<AvatarFallbackText>{partner?.name}</AvatarFallbackText>
								<AvatarImage
									source={{
										uri: partner?.photo || "https://via.placeholder.com/150",
									}}
								/>
							</Avatar>
						)}
						keyboardAvoidingViewProps={{ keyboardVerticalOffset: 130 }}
						renderBubble={(props) => {
							const isCurrentUser =
								props.currentMessage.user._id === auth.currentUser?.uid;
							return (
								<Card
									className={`${
										isCurrentUser
											? "bg-purple-500 text-white"
											: "bg-zinc-200 dark:bg-zinc-200 text-black dark:text-white"
									} rounded-lg p-3 max-w-[80%]`}
								>
									<Text
										className={`${isCurrentUser ? "text-zinc-200" : "text-zinc-900"}`}
									>
										{props.currentMessage.text}
									</Text>
								</Card>
							);
						}}
						messages={messages}
						onSend={(messages) => onSend(messages)}
						user={{
							_id: auth.currentUser?.uid ?? "",
							name: auth.currentUser?.displayName ?? "",
						}}
					/>
				</View>
			</SafeAreaView>
		</View>
	);
}
