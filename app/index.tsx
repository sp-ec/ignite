import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function IndexScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href="/(protected)/(tabs)/(swipe)/swipe">Login</Link>
      <Link href="/register">Register</Link>
    </View>
  );
}
