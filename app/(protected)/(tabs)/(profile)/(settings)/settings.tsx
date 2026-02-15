import { auth } from "@/FirebaseConfig";
import { Button, ButtonText } from "@/components/ui/button";
import {
	Checkbox,
	CheckboxIcon,
	CheckboxIndicator,
	CheckboxLabel,
} from "@/components/ui/checkbox";
import { HStack } from "@/components/ui/hstack";
import { CheckIcon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { Ionicons } from "@expo/vector-icons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
	const [ageRange, setAgeRange] = useState<[number, number]>([18, 60]);

	const router = useRouter();

	getAuth().onAuthStateChanged((user) => {
		if (!user) {
			router.replace('/');
		}
	});

	return (
		<SafeAreaView
			style={{
				flex: 1,
			}}
		>
			<VStack className="p-8">
				<HStack className="justify-start items-center mb-4">
					<Button
						className="text-md bg-zinc-200 mb-2 w-12 h-12 p-0 rounded-lg"
						onPress={() => {
							router.navigate("/profile");
						}}
					>
						<ButtonText className="text-zinc-900 text-md">
							<Ionicons name="arrow-back-outline" size={24} color={"#000"} />
						</ButtonText>
					</Button>
					<Text className="text-2xl ml-6 mb-2">Settings</Text>
				</HStack>
				<Text className="text-xl mb-4">Match Preferences</Text>
				<Text className="text-md mb-4">
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

				<Text className="text-md mb-4">Gender Preferences</Text>
				<Checkbox isDisabled={false} isInvalid={false} size="md" value="men">
					<CheckboxIndicator>
						<CheckboxIcon as={CheckIcon} />
					</CheckboxIndicator>
					<CheckboxLabel>Men</CheckboxLabel>
				</Checkbox>
				<Checkbox isDisabled={false} isInvalid={false} size="md" value="women">
					<CheckboxIndicator>
						<CheckboxIcon as={CheckIcon} />
					</CheckboxIndicator>
					<CheckboxLabel>Women</CheckboxLabel>
				</Checkbox>
				<Checkbox
					isDisabled={false}
					isInvalid={false}
					size="md"
					value="non-binary"
				>
					<CheckboxIndicator>
						<CheckboxIcon as={CheckIcon} />
					</CheckboxIndicator>
					<CheckboxLabel>Non-Binary</CheckboxLabel>
				</Checkbox>
				<Checkbox
					isDisabled={false}
					isInvalid={false}
					size="md"
					value="other"
					className="mb-8"
				>
					<CheckboxIndicator>
						<CheckboxIcon as={CheckIcon} />
					</CheckboxIndicator>
					<CheckboxLabel>Other</CheckboxLabel>
				</Checkbox>
				<Button className="bg-rose-500 mb-2 " onPress={() => auth.signOut()}>
					<ButtonText className="text-zinc-200 text-md">Log Out</ButtonText>
				</Button>
			</VStack>
		</SafeAreaView>
	);
}
