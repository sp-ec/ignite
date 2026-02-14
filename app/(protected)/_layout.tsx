import { Stack, router } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

export default function ProtectedLayout() {
	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, (user) => {
		  if (!user) {
			router.replace("/login");
		  } else {
			//setLoading(false);
		  }
		});
	
		return unsubscribe;
	  }, []);

	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
		</Stack>
	);
}
