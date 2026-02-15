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
import { useTheme } from "@/ThemeContext";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	const { colorMode } = useTheme();
	const isDark = colorMode === "dark";

	// Theme Colors
	const bgColor = isDark ? "#18181B" : "#F5F5F5";

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
		console.log(process.env.OPENAI_API_KEY);
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
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: bgColor,
			}}
		>
			<Text className="text-3xl font-extrabold mb-2 text-purple-500">
				Ignite
			</Text>
			<Text className="mb-32 ">Making connections easier.</Text>
			<VStack className="w-64">
				<Input className="mb-4 text-zinc-900 dark:text-zinc-200" size="xl">
					<InputField
						placeholder="Email"
						className="text-zinc-900 dark:text-zinc-200"
						value={email}
						onChangeText={setEmail}
						size="xl"
					/>
				</Input>
				<Input className="mb-4 text-zinc-900 dark:text-zinc-200" size="xl">
					<InputField
						placeholder="Password"
						className="text-zinc-900 dark:text-zinc-200"
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
