async function generateResponse(question: string) {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "deepseek-r1", prompt: question }),
    });
  
    const reader = response.body?.getReader();
    let answer = "";
  
    while (true) {
      const { value, done } = await reader?.read() || {};
      if (done) break;
      answer += new TextDecoder().decode(value);
    }
  
    return answer;
  }

export default generateResponse;