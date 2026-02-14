import { VStack } from "@/components/ui/vstack";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
	return (
		<SafeAreaView
			style={{
				flex: 1,
			}}
		>
			<VStack className="p-8">
				<Text className="text-2xl mb-4">Settings</Text>
			</VStack>
		</SafeAreaView>
	);
}
