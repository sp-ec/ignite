import { createContext, useState } from "react";
import { useRouter } from "expo-router";

type AuthState = {
  isLoggedIn: boolean;
  logIn: () => void;
  logOut: () => void;
};

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  logIn: () => {},
  logOut: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const logIn = () => {
    setIsLoggedIn(true);
    router.replace("/(protected)/(tabs)/(swipe)/swipe");
  };
  const logOut = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
