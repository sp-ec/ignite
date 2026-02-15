import { Stack } from "expo-router";
import { Box } from "@/components/ui/box";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "@/ThemeContext";
import { useColorScheme } from "nativewind";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";

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
		<ThemeProvider>
			<GestureHandlerRootView>
				<Stack
					screenOptions={{
						headerShown: false,
					}}
				>
					<Stack.Screen name="login" options={{ headerShown: false }} />
					<Stack.Screen name="(protected)" options={{ headerShown: false }} />
				</Stack>
			</GestureHandlerRootView>
		</ThemeProvider>
	);
}
