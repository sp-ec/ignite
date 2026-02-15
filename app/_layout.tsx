import { Stack } from "expo-router";
import { Box } from "@/components/ui/box";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
	const [colorMode, setColorMode] = useState<"light" | "dark">("light");

	const [loaded, error] = useFonts({
		...Ionicons.font,
	});

	useEffect(() => {
		if (loaded || error) {
			SplashScreen.hideAsync();
		}
	}, [loaded, error]);

	if (!loaded && !error) {
		return null;
	}

	return (
		<GluestackUIProvider mode={colorMode}>
			<GestureHandlerRootView>
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
			</GestureHandlerRootView>
		</GluestackUIProvider>
	);
}
