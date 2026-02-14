import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Pressable } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Link, router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { View, Platform } from "react-native";
import { auth } from "../FirebaseConfig";
import { HStack } from "@/components/ui/hstack";

export default function createAccount() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [bio, setBio] = useState("");
	const [dob, setDob] = useState(new Date());
	const [showDatePicker, setShowDatePicker] = useState(false);

	const handleDateChange = (event: any, selectedDate?: Date) => {
		if (Platform.OS === "android") {
			setShowDatePicker(false);
		}
		if (selectedDate) {
			setDob(selectedDate);
		}
	};

	const createAccount = async () => {
		try {
			const user = await createUserWithEmailAndPassword(auth, email, password);
			if (user) {
				router.replace("../(protected)/(tabs)/(swipe)/swipe.tsx"); // FIXME: send to profile
			}
		} catch (error: any) {
			console.log(error);
			alert("Sign in failed: " + error.message);
		}
	};

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<VStack className="">
				<Button className="text-md bg-zinc-200 mb-2">
					<ButtonText className="text-zinc-900 text-md">
						<Link href="/login">Back to Login</Link>
					</ButtonText>
				</Button>
				<Input className="mb-2">
					<InputField
						placeholder="Email"
						className=""
						value={email}
						onChangeText={setEmail}
					/>
				</Input>
				<Input className="mb-2">
					<InputField
						placeholder="Password"
						className=""
						value={password}
						onChangeText={setPassword}
					/>
				</Input>
				<Input className="mb-2">
					<InputField
						placeholder="Name"
						className=""
						value={name}
						onChangeText={setName}
					/>
				</Input>

				<Textarea
					size="md"
					isReadOnly={false}
					isInvalid={false}
					isDisabled={false}
					className="w-64 mb-2"
				>
					<TextareaInput
						className="text-zinc-900"
						placeholder="Bio"
						value={bio}
						onChangeText={setBio}
					/>
				</Textarea>
				<HStack className="mb-2"></HStack>
				<Button className="bg-purple-600" onPress={createAccount}>
					<ButtonText className="text-zinc-200 text-md">
						Create Account
					</ButtonText>
				</Button>
			</VStack>
		</View>
	);
}
