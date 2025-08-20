import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Ola, mundo");
});

app.listen(8000, () => console.log("Escutando na porta 8000"));
