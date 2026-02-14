import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Text, View } from "react-native";
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
} from "@/components/ui/select";
import { ChevronDownIcon, Icon } from "@/components/ui/icon";
import { useState } from "react";
import { Box } from "@/components/ui/box";

export default function IndexScreen() {
	const [photos, setPhotos] = useState<string[]>([]);

	return (
		<View>
			<VStack className="p-3 space-y-2">
				<Text className="text-2xl">Name</Text>
				<Text className="text-lg">Your Photos</Text>
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
				<HStack className="space-x-10 justify-around">
					<Text className="text-lg">Birthday</Text>
					<VStack>
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
				</HStack>
				<Text className="text-lg">Bio</Text>
				<Text className="text-md">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
					eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
					minim veniam, quis nostrud exercitation ullamco laboris nisi ut
					aliquip ex ea commodo consequat.{" "}
				</Text>
			</VStack>
		</View>
	);
}
