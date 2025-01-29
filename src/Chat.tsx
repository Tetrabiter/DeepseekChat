import { useState } from "react";
import axios from "axios";

export default function Chat() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    const { data } = await axios.post("http://localhost:11434/api/generate", {
      model: "deepseek-r1",
      prompt: input,
    });
    setResponse(data.response);
  };

  return (
    <div className="w-full">
      <p>Ответ: {response}</p>
      <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Введите запрос..."
          />
          <button onClick={handleSubmit}>Отправить</button>
      </div>
    </div>
  );
}
