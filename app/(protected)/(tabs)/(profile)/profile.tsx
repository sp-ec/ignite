import { db } from "@/FirebaseConfig";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { ChevronDownIcon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { View } from "react-native";
import { Input, InputField } from "@/components/ui/input";
import {
	Select,
	SelectBackdrop,
	SelectContent,
	SelectDragIndicator,
	SelectDragIndicatorWrapper,
	SelectIcon,
	SelectInput,
	SelectItem,
	SelectPortal,
	SelectTrigger,
} from "@/components/ui/select";
import { VStack } from "@/components/ui/vstack";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
	collection,
	doc,
	getDocs,
	query,
	setDoc,
	where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/ThemeContext";
import { Card } from "@/components/ui/card";

const onDateChange = (date: { month: string; day: string; year: string }) => {
	console.log("Selected date:", date);
	// You can also update state here if you want to keep the selected date in this component
};

const capitalize = (str: string) => {
	if (!str) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
};

export default function IndexScreen() {
	const [isEditing, setIsEditing] = useState(false);
	const [name, setName] = useState("");
	const [photos, setPhotos] = useState<string[]>([]);
	const [gender, setGender] = useState("");
	const [bio, setBio] = useState("");
	const [dob, setDob] = useState({ month: "Jan", day: "1", year: "2000" });
	const [loading, setLoading] = useState(true);
	const [age, setAge] = useState("");

	const router = useRouter();

	const user = getAuth().currentUser;
	const usersCollection = collection(db, "users");

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (!currentUser) {
				router.replace("/login");
			} else {
				try {
					const q = query(usersCollection, where("uid", "==", currentUser.uid));
					const qSnapshot = await getDocs(q);

					if (!qSnapshot.empty) {
						const userData = qSnapshot.docs[0].data();
						setName(userData.name || "");
						setBio(userData.bio || "");
						setGender(userData.gender || "");
						setPhotos(userData.photos || []);

						let dateObj = userData.dob.toDate();

						const monthNames = [
							"Jan",
							"Feb",
							"Mar",
							"Apr",
							"May",
							"Jun",
							"Jul",
							"Aug",
							"Sep",
							"Oct",
							"Nov",
							"Dec",
						];

						setDob({
							month: monthNames[dateObj.getMonth()],
							day: dateObj.getDate().toString(),
							year: dateObj.getFullYear().toString(),
						});

						const today = new Date();

						let age = today.getFullYear() - dateObj.getFullYear();
						const diff = today.getMonth() - dateObj.getMonth();

						if (
							diff < 0 ||
							(diff === 0 && today.getDate() < dateObj.getDate())
						) {
							age--;
						}

						setAge(age.toString());
					}
				} catch (error) {
					console.log("Error fetching user data: ", error);
				} finally {
					setLoading(false);
				}
			}
		});

		return unsubscribe;
	}, []);

	const updateDB = async () => {
		if (!user) return;

		try {
			const userDocRef = doc(db, "users", user.uid);

			await setDoc(
				userDocRef,
				{
					name,
					bio,
					gender,
					photos,
				},
				{ merge: true },
			);

			setIsEditing(false);
		} catch (error) {
			alert("Error saving profile: " + error);
		}
	};

	const { colorMode } = useTheme();
	const isDark = colorMode === "dark";

	// Theme Colors
	const bgColor = isDark ? "#18181B" : "#F5F5F5";

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

	if (isEditing) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: bgColor,
				}}
			>
				<SafeAreaView
					style={{
						flex: 1,
					}}
				>
					<ScrollView>
						<VStack className="p-8">
							<Input className="mb-4 w-64">
								<InputField
									placeholder="Name"
									className="text-2xl"
									value={name}
									onChangeText={setName}
								/>
							</Input>
							<Text className="text-lg mb-2 dark:text-zinc-200">
								Your Photos
							</Text>
							<Button
								className="bg-zinc-200 mb-4"
								onPress={async () => {
									// Request permission (Required for iOS)
									const permissionResult =
										await ImagePicker.requestMediaLibraryPermissionsAsync();

									if (permissionResult.granted === false) {
										alert("Permission to access camera roll is required!");
										return;
									}

									try {
										const result = await ImagePicker.launchImageLibraryAsync({
											mediaTypes: ["images"], // Use ImagePicker.MediaTypeOptions.Images in older versions
											allowsMultipleSelection: true,
											selectionLimit: 3,
											quality: 1,
										});

										if (!result.canceled) {
											const uris = result.assets.map((asset) => asset.uri);
											setPhotos(uris);
											console.log("Selected URIs:", uris);
										}
									} catch (error) {
										console.log("Picker Error: ", error);
									}
								}}
							>
								<ButtonText className="text-zinc-900 text-md">
									Choose Photos
								</ButtonText>
							</Button>
							<HStack space="md" className="mb-2 justify-around">
								{photos.map((uri, index) => (
									<Box key={index} className="relative">
										<Image
											source={{ uri: uri }}
											alt={`Profile photo ${index + 1}`}
											className="rounded-lg w-28 h-48"
										/>
									</Box>
								))}
							</HStack>
							<VStack className="mb-4">
								<Text className="text-lg dark:text-zinc-200">Gender</Text>
								<Select
									selectedValue={capitalize(gender)}
									onValueChange={setGender}
								>
									<SelectTrigger>
										<SelectInput placeholder="Select Gender" />
										<SelectIcon as={ChevronDownIcon} />
									</SelectTrigger>
									<SelectPortal>
										<SelectBackdrop />
										<SelectContent className="text-zinc-900">
											<SelectDragIndicatorWrapper>
												<SelectDragIndicator />
											</SelectDragIndicatorWrapper>
											<SelectItem label="Man" value="man" />
											<SelectItem label="Woman" value="woman" />
											<SelectItem label="Non-Binary" value="non-binary" />
											<SelectItem label="Other" value="other" />
										</SelectContent>
									</SelectPortal>
								</Select>
							</VStack>
							<Text className="text-lg dark:text-zinc-200">Bio</Text>
							<Input className="h-32 pt-2 mb-6" size="md">
								<InputField
									multiline={true}
									placeholder="Write something about yourself..."
									value={bio}
									onChangeText={setBio}
									textAlignVertical="top" // Keeps text at top of box
								/>
							</Input>
							<Button
								className="bg-purple-500"
								onPress={() => {
									// Handle save action here
									setIsEditing(false);
									setName(name);
									setBio(bio);
									setGender(gender);
									setDob(dob);
									setPhotos(photos);
								}}
							>
								<ButtonText
									className="text-zinc-200 text-md"
									onPress={updateDB}
								>
									Save Profile
								</ButtonText>
							</Button>
						</VStack>
					</ScrollView>
				</SafeAreaView>
			</View>
		);
	}
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: bgColor,
			}}
		>
			<SafeAreaView
				style={{
					flex: 1,
				}}
			>
				<VStack className="p-8">
					<HStack className="justify-between">
						<Text className="text-2xl mb-4 w-64 dark:text-zinc-200">
							{name + ", " + age}
						</Text>
						<Button
							className="dark:bg-zinc-300 w-12 h-12 p-0 rounded-lg"
							onPress={() =>
								router.replace(
									"/(protected)/(tabs)/(profile)/(settings)/settings",
								)
							}
						>
							<Ionicons name="settings-outline" size={24} color={bgColor} />
						</Button>
					</HStack>

					<Text className="text-lg mb-2 dark:text-zinc-200">Your Photos</Text>
					<HStack space="md" className="mb-8 justify-around">
						{photos.map((uri, index) => (
							<Box key={index} className="relative">
								<Image
									source={{ uri: uri }}
									alt={`Profile photo ${index + 1}`}
									className="rounded-lg w-28 h-48"
								/>
							</Box>
						))}
					</HStack>
					<Card className="mb-4">
						<VStack>
							<Text className="text-lg mb-2 dark:text-zinc-200">Gender</Text>
							<Text className="text-md dark:text-zinc-200">
								{capitalize(gender)}
							</Text>
						</VStack>
					</Card>

					<Card className="mb-16">
						<Text className="text-lg dark:text-zinc-200 mb-2">Bio</Text>
						<Text className="text-md mb-8 dark:text-zinc-200">{bio} </Text>
					</Card>
					<Button
						className="bg-zinc-700 dark:bg-zinc-300 mb-4"
						onPress={() => {
							// Handle edit action here
							setIsEditing(true);
						}}
					>
						<ButtonText className="text-zinc-200 dark:text-zinc-800 text-md">
							Edit Profile
						</ButtonText>
					</Button>
				</VStack>
			</SafeAreaView>
		</View>
	);
}
