"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import { FaUserCircle } from "react-icons/fa";

// Ícone de voltar
const BackIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
    />
  </svg>
);

const formationOptions = ["4-4-2", "4-3-3", "4-2-3-1", "3-5-2"];

const getFormationGrid = (formation) => {
  const parts = formation.split("-").map(Number);
  const rows = [];

  // Adiciona as linhas de jogadores
  for (let i = parts.length - 1; i >= 0; i--) {
    rows.push(
      <div
        key={i}
        className={styles.playerRow}
        style={{ gridTemplateColumns: `repeat(${parts[i]}, 1fr)` }}
      >
        {[...Array(parts[i])].map((_, idx) => (
          <div key={idx} className={styles.playerContainer}>
            <div className={styles.playerCircle}></div>
          </div>
        ))}
      </div>
    );
  }

  // Adiciona o goleiro na última linha
  rows.push(
    <div
      key="gk"
      className={styles.playerRow}
      style={{ gridTemplateColumns: "1fr" }}
    >
      <div className={styles.playerContainer}>
        <div className={styles.playerCircle}></div>
      </div>
    </div>
  );

  return rows;
};

export default function CreateLineupPage() {
  const [formation, setFormation] = useState("4-3-3");
  const [lineupName, setLineupName] = useState("");
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("");
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [players, setPlayers] = useState([]);
  const router = useRouter();

  // Função para buscar as ligas do back-end
  const fetchLeagues = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/leagues");
      const data = await response.json();
      setLeagues(data.competitions);
    } catch (error) {
      console.error("Falha ao buscar as ligas:", error);
    }
  };

  // Função para buscar os times do back-end
  const fetchTeams = async (leagueId) => {
    if (!leagueId) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3001/api/teams?leagueId=${leagueId}`
      );
      const data = await response.json();
      setTeams(data.teams);
    } catch (error) {
      console.error("Falha ao buscar os times:", error);
    }
  };

  // Nova função para buscar os jogadores do back-end
  const fetchPlayers = async (teamId) => {
    if (!teamId) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/players?teamId=${teamId}`
      );
      const data = await response.json();
      setPlayers(data); // A API retorna um array de jogadores diretamente
    } catch (error) {
      console.error("Falha ao buscar os jogadores:", error);
    }
  };

  // Efeito para carregar as ligas na montagem
  useEffect(() => {
    fetchLeagues();
  }, []);

  // Efeito para carregar os times quando a liga selecionada muda
  useEffect(() => {
    if (selectedLeague) {
      fetchTeams(selectedLeague);
    } else {
      setTeams([]);
      setSelectedTeam("");
      setPlayers([]);
    }
  }, [selectedLeague]);

  // Efeito para carregar os jogadores quando o time selecionado muda
  useEffect(() => {
    if (selectedTeam) {
      fetchPlayers(selectedTeam);
    } else {
      setPlayers([]);
    }
  }, [selectedTeam]);

  const handleSaveLineup = () => {
    if (!lineupName) {
      alert("Por favor, dê um nome à sua escalação antes de salvar.");
      return;
    }

    const newEscalacao = {
      name: lineupName,
      formation: formation,
      players: [],
      date: new Date().toLocaleDateString("pt-BR"),
      leagueId: selectedLeague,
      teamId: selectedTeam,
    };

    const existingEscalacoes =
      JSON.parse(localStorage.getItem("escalacoes")) || [];
    const updatedEscalacoes = [...existingEscalacoes, newEscalacao];
    localStorage.setItem("escalacoes", JSON.stringify(updatedEscalacoes));

    router.push("/MinhasEscalacoes");
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.topBar}>
        <Link href="/" className={styles.backButton}>
          <BackIcon />
          Voltar
        </Link>
        <h1 className={styles.title}>Nova Escalação</h1>
      </div>

      <div className={styles.pageContent}>
        <div className={styles.leftPanel}>
          <div className={styles.configCard}>
            <h2 className={styles.configTitle}>Configurações</h2>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Nome da Escalação</label>
              <input
                type="text"
                placeholder="Ex: Minha seleção"
                className={styles.inputField}
                value={lineupName}
                onChange={(e) => setLineupName(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Liga</label>
              <select
                className={styles.inputField}
                value={selectedLeague}
                onChange={(e) => setSelectedLeague(e.target.value)}
              >
                <option value="">Selecione a liga...</option>
                {leagues.map((league) => (
                  <option key={league.id} value={league.id}>
                    {league.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Times</label>
              <select
                className={styles.inputField}
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
              >
                <option value="">Selecione o time...</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Formação</label>
              <select
                className={styles.inputField}
                value={formation}
                onChange={(e) => setFormation(e.target.value)}
              >
                {formationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <button className={styles.saveButton} onClick={handleSaveLineup}>
              Salvar Escalação
            </button>
          </div>
        </div>

        <div className={styles.fieldPreviewCard}>
          <div className={styles.fieldLines}>
            <div className={styles.penaltyBox}></div>
            <div className={styles.penaltyArc}></div>
            <div className={styles.centerCircle}></div>
          </div>
          <div className={styles.formationDisplay}>
            {getFormationGrid(formation)}
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.playerSelectionCard}>
            <h2 className={styles.playerSelectionTitle}>
              Selecionar Jogadores
            </h2>
            <div className={styles.playerGrid}>
              {players.length > 0 ? (
                players.map((player) => (
                  <div key={player.id} className={styles.playerCard}>
                    {/* A API Football-Data.org não tem fotos no plano gratuito, então usamos um ícone */}
                    <FaUserCircle size={40} color="#38702c" />
                    <span className={styles.playerName}>{player.name}</span>
                  </div>
                ))
              ) : (
                <p>Selecione um time para ver a lista de jogadores.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
