import { Stack } from "expo-router";
import { Box } from "@/components/ui/box";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { useState } from "react";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
	const [colorMode, setColorMode] = useState<"light" | "dark">("light");

	return (
		<GluestackUIProvider mode={colorMode}>
			<Box className="flex-1 bg-zinc-100 dark:bg-zinc-900">
				<Stack
					screenOptions={{
						headerShown: false,
					}}
				>
					<Stack.Screen name="login" options={{ headerShown: false }} />
					<Stack.Screen name="(protected)" options={{ headerShown: false }} />
				</Stack>
			</Box>
		</GluestackUIProvider>
	);
}
