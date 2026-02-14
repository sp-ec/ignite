import { Text, View } from "react-native";
import { Link } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "@/utils/authContext";
import { Button } from "@react-navigation/elements";

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
      <Button onPress={authContext.logIn}>Log in</Button>
      <Link href="/register">Register</Link>
    </View>
  );
}
