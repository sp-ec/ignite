import {
  Button,
  ButtonText
} from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { Link, router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { View } from "react-native";
import { auth } from "../FirebaseConfig";


export default function createAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      <VStack>
        <Button className="text-md bg-zinc-200 mb-2">
          <ButtonText className="text-zinc-900 text-md">
            <Link href="/login">Back to Login</Link>
          </ButtonText>
        </Button>
        <Input className="mb-2 text-zinc-900">
          <InputField placeholder="Email" className="text-black" value={email} onChangeText={setEmail}/>
        </Input>
        <Input className="mb-2 text-zinc-900">
          <InputField placeholder="Password" className="text-black" value={password} onChangeText={setPassword}/>
        </Input>
        <Button className="bg-purple-500" onPress={createAccount}>
          <ButtonText className="text-zinc-200 text-md">
            Create Account
          </ButtonText>
        </Button>
      </VStack>
    </View>
  );
}
