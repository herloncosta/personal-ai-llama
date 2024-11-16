import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

app.post("/ai", async (req, res) => {
	const { prompt } = req.body;
	try {
		const response = await axios.post(
			"http://localhost:11434/api/generate",
			{
				model: "llama3",
				prompt,
				stream: true,
			},
			{
				responseType: "stream",
			},
		);

		response.data.on("data", (data) => {
			const chunk = data.toString();
			console.log(chunk);
			res.json({ chunk });
		});

		response.data.on("end", () => {
			res.end();
		});

		// response.data.on("error", (err) => {
		// 	console.log(`Error on stream: ${err}`);
		// 	res.status(500).send("Error on processing response...");
		// });
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
