// ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useColorScheme } from "nativewind";
import { View } from "react-native";

type ThemeContextType = {
	colorMode: "light" | "dark";
	toggleColorMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [colorMode, setColorMode] = useState<"light" | "dark">("light");
	const { colorScheme, setColorScheme } = useColorScheme();

	const toggleColorMode = () => {
		const newColorMode = colorMode === "light" ? "dark" : "light";
		setColorMode(newColorMode);
		setColorScheme(newColorMode);
		AsyncStorage.setItem("theme", newColorMode);
	};

	useEffect(() => {
		(async () => {
			const savedColorMode = (await AsyncStorage.getItem("theme")) as
				| ThemeContextType["colorMode"]
				| "light";
			if (savedColorMode) {
				setColorMode(savedColorMode);
				setColorScheme(savedColorMode);
				AsyncStorage.setItem("theme", savedColorMode);
			}
		})();
	}, []);

	const backgroundColor = colorMode === "light" ? "#ffffff" : "#000000";

	return (
		<ThemeContext.Provider value={{ colorMode, toggleColorMode }}>
			<View style={{ flex: 1, backgroundColor }}>
				<GluestackUIProvider mode={colorMode}>{children}</GluestackUIProvider>
			</View>
		</ThemeContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
