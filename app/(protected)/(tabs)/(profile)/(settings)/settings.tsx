import { auth, db } from "@/FirebaseConfig";
import { useTheme } from "@/ThemeContext";
import {
	Alert,
	AlertIcon,
	AlertText,
} from "@/components/ui/alert";
import { Button, ButtonText } from "@/components/ui/button";
import {
	Checkbox,
	CheckboxGroup,
	CheckboxIcon,
	CheckboxIndicator,
	CheckboxLabel,
} from "@/components/ui/checkbox";
import { HStack } from "@/components/ui/hstack";
import { CheckIcon, InfoIcon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { Ionicons } from "@expo/vector-icons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import {
	collection,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [ageRange, setAgeRange] = useState<[number, number]>([18, 60]);
	const [genderPref, setGenderPref] = useState<string[]>([]);
	const { toggleColorMode, colorMode } = useTheme();

	const router = useRouter();

	const user = getAuth().currentUser;
	const usersCollection = collection(db, "users");

	const isDark = colorMode === "dark";

	// Theme Colors
	const bgColor = isDark ? "#18181B" : "#F5F5F5";

	getAuth().onAuthStateChanged((user) => {
		if (!user) {
			router.replace("/");
		}
	});

	useEffect(() => {
		const fetchPreferences = async () => {
			const currentUser = getAuth().currentUser;
			if (!currentUser) return;

			try {
				const q = query(usersCollection, where("uid", "==", currentUser.uid));
				const qSnapshot = await getDocs(q);

				if (!qSnapshot.empty) {
					const data = qSnapshot.docs[0].data();

					setAgeRange(data.ageRange);
					setGenderPref(data.genderPreference);
				}
			} catch (error) {
				console.log("Error fetching preferences: ", error);
			}
		};

		fetchPreferences();
	}, []);

	const updateGenderPref = (gender: string) => {
		setGenderPref((prev) =>
			prev.includes(gender)
				? prev.filter((g) => g !== gender)
				: [...prev, gender],
		);
	};

	const updateDB = async () => {
		if (!user) return;

		const userRef = doc(db, "users", user.uid);
		try {
			setErrorMessage(null)
			await updateDoc(userRef, {
				ageRange,
				genderPreference: genderPref,
			});
			//alert("Preferences Saved");
			setErrorMessage("Preferences Saved!");
		} catch (error) {
			//alert("Failed to save preferences");
			setErrorMessage("Failed to save preference: Try again or wait 5 minutes.");
		}
	};

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
				<VStack className="p-8">
					<HStack className="justify-start items-center mb-4">
						<Button
							className="text-md bg-zinc-700 dark:bg-zinc-200 mb-2 w-12 h-12 p-0 rounded-lg"
							onPress={() => {
								router.navigate("/profile");
							}}
						>
							<ButtonText className="text-md">
								<Ionicons name="arrow-back-outline" size={24} color={bgColor} />
							</ButtonText>
						</Button>
						<Text className="text-2xl ml-6 mb-2 dark:text-zinc-200">
							Settings
						</Text>
					</HStack>
					{errorMessage && (
						<Alert
							action="muted"
							variant="outline"
							className="w-64 mb-6"
						>
							<AlertIcon as={InfoIcon} />
							<AlertText>{errorMessage}</AlertText>
						</Alert>
					)}

					<Text className="text-xl mb-4 dark:text-zinc-200">General</Text>
					<Button
						onPress={toggleColorMode}
						className="mb-4 bg-zinc-700 dark:bg-zinc-200"
					>
						<ButtonText>
							Switch to {colorMode === "light" ? "dark" : "light"} mode
						</ButtonText>
					</Button>
					<Text className="text-xl mb-4 dark:text-zinc-200">
						Match Preferences
					</Text>
					<Text className="text-md mb-4 dark:text-zinc-200">
						Age Range: {ageRange[0]} - {ageRange[1]}
					</Text>
					<MultiSlider
						values={ageRange}
						onValuesChange={(values) => setAgeRange(values as [number, number])}
						min={18}
						max={100}
						step={1}
						sliderLength={280}
						selectedStyle={{ backgroundColor: "#9333EA" }}
						unselectedStyle={{ backgroundColor: "#E5E7EB" }}
						markerStyle={{
							backgroundColor: "#9333EA",
							height: 24,
							width: 24,
							borderRadius: 12,
							borderWidth: 0,
						}}
						pressedMarkerStyle={{
							height: 28,
							width: 28,
							borderRadius: 14,
							backgroundColor: "#9333EA",
							borderWidth: 0,
						}}
						containerStyle={{ height: 40 }}
					/>

					<Text className="text-lg mb-4 dark:text-zinc-200">
						Gender Preferences
					</Text>

					<CheckboxGroup
						value={genderPref}
						onChange={(keys) => {
							setGenderPref(keys);
						}}
					>
						<VStack space="md">
							{["man", "woman", "nonbinary", "other"].map((gender) => (
								<Checkbox
									key={gender}
									value={gender}
									size="lg"
									aria-label={gender}
								>
									<CheckboxIndicator>
										<CheckboxIcon as={CheckIcon} />
									</CheckboxIndicator>
									<CheckboxLabel className="dark:text-zinc-200">
										{gender.charAt(0).toUpperCase() + gender.slice(1)}
									</CheckboxLabel>
								</Checkbox>
							))}
						</VStack>
					</CheckboxGroup>

					<Button className="bg-purple-500 mt-4 mb-4" onPress={updateDB}>
						<ButtonText className="text-zinc-200 text-md" onPress={updateDB}>
							Save Preferences
						</ButtonText>
					</Button>
					<Button className="bg-rose-500 mb-2 " onPress={() => auth.signOut()}>
						<ButtonText className="text-zinc-200 text-md">Log Out</ButtonText>
					</Button>
				</VStack>
			</SafeAreaView>
		</View>
	);
}
