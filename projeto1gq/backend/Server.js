// backend/server.js
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
    return res
      .status(400)
      .json({ error: "É necessário fornecer o ID da liga." });
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

// Nova Rota para buscar jogadores de um time específico
app.get("/api/players", async (req, res) => {
  const { teamId } = req.query;

  if (!teamId) {
    return res
      .status(400)
      .json({ error: "É necessário fornecer o ID do time." });
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

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
