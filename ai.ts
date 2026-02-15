import OpenAI from "openai";
import { IMessage } from "react-native-gifted-chat";

const openai = new OpenAI({
	baseURL: "https://openrouter.ai/api/v1",
	apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

export async function generateAIResult(
	prompt = "What is the meaning of life?",
) {
	const completion = await openai.chat.completions.create({
		model: "openai/gpt-5.2",
		messages: [
			{
				role: "user",
				content: prompt,
			},
		],
	});

	// Return the message content instead of logging it
	return completion.choices[0].message;
}

export async function generateConversationStarters(chatHistory: IMessage[]) {
	const completion = await openai.chat.completions.create({
		model: "openai/gpt-5.2",
		messages: [
			{
				role: "system",
				content:
					"Analyze the following chat history and generate a list of exactly 3 relevant conversation starter ideas based on the context. Don't speak from the first person, give direct advice to the user. Do not use markdown formatting.",
			},
			{
				role: "user",
				content: `Previous messages:\n${JSON.stringify(chatHistory)}`,
			},
		],
	});

	return completion.choices[0].message.content;
}

export async function generateDateIdeas(chatHistory: IMessage[]) {
	const completion = await openai.chat.completions.create({
		model: "openai/gpt-5.2",
		messages: [
			{
				role: "system",
				content:
					"Analyze the following chat history and generate a list of exactly 3 relevant date ideas based on the context. Don't speak from the first person, give direct advice to the user. Do not use markdown formatting.",
			},
			{
				role: "user",
				content: `Previous messages:\n${JSON.stringify(chatHistory)}`,
			},
		],
	});

	return completion.choices[0].message.content;
}
