import express from "express";
import cors from "cors";
// import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const participants = [];
const messages = [];

app.post("/participants", (req, res) => {
	const newParticipant = {
		name: req.body.name.trim(),
		lastStatus: Date.now(),
	};
	console.log({ newParticipant });
	//   const participants = JSON.parse(fs.readFileSync("participants.txt"));
	//   fs.writeFileSync("participants.txt", JSON.stringify(participants));
	if (!newParticipant.name || newParticipant.name === "")
		return res.status(400).send("Nome vazio!");
	if (
		participants.find((participant) => participant.name === newParticipant.name)
	)
		return res.status(400).send("Usuário já existe!");
	participants.push(newParticipant);
	res.status(200).send("Participante adicionado com sucesso!");
});

app.get("/participants", (req, res) => {
	res.send(participants);
});

app.post("/messages", (req, res) => {
	const newMessage = {
		from: req.headers.user,
		...req.body,
		time: new Date().toLocaleTimeString("pt-br"),
	};
	if (!newMessage.to || !newMessage.text)
		return res.status(400).send("mensagem sem texto ou destinatário");
	if (newMessage.type !== "message" && newMessage.type !== "private_message")
		return res.status(400).send("tipo inválido de mensagem");
	messages.push(newMessage);
	res.status(200).send("mensagem enviada com sucesso");
});

app.get("/messages", (req, res) => {
	const visibleMsgs = messages.filter(
		(message) =>
			message.type === "message" ||
			(message.type === "private_message" &&
				(message.from === req.headers.user || message.to === req.headers.user))
	);
	if (req.query.limit && visibleMsgs.length > req.query.limit)
		return res.send(
			visibleMsgs.slice(
				visibleMsgs.length - req.query.limit - 1,
				visibleMsgs.length - 1
			)
		);
	res.send(visibleMsgs);
});

app.listen(4000);
