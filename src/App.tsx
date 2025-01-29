import { useState } from "react";
import { FaLocationArrow } from "react-icons/fa";
import { FaStop } from "react-icons/fa";
import { FaPaperclip } from "react-icons/fa";


async function generateResponse(question: string) {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "deepseek-r1", prompt: question }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch response');
  }

  const reader = response.body?.getReader();
  let fullResponse = '';
  const decoder = new TextDecoder(); // Декодирует полученные данные

  while (true) {
    const { value, done } = await reader?.read() || {};  // Читаем данные
    if (done) break;  // Завершаем, если данных больше нет

    fullResponse += decoder.decode(value, { stream: true });  // Добавляем к накопленному ответу
  }

  return fullResponse.trim();  // Убираем лишние пробелы в начале и в конце
}




export default function ChatComponent() {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    // Обновление состояния с типами "user" и "bot"
    const userMessage: { text: string; sender: "user" } = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    const botResponse = await generateResponse(input);

    // Обновление состояния с типами "user" и "bot"
    const botMessage: { text: string; sender: "bot" } = { text: botResponse, sender: "bot" };
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div className="w-full h-screen font-sans bg-white p-4 rounded-lg shadow-lg">
      <div className="w-[70%] mx-auto pt-[10%]">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🗨️ Roma Gay Chat</h2>
        <div className="border border-gray-300 p-4 h-[40vh] overflow-y-auto mb-4 rounded-lg bg-gray-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}
            >
              <p className={`font-semibold ${msg.sender === "user" ? "text-blue-500" : "text-green-500"}`}>
                {msg.sender === "user" ? "Вы" : "RomaGayGpt"}:
              </p>
              <p className="text-gray-700">{msg.text}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mr-2"
            placeholder="Введите сообщение..."
          />
          <button
            onClick={handleSend}
            className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          >
            <FaPaperclip />
          </button>
          <button
            onClick={handleSend}
            className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          >
            <FaStop />
          </button>
          <button
            onClick={handleSend}
            className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          >
            <FaLocationArrow />
          </button>
        </div>
      </div>
    </div>
  );
}
