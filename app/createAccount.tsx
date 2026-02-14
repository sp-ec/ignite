import { Text, View } from "react-native";
import { Link } from "expo-router";

import {
  Button,
  ButtonText,
  ButtonSpinner,
  ButtonIcon,
  ButtonGroup,
} from "@/components/ui/button";
import { AuthContext } from "@/utils/authContext";
import { VStack } from "@/components/ui/vstack";
import { Input, InputField } from "@/components/ui/input";

export default function createAccount() {
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
          <InputField placeholder="Email" className="text-black" />
        </Input>
        <Input className="mb-2 text-zinc-900">
          <InputField placeholder="Password" className="text-black" />
        </Input>
        <Button className="bg-purple-500">
          <ButtonText className="text-zinc-200 text-md">
            Create Account
          </ButtonText>
        </Button>
      </VStack>
    </View>
  );
}
