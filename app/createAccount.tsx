import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { ChevronDownIcon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Input, InputField } from "@/components/ui/input";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectScrollView,
  SelectTrigger,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/vstack";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { db, storage } from "../FirebaseConfig";

export default function createAccount() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [bio, setBio] = useState("");
  const [month, setMonth] = useState("0");
  const [day, setDay] = useState("1");
  const [year, setYear] = useState("2000");
	const [gender, setGender] = useState("");
	const [photos, setPhotos] = useState<string[]>([]);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
    bio?: string;
    day?: string;
    dob?: string;
    gender?: string;
    images?: string;
  }>({});

	const router = useRouter();

  const auth = getAuth();

	const createAccount = async () => {
    if (!validateInputs()) return;

		try {
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const photoUrls = await uploadPhotos(user.uid, photos);

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name,
        bio: bio,
        dob: Timestamp.fromDate(new Date(Number(year), Number(month), Number(day))),
        gender: gender,
        photos: photoUrls
      });

			if (user) {
				router.replace("/profile");
			}
		} catch (error: any) {
			console.log(error);
			alert("Create account failed: " + error.message);
		}
	};

  const uploadPhotos = async (uid: string, uris: string[]) => {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < uris.length; i++) {
      const uri = uris[i];

      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `users/${uid}/photo_${i}.jpg`);
      await uploadBytes(storageRef, blob);

      const downloadUrl = await getDownloadURL(storageRef);
      uploadedUrls.push(downloadUrl);
    }

    return uploadedUrls;
  };

  const validateInputs = (): boolean => {
    const newErrors: typeof errors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email address"
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!name.trim()) {
      newErrors.name = "Name cannot be empty"
    }

    if (name.length > 20) {
      newErrors.name = "Name must be less than or equal to 20 characters"
    }

    if (!bio.trim()) {
      newErrors.bio = "Bio cannot be empty"
    }

    if (bio.length > 250) {
      newErrors.bio = "Bio must be less than or equal to 250 characters"
    }

    const dob = new Date(Number(year), Number(month), Number(day));
    if (dob.getDate() !== Number(day)) {
      newErrors.day = "Invalid date of birth day"
    } else {
      const today = new Date();

      let age = today.getFullYear() - dob.getFullYear();
      const diff = today.getMonth() - dob.getMonth();

      if (
        diff < 0 ||
        diff === 0 && today.getDate() < dob.getDate()
        ) {
          age--;
        }

      if (age < 18) {
        newErrors.dob = "You must be at least 18 years old";
      }
    }

    if (!gender) {
      newErrors.gender = "Please select a gender"
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      alert(
        "Create account failed from invalid fields: " +
        Object.keys(newErrors).join(", ")
      );
      return false;
    }

    return true;
  };

	return (
		<ScrollView
			contentContainerStyle={{
				flexGrow: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
      showsVerticalScrollIndicator={false}
		>
			<VStack className="">
				<Button
					className="text-md bg-zinc-200 mt-8 mb-2"
					onPress={() => {
						router.navigate("/login");
					}}
				>
					<ButtonText className="text-zinc-900 text-md">
						Back to Login
					</ButtonText>
				</Button>
        <VStack className="mb-2">
          <Input>
            <InputField
              placeholder="Email"
              className=""
              value={email}
              onChangeText={setEmail}
            />
          </Input>
          {errors.email && <Text className="text-red-500 text-sm mb-2">{errors.email}</Text>}
        </VStack>

        <VStack className="mb-2">
          <Input >
            <InputField
              placeholder="Password"
              className=""
              value={password}
              onChangeText={setPassword}
            />
          </Input>
          {errors.password && <Text className="text-red-500 text-sm">{errors.password}</Text>}
        </VStack>

        <VStack className="mb-2">
          <Input >
            <InputField
              placeholder="Name"
              className=""
              value={name}
              onChangeText={setName}
            />
          </Input>
          {errors.name && <Text className="text-red-500 text-sm">{errors.name}</Text>}
        </VStack>

        <VStack className="w-90 mb-2">
          <Textarea
            size="md"
            isReadOnly={false}
            isInvalid={false}
            isDisabled={false}
          >
            <TextareaInput
              className=""
              placeholder="Bio"
              value={bio}
              onChangeText={setBio}
            />
          </Textarea>
          {errors.bio && <Text className="text-red-500 text-sm">{errors.bio}</Text>}
        </VStack>

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

                if (uris.length > 3) {
                  alert("You can only select up to 3 photos");
                  setPhotos(uris.slice(0, 3));
                } else {
								  setPhotos(uris);
                }
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
						<Select defaultValue="Jan" onValueChange={setMonth}>
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
										<SelectItem label="Jan" value="0" />
										<SelectItem label="Feb" value="1" />
										<SelectItem label="Mar" value="2" />
										<SelectItem label="Apr" value="3" />
										<SelectItem label="May" value="4" />
										<SelectItem label="Jun" value="5" />
										<SelectItem label="Jul" value="6" />
										<SelectItem label="Aug" value="7" />
										<SelectItem label="Sep" value="8" />
										<SelectItem label="Oct" value="9" />
										<SelectItem label="Nov" value="10" />
										<SelectItem label="Dec" value="11" />
									</SelectScrollView>
								</SelectContent>
							</SelectPortal>
						</Select>
					</VStack>
					<VStack className="w-20 mr-2">
						<Text className="text-md">Day</Text>
						<Select defaultValue="1" onValueChange={setDay}>
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
										{Array.from({ length: new Date(Number(year), Number(month) + 1, 0).getDate() }, (_, i) => (
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
            {errors.day && <Text className="text-red-500 text-sm">{errors.day}</Text>}

					</VStack>
					<VStack className="w-28">
						<Text className="text-md">Year</Text>
						<Select defaultValue="2000" onValueChange={setYear}>
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
        {errors.dob && <Text className="text-red-500 text-sm mb-2">{errors.dob}</Text>}

				<VStack className="mb-2">
					<Text className="text-md">Gender</Text>
					<Select defaultValue="Select Gender" onValueChange={setGender}>
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
          {errors.gender && <Text className="text-red-500 text-sm">{errors.gender}</Text>}

				</VStack>
				<Button className="bg-purple-600 mb-8" onPress={createAccount}>
					<ButtonText className="text-zinc-200 text-md">
						Create Account
					</ButtonText>
				</Button>
			</VStack>
		</ScrollView>
	);
}
