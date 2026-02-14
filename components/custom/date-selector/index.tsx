import React from "react";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import {
	Select,
	SelectTrigger,
	SelectInput,
	SelectIcon,
	SelectPortal,
	SelectBackdrop,
	SelectContent,
	SelectDragIndicatorWrapper,
	SelectDragIndicator,
	SelectItem,
	SelectScrollView,
} from "@/components/ui/select";
import { ChevronDownIcon } from "@/components/ui/icon";

interface DateSelectorProps {
	onDateChange?: (date: { month: string; day: string; year: string }) => void;
}

export default function DateSelector({ onDateChange }: DateSelectorProps) {
	const [date, setDate] = React.useState({
		month: "Jan",
		day: "1",
		year: "2000",
	});

	const updateDate = (key: string, value: string) => {
		const newDate = { ...date, [key]: value };
		setDate(newDate);
		onDateChange?.(newDate);
	};

	return (
		<HStack className="mb-2">
			{/* Month Select */}
			<VStack className="w-20 mr-2">
				<Text className="text-md">Month</Text>
				<Select
					defaultValue="Jan"
					onValueChange={(v) => updateDate("month", v)}
				>
					<SelectTrigger>
						<SelectInput />
						<SelectIcon as={ChevronDownIcon} />
					</SelectTrigger>
					<SelectPortal>
						<SelectBackdrop />
						<SelectContent>
							<SelectScrollView style={{ maxHeight: 400 }}>
								<SelectDragIndicatorWrapper>
									<SelectDragIndicator />
								</SelectDragIndicatorWrapper>
								{[
									"Jan",
									"Feb",
									"Mar",
									"Apr",
									"May",
									"Jun",
									"Jul",
									"Aug",
									"Sep",
									"Oct",
									"Nov",
									"Dec",
								].map((m) => (
									<SelectItem key={m} label={m} value={m.toLowerCase()} />
								))}
							</SelectScrollView>
						</SelectContent>
					</SelectPortal>
				</Select>
			</VStack>

			{/* Day Select */}
			<VStack className="w-20 mr-2">
				<Text className="text-md">Day</Text>
				<Select defaultValue="1" onValueChange={(v) => updateDate("day", v)}>
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
							<SelectScrollView style={{ maxHeight: 400 }}>
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

			{/* Year Select */}
			<VStack className="w-28">
				<Text className="text-md">Year</Text>
				<Select
					defaultValue="2000"
					onValueChange={(v) => updateDate("year", v)}
				>
					<SelectTrigger>
						<SelectInput />
						<SelectIcon as={ChevronDownIcon} />
					</SelectTrigger>
					<SelectPortal>
						<SelectBackdrop />
						<SelectContent>
							<SelectScrollView style={{ maxHeight: 400 }}>
								<SelectDragIndicatorWrapper>
									<SelectDragIndicator />
								</SelectDragIndicatorWrapper>
								{Array.from({ length: 101 }, (_, i) => {
									const year = (new Date().getFullYear() - i).toString();
									return <SelectItem key={year} label={year} value={year} />;
								})}
							</SelectScrollView>
						</SelectContent>
					</SelectPortal>
				</Select>
			</VStack>
		</HStack>
	);
}
