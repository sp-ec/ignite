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
			<VStack>
				<Input className="mb-2 text-zinc-900">
					<InputField
						placeholder="Email"
						className="text-black"
						value={email}
						onChangeText={setEmail}
					/>
				</Input>
				<Input className="mb-2 text-zinc-900">
					<InputField
						placeholder="Password"
						className="text-black"
						value={password}
						onChangeText={setPassword}
					/>
				</Input>
				<Button className="bg-purple-500 mb-2 " onPress={signIn}>
					<ButtonText className="text-zinc-200 text-md">Log in</ButtonText>
				</Button>

				<Button
					className="text-md bg-zinc-200 mb-2"
					onPress={() => {
						router.navigate("/createAccount");
					}}
				>
					<ButtonText className="text-zinc-900 text-md">
						Create Account
					</ButtonText>
				</Button>
			</VStack>
		</View>
	);
}
