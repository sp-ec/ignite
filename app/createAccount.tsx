import { Text, View } from "react-native";
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
        <Input className="mb-2 text-zinc-900">
          <InputField placeholder="Email" className="text-black" />
        </Input>
        <Input className="mb-2 text-zinc-900">
          <InputField placeholder="Password" className="text-black" />
        </Input>
        <Button className="text-zinc-900 text-sm bg-zinc-200">Register</Button>
      </VStack>
    </View>
  );
}
