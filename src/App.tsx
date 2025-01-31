import { useState } from "react";
import { FaLocationArrow, FaStop, FaPaperclip } from "react-icons/fa";
import { GiArtificialHive } from "react-icons/gi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { anOldHope } from "react-syntax-highlighter/dist/esm/styles/hljs"; // или другой стиль подсветки

async function generateResponse(question: string) {
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "deepseek-r1", prompt: question }),
    });
    
    if (!response.ok) {
      throw new Error("Ошибка при получении ответа от сервера");
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = "";
    let buffer = "";

    while (true) {
      const { value, done } = await reader?.read() || {};
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n").filter((p) => p.trim() !== "");

      for (let i = 0; i < parts.length; i++) {
        try {
          const json = JSON.parse(parts[i].trim());
          if (json.response) fullResponse += json.response;
          buffer = "";
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          console.warn("Ошибка парсинга JSON:", parts[i]);
          buffer = parts[i];
        }
      }
    }

    return fullResponse.trim();
  } catch (error) {
    console.error(error);
    return "Ошибка при получении ответа.";
  }
}

type Message = {
  text: string;
  sender: "user" | "bot"; // Строгая типизация для sender
};

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const botResponse = await generateResponse(input);

    const botMessage: Message = { text: botResponse, sender: "bot" };
    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
  };

  const formatMessage = (message: string) => {
    // Проверка на наличие кода (можно улучшить с помощью регулярных выражений)
    const codeRegex = /```(.*?)```/gs;
    return message.split(codeRegex).map((part, index) => {
      if (index % 2 === 1) {
        // Это код внутри тройных обратных кавычек
        return (
          <SyntaxHighlighter key={index} language="javascript" style={anOldHope}>
            {part}
          </SyntaxHighlighter>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


  return (
    <div className="w-full h-screen font-sans bg-white p-4 rounded-lg shadow-lg">
      <div className="w-[70%] mx-auto pt-[10%]">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-4"><GiArtificialHive className="w-12 h-12"/> Roma Monstr GPT</h2>
        <div className="border border-gray-300 p-4 h-[60vh] overflow-y-auto mb-4 rounded-lg bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
              <p className={`font-semibold ${msg.sender === "user" ? "text-blue-500" : "text-green-500"}`}>
                {msg.sender === "user" ? "Вы" : "128 баллов на ЕНТ"}:
              </p>
              <p className="text-gray-700">{formatMessage(msg.text)}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={input}
            onKeyDown={handleKeyDown}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mr-2"
            placeholder="Введите сообщение..."
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          >
            <FaPaperclip />
          </button>
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          >
            <FaStop />
          </button>
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          >
            <FaLocationArrow />
          </button>
        </div>
      </div>
    </div>
  );
}
