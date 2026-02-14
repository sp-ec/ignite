import { Text, View } from "react-native";
import { Link } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "@/utils/authContext";
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
  const authContext = useContext(AuthContext);

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
        <Button className="bg-purple-500 mb-2" onPress={authContext.logIn}>
          Log in
        </Button>
        <Button
          className="text-zinc-900 text-sm bg-zinc-200"
          onPress={authContext.logIn}
        >
          Register
        </Button>
      </VStack>
    </View>
  );
}
