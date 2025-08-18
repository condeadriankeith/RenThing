import React, { useState, useRef, useEffect } from "react";

interface Message {
	id: string;
	sender: "user" | "owner";
	text: string;
	timestamp: number;
}

interface ChatProps {
	ownerId: string;
}

export const Chat: React.FC<ChatProps> = ({ ownerId }) => {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			sender: "owner",
			text: "Hi! How can I help you today?",
			timestamp: Date.now() - 100000,
		},
	]);
	const [input, setInput] = useState("");
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSend = () => {
		if (!input.trim()) return;
		const newMessage: Message = {
			id: Date.now().toString(),
			sender: "user",
			text: input,
			timestamp: Date.now(),
		};
		setMessages((prev) => [...prev, newMessage]);
		setInput("");

		// Simulate owner reply
		setTimeout(() => {
			setMessages((prev) => [
				...prev,
				{
					id: (Date.now() + 1).toString(),
					sender: "owner",
					text: "Thanks for your message! I'll get back to you soon.",
					timestamp: Date.now(),
				},
			]);
		}, 1200);
	};

	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSend();
		}
	};

	return (
		<div className="flex flex-col h-[500px] border rounded-lg shadow bg-white">
			<div className="flex-1 overflow-y-auto p-4 space-y-2">
				{messages.map((msg) => (
					<div
						key={msg.id}
						className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
					>
						<div
							className={`px-4 py-2 rounded-lg max-w-xs break-words text-sm shadow-sm ${
								msg.sender === "user"
									? "bg-blue-500 text-white"
									: "bg-gray-200 text-gray-900"
							}`}
							title={new Date(msg.timestamp).toLocaleString()}
						>
							{msg.text}
						</div>
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>
			<div className="p-3 border-t flex gap-2 bg-gray-50">
				<input
					type="text"
					className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
					placeholder="Type your message..."
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleInputKeyDown}
				/>
				<button
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
					onClick={handleSend}
					disabled={!input.trim()}
				>
					Send
				</button>
			</div>
		</div>
	);
};
