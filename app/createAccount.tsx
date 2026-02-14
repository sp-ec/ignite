import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Pressable, ScrollView } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Link, router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { View, Platform } from "react-native";
import { auth } from "../FirebaseConfig";
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
import { Image } from "@/components/ui/image";
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
	SelectScrollView,
} from "@/components/ui/select";
import { ChevronDownIcon } from "@/components/ui/icon";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

export default function createAccount() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [bio, setBio] = useState("");
	const [dob, setDob] = useState(new Date());
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [gender, setGender] = useState("");
	const [photos, setPhotos] = useState<string[]>([]);

	const router = useRouter();

	const handleDateChange = (event: any, selectedDate?: Date) => {
		if (Platform.OS === "android") {
			setShowDatePicker(false);
		}
		if (selectedDate) {
			setDob(selectedDate);
		}
	};

	const createAccount = async () => {
		try {
			const user = await createUserWithEmailAndPassword(auth, email, password);
			if (user) {
				router.replace("/profile"); // FIXME: send to profile
			}
		} catch (error: any) {
			console.log(error);
			alert("Sign in failed: " + error.message);
		}
	};

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<VStack className="">
				<Button
					className="text-md bg-zinc-200 mb-2"
					onPress={() => {
						router.navigate("/login");
					}}
				>
					<ButtonText className="text-zinc-900 text-md">
						Back to Login
					</ButtonText>
				</Button>
				<Input className="mb-2">
					<InputField
						placeholder="Email"
						className=""
						value={email}
						onChangeText={setEmail}
					/>
				</Input>
				<Input className="mb-2">
					<InputField
						placeholder="Password"
						className=""
						value={password}
						onChangeText={setPassword}
					/>
				</Input>
				<Input className="mb-2">
					<InputField
						placeholder="Name"
						className=""
						value={name}
						onChangeText={setName}
					/>
				</Input>

				<Textarea
					size="md"
					isReadOnly={false}
					isInvalid={false}
					isDisabled={false}
					className="w-90 mb-2"
				>
					<TextareaInput
						className=""
						placeholder="Bio"
						value={bio}
						onChangeText={setBio}
					/>
				</Textarea>
				<Text>Profile Photos</Text>
				<Button
					className="bg-zinc-200 mb-2"
					onPress={async () => {
						// Request permission (Required for iOS)
						const permissionResult =
							await ImagePicker.requestMediaLibraryPermissionsAsync();

						if (permissionResult.granted === false) {
							alert("Permission to access camera roll is required!");
							return;
						}

						try {
							const result = await ImagePicker.launchImageLibraryAsync({
								mediaTypes: ["images"], // Use ImagePicker.MediaTypeOptions.Images in older versions
								allowsMultipleSelection: true,
								selectionLimit: 3,
								quality: 1,
							});

							if (!result.canceled) {
								const uris = result.assets.map((asset) => asset.uri);
								setPhotos(uris);
								console.log("Selected URIs:", uris);
							}
						} catch (error) {
							console.log("Picker Error: ", error);
						}
					}}
				>
					<ButtonText className="text-zinc-900 text-md">
						Choose Photos
					</ButtonText>
				</Button>
				<HStack space="md" className="mb-2 justify-around">
					{photos.map((uri, index) => (
						<Box key={index} className="relative">
							<Image
								source={{ uri: uri }}
								alt={`Profile photo ${index + 1}`}
								size="md" // gluestack preset for 112px
								className="rounded-lg"
							/>
							{/* Optional: Remove button overlay */}
						</Box>
					))}
				</HStack>
				<HStack className="mb-2">
					<VStack className="w-20 mr-2">
						<Text className="text-md">Month</Text>
						<Select defaultValue="Jan">
							<SelectTrigger>
								<SelectInput />
								<SelectIcon as={ChevronDownIcon} />
							</SelectTrigger>
							<SelectPortal>
								<SelectBackdrop />
								<SelectContent className="">
									<SelectScrollView
										style={{ maxHeight: 400 }}
										showsVerticalScrollIndicator={true}
									>
										<SelectDragIndicatorWrapper>
											<SelectDragIndicator />
										</SelectDragIndicatorWrapper>
										<SelectItem label="Jan" value="jan" />
										<SelectItem label="Feb" value="feb" />
										<SelectItem label="Mar" value="mar" />
										<SelectItem label="Apr" value="apr" />
										<SelectItem label="May" value="may" />
										<SelectItem label="Jun" value="jun" />
										<SelectItem label="Jul" value="jul" />
										<SelectItem label="Aug" value="aug" />
										<SelectItem label="Sep" value="sep" />
										<SelectItem label="Oct" value="oct" />
										<SelectItem label="Nov" value="nov" />
										<SelectItem label="Dec" value="dec" />
									</SelectScrollView>
								</SelectContent>
							</SelectPortal>
						</Select>
					</VStack>
					<VStack className="w-20 mr-2">
						<Text className="text-md">Day</Text>
						<Select defaultValue="1">
							<SelectTrigger>
								<SelectInput />
								<SelectIcon as={ChevronDownIcon} />
							</SelectTrigger>
							<SelectPortal>
								<SelectBackdrop />
								<SelectContent>
									<SelectDragIndicatorWrapper>
										<SelectDragIndicator />
									</SelectDragIndicatorWrapper>
									<SelectScrollView
										style={{ maxHeight: 400 }}
										showsVerticalScrollIndicator={true}
									>
										{Array.from({ length: 31 }, (_, i) => (
											<SelectItem
												key={i + 1}
												label={(i + 1).toString()}
												value={(i + 1).toString()}
											/>
										))}
									</SelectScrollView>
								</SelectContent>
							</SelectPortal>
						</Select>
					</VStack>
					<VStack className="w-28">
						<Text className="text-md">Year</Text>
						<Select defaultValue="2000">
							<SelectTrigger>
								<SelectInput />
								<SelectIcon as={ChevronDownIcon} />
							</SelectTrigger>
							<SelectPortal>
								<SelectBackdrop />

								<SelectContent>
									<SelectScrollView
										style={{ maxHeight: 400 }}
										showsVerticalScrollIndicator={true}
									>
										<SelectDragIndicatorWrapper>
											<SelectDragIndicator />
										</SelectDragIndicatorWrapper>
										{Array.from({ length: 101 }, (_, i) => {
											const year = (new Date().getFullYear() - i).toString();
											return (
												<SelectItem key={year} label={year} value={year} />
											);
										})}
									</SelectScrollView>
								</SelectContent>
							</SelectPortal>
						</Select>
					</VStack>
				</HStack>
				<VStack className="mb-2">
					<Text className="text-md">Gender</Text>
					<Select defaultValue="Select Gender">
						<SelectTrigger>
							<SelectInput />
							<SelectIcon as={ChevronDownIcon} />
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
				<Button className="bg-purple-600" onPress={createAccount}>
					<ButtonText className="text-zinc-200 text-md">
						Create Account
					</ButtonText>
				</Button>
			</VStack>
		</View>
	);
}
