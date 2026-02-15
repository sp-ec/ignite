import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { router, useRouter } from "expo-router";
import {
	getAuth,
	onAuthStateChanged,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { useState, useEffect } from "react";
import { ActivityIndicator, SafeAreaView, View } from "react-native";
import { auth } from "../FirebaseConfig";
import { Text } from "@/components/ui/text";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const auth = getAuth();
		// Listen for auth state changes
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser) {
				// user found, immediately bring them to swipe
				router.replace("/swipe");
			}
			setLoading(false);
		});

		return unsubscribe;
	}, []);

	const signIn = async () => {
		try {
			const user = await signInWithEmailAndPassword(auth, email, password);
			if (user) {
				router.replace("/swipe");
			}
		} catch (error: any) {
			console.log(error);
			alert("Sign in failed: " + error.message);
		}
	};

	if (loading) {
		return (
			<SafeAreaView
				style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
			>
				<ActivityIndicator size="large" color="#AD46FF" />
			</SafeAreaView>
		);
	}

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Text className="text-3xl font-extrabold mb-2">Dating App</Text>
			<Text className="mb-32 ">Making connections easier.</Text>
			<VStack className="w-64">
				<Input className="mb-4 text-zinc-900" size="xl">
					<InputField
						placeholder="Email"
						className="text-black"
						value={email}
						onChangeText={setEmail}
						size="xl"
					/>
				</Input>
				<Input className="mb-4 text-zinc-900" size="xl">
					<InputField
						placeholder="Password"
						className="text-black"
						value={password}
						onChangeText={setPassword}
						size="xl"
					/>
				</Input>
				<Button className="bg-purple-600 mb-4 " size="xl" onPress={signIn}>
					<ButtonText className="text-zinc-200 text-lg">Log in</ButtonText>
				</Button>

				<Button
					className="text-lg bg-zinc-200 mb-4"
					onPress={() => {
						router.navigate("/createAccount");
					}}
					size="xl"
				>
					<ButtonText className="text-zinc-900 text-lg">
						Create Account
					</ButtonText>
				</Button>
			</VStack>
		</View>
	);
}
