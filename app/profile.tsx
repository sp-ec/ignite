import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Text, View } from "react-native";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@/components/ui/select";
import { CloseIcon, Icon } from "@/components/ui/icon";

export default function IndexScreen() {
  return (
    <View>
      <VStack className="p-3 space-y-2">
        <Text className="text-2xl">Name</Text>
        <Text className="text-lg">Your Photos</Text>
        <HStack className="justify-around">
          <Image
            source={{
              uri: "https://plus.unsplash.com/premium_photo-1675721844807-a3760e14353b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }}
            size="lg"
            className="min-h-[200px] max-h-[200px] min-w-[100px] max-w-[100px]"
          />
          <Image
            source={{
              uri: "https://plus.unsplash.com/premium_photo-1675721844807-a3760e14353b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }}
            size="lg"
            className="min-h-[200px] max-h-[200px] min-w-[100px] max-w-[100px]"
          />
          <Image
            source={{
              uri: "https://plus.unsplash.com/premium_photo-1675721844807-a3760e14353b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }}
            size="lg"
            className="min-h-[200px] max-h-[200px] min-w-[100px] max-w-[100px]"
          />
        </HStack>
        <HStack className="space-x-10 justify-around">
          <Text className="text-lg">Birthday</Text>
          <VStack>
            <Text className="text-lg">Gender</Text>
            <Select>
              <SelectTrigger>
                <SelectInput />
                <SelectIcon as={CloseIcon} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent className="text-zinc-900">
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectItem label="Man" value="man" />
                  <SelectItem label="Woman" value="woman" />
                  <SelectItem label="Non-Binary" value="non-binary" />
                  <SelectItem label="Other" value="other" />
                </SelectContent>
              </SelectPortal>
            </Select>
          </VStack>
        </HStack>
        <Text className="text-lg">Bio</Text>
        <Text className="text-md">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.{" "}
        </Text>
      </VStack>
    </View>
  );
}
