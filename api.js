import express from "express";
import cors from "cors";
// import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const participants = [];

app.post("/participants", (req, res) => {
    const newParticipant = {
        name: req.body.name.trim(),
        lastStatus: Date.now(),
    };
    console.log({ newParticipant });
    //   const participants = JSON.parse(fs.readFileSync("participants.txt"));
    //   fs.writeFileSync("participants.txt", JSON.stringify(participants));
    if (newParticipant && !newParticipant.name)
        res.status(400).send("Nome vazio!");
    if (
        participants.find(
            (participant) => participant.name === newParticipant.name
        )
    )
        res.status(400).send("Usuário já existe!");
    participants.push(newParticipant);

    res.status(200).send("Participante adicionado com sucesso!");
});

app.get("/participants", (req, res) => {
    res.send(participants);
});

app.listen(4000);
