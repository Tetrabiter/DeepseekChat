import React, { useState } from "react";
import { FaLocationArrow, FaStop, FaPaperclip } from "react-icons/fa";

type MessageInputProps = {
  onSend: (text: string) => void;
  onStop: () => void;
  isLoading: boolean;
};

export default function MessageInput({ onSend, onStop, isLoading }: MessageInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
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
        className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 duration-300"
      >
        <FaPaperclip />
      </button>
      <button
        onClick={onStop} // Останавливаем ответ
        disabled={!isLoading}
        className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 duration-300"
      >
        <FaStop />
      </button>
      <button
        onClick={handleSend}
        disabled={isLoading}
        className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 duration-300"
      >
        <FaLocationArrow />
      </button>
    </div>
  );
}
