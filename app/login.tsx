import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { Link, router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { View } from "react-native";
import { auth } from "../FirebaseConfig";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const signIn = async () => {
		try {
			const user = await signInWithEmailAndPassword(auth, email, password);
			if (user) {
				router.replace("../(protected)/(tabs)/(swipe)/swipe.tsx");
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
				<Button className="text-md bg-zinc-200 mb-2">
					<ButtonText className="text-zinc-900 text-md">
						<Link href="/createAccount">Create Account</Link>
					</ButtonText>
				</Button>
			</VStack>
		</View>
	);
}
