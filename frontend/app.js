const app = document.getElementById("app");
const promptInputEl = document.getElementById("prompt");
const sendPromptButtonEl = document.querySelector("button");
const API_URL = "http://localhost:3001/ai";

async function sendPrompt(prompt) {
	const payload = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ prompt }),
	};
	try {
		const response = await fetch(API_URL, payload);
		return { response, statusCode: response.status };
	} catch (error) {
		app.innerText = "Servidor indisponível!";
		return { error: error.message };
	}
}

async function request(prompt) {
	if (!prompt || prompt.trim() === "") {
		app.innerText = "Digite uma pergunta!";
		return;
	}
	const { response, error, statusCode } = await sendPrompt(prompt);
	if (error) {
		app.innerText =
			"Servidor indisponível! Tente novamente, ou contate o administrador.";
		console.warn(error);
		return;
	}
	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	let buffer = "";

	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			break;
		}
		buffer += decoder.decode(value);
		const parseResponseToJson = parseStreamData(buffer);
		let result = "";
		for (const text of parseResponseToJson) {
			result += text.response;
		}
		app.innerText = result;
	}
}

function parseStreamData(data) {
	const jsonParts = data.match(/{[^{}]*}/g);
	if (!jsonParts) {
		console.error("Não foi possível encontrar objetos JSON na string");
		return;
	}
	const parsedObjects = jsonParts.map((part) => JSON.parse(part));
	return parsedObjects;
}

sendPromptButtonEl.addEventListener("click", (event) => {
	event.preventDefault();
	app.innerText = "Loading...";
	const prompt = promptInputEl.value;
	request(prompt);
	promptInputEl.value = "";
});
