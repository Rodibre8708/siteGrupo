const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Sua chave da API Football-Data.org
const API_KEY = "10946cbe120c40ada637c1b4a66f9ebb";
const API_URL = "https://api.football-data.org/v4/";

// Rota de teste para a raiz do servidor
app.get("/", (req, res) => {
  res.send("Servidor do Escalação FC está online!");
});

// --- Rotas para consumir a API de terceiros (Football-Data.org) ---

// Rota para buscar ligas
app.get("/api/leagues", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}competitions`, {
      headers: {
        "X-Auth-Token": API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Erro ao buscar ligas:", error.message);
    res.status(500).json({ error: "Erro ao buscar dados da API." });
  }
});

// Rota para buscar times de uma liga específica
app.get("/api/teams", async (req, res) => {
  const { leagueId } = req.query;

  if (!leagueId) {
    return res.status(400).json({ error: "É necessário fornecer o ID da liga." });
  }

  try {
    const response = await axios.get(
      `${API_URL}competitions/${leagueId}/teams`,
      {
        headers: {
          "X-Auth-Token": API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Erro ao buscar times:", error.message);
    res.status(500).json({ error: "Erro ao buscar dados da API." });
  }
});

// Rota para buscar jogadores de um time específico
app.get("/api/players", async (req, res) => {
  const { teamId } = req.query;

  if (!teamId) {
    return res.status(400).json({ error: "É necessário fornecer o ID do time." });
  }

  try {
    const response = await axios.get(`${API_URL}teams/${teamId}`, {
      headers: {
        "X-Auth-Token": API_KEY,
      },
    });
    res.json(response.data.squad);
  } catch (error) {
    console.error("Erro ao buscar jogadores:", error.message);
    res.status(500).json({ error: "Erro ao buscar dados da API." });
  }
});

// --- Rotas para o CRUD de Escalações ---

// Simulação de Banco de Dados
const escalacoes = [];
let nextId = 1;

// CREATE: Rota para criar (salvar) uma nova escalação
app.post("/api/escalacoes", (req, res) => {
  const newEscalacao = {
    id: nextId++,
    name: req.body.name,
    formation: req.body.formation,
    date: req.body.date,
    players: req.body.players,
  };
  escalacoes.push(newEscalacao);
  res.status(201).json(newEscalacao);
});

// READ: Rota para ler (listar) todas as escalações
app.get("/api/escalacoes", (req, res) => {
  res.json(escalacoes);
});

// READ: Rota para ler (listar) uma escalação específica
app.get("/api/escalacoes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const escalacao = escalacoes.find((e) => e.id === id);

  if (!escalacao) {
    return res.status(404).json({ error: "Escalação não encontrada." });
  }

  res.json(escalacao);
});

// UPDATE: Rota para atualizar uma escalação existente
app.put("/api/escalacoes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const escalacaoIndex = escalacoes.findIndex((e) => e.id === id);

  if (escalacaoIndex === -1) {
    return res.status(404).json({ error: "Escalação não encontrada." });
  }

  escalacoes[escalacaoIndex] = {
    ...escalacoes[escalacaoIndex],
    ...req.body,
  };

  res.json(escalacoes[escalacaoIndex]);
});

// DELETE: Rota para deletar uma escalação
app.delete("/api/escalacoes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const escalacaoIndex = escalacoes.findIndex((e) => e.id === id);

  if (escalacaoIndex === -1) {
    return res.status(404).json({ error: "Escalação não encontrada." });
  }

  escalacoes.splice(escalacaoIndex, 1);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});