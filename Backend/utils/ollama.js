const getOllamaAPIResponse = async (message) => {

    try {

        const response = await fetch("http://localhost:11434/api/chat", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                model: "llama3.2",

                messages: [
                    {
                        role: "user",
                        content: message
                    }
                ],

                stream: false
            })
        });


        if (!response.ok) {
            throw new Error(
                `Ollama API Error: ${response.status}`
            );
        }


        const data = await response.json();


        return data.message.content;

    } catch (error) {

        console.log("Ollama API Error:", error);

        throw error;
    }
};


export default getOllamaAPIResponse;