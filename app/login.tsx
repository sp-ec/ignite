import { Text, View } from "react-native";
import { Link } from "expo-router";
import { useContext } from "react";
import {
  Button,
  ButtonText,
  ButtonSpinner,
  ButtonIcon,
  ButtonGroup,
} from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Input, InputField } from "@/components/ui/input";

export default function Login() {
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
          <InputField placeholder="Email" className="text-black" />
        </Input>
        <Input className="mb-2 text-zinc-900">
          <InputField placeholder="Password" className="text-black" />
        </Input>
        <Button className="bg-purple-500 mb-2 ">
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
