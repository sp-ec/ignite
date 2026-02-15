import { db } from "@/FirebaseConfig";
import DateSelector from "@/components/custom/date-selector";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { ChevronDownIcon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
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
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

	const router = useRouter();

	const user = getAuth().currentUser;
	const usersCollection = collection(db, "users");

	useEffect(() => {
		const auth = getAuth();
		// Listen for auth state changes
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (!currentUser) {
				// No user found, redirect immediately
				router.replace("/login");
			} else {
				// User is authenticated, now fetch their data
				try {
					const q = query(usersCollection, where("uid", "==", currentUser.uid));
					const qSnapshot = await getDocs(q);

					if (!qSnapshot.empty) {
						const userData = qSnapshot.docs[0].data();
						setName(userData.name || "");
						setBio(userData.bio || "");
						setGender(userData.gender || "");
						setPhotos(userData.photos || []);
						if (userData.dob) setDob(userData.dob);
					}
				} catch (error) {
					console.log("Error fetching user data: ", error);
				} finally {
					// Only stop loading after the fetch attempt is complete
					setLoading(false);
				}
			}
		});

		return unsubscribe;
	}, []);

	if (loading) {
		return (
			<SafeAreaView
				style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
			>
				<ActivityIndicator size="large" />
			</SafeAreaView>
		);
	}

	if (isEditing) {
		return (
			<SafeAreaView
				style={{
					flex: 1,
				}}
			>
				<VStack className="p-8">
					<Input className="mb-4 w-64">
						<InputField
							placeholder="Name"
							className="text-2xl"
							value={name}
							onChangeText={setName}
						/>
					</Input>
					<Text className="text-lg mb-2">Your Photos</Text>
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
					<DateSelector onDateChange={(newDate) => setDob(newDate)} />
					<VStack>
						<Text className="text-md">Gender</Text>
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
					<Text className="text-lg">Bio</Text>
					<Input className="h-32 pt-2 mb-4" size="md">
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
						<ButtonText className="text-zinc-200 text-md">
							Save Profile
						</ButtonText>
					</Button>
				</VStack>
			</SafeAreaView>
		);
	}
	return (
		<SafeAreaView
			style={{
				flex: 1,
			}}
		>
			<VStack className="p-8">
				<HStack className="justify-between">
					<Text className="text-2xl mb-4 w-64">{name}</Text>
					<Button
						className="bg-zinc-200 w-12 h-12 p-0 rounded-lg"
						onPress={() =>
							router.replace(
								"/(protected)/(tabs)/(profile)/(settings)/settings",
							)
						}
					>
						<Ionicons name="settings-outline" size={24} color={"#000"} />
					</Button>
				</HStack>

				<Text className="text-lg mb-2">Your Photos</Text>
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
				<VStack className="mb-4">
					<Text className="text-md mb-2">Birthdate</Text>
					<Text className="text-md">
						{capitalize(dob.month)} {dob.day}, {dob.year}
					</Text>
				</VStack>
				<VStack className="mb-4">
					<Text className="text-md mb-2">Gender</Text>
					<Text className="text-md">{capitalize(gender)}</Text>
				</VStack>
				<Text className="text-lg">Bio</Text>
				<Text className="text-md mb-8">{bio} </Text>
				<Button
					className="bg-zinc-200 mb-4"
					onPress={() => {
						// Handle edit action here
						setIsEditing(true);
					}}
				>
					<ButtonText className="text-zinc-800 text-md">
						Edit Profile
					</ButtonText>
				</Button>
			</VStack>
		</SafeAreaView>
	);
}
