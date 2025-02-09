import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MessageProps = {
  text: string;
  sender: "user" | "bot";
};

export default function Message({ text, sender }: MessageProps) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    let index = 0;
    setVisibleText("");

    const interval = setInterval(() => {
      if (index < text.length) {
        setVisibleText((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30); // Скорость появления букв

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className={`mb-2 transition-opacity duration-300 ${sender === "user" ? "text-right" : "text-left"}`}>
      <p className={`font-semibold ${sender === "user" ? "text-blue-500" : "text-green-500"}`}>
        {sender === "user" ? "Вы" : "128 баллов на ЕНТ"}:
      </p>
      <ReactMarkdown className="text-gray-700" remarkPlugins={[remarkGfm]}>
        {visibleText}
      </ReactMarkdown>
    </div>
  );
}

