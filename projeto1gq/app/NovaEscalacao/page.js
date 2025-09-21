'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { FaUserCircle } from 'react-icons/fa';

// Ícone de voltar
const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const formationOptions = ['4-4-2', '4-3-3', '4-2-3-1', '3-5-2'];
const totalPlayers = 11;
const initialPositions = Array(totalPlayers).fill(null);

export default function CreateLineupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [formation, setFormation] = useState('4-3-3');
  const [lineupName, setLineupName] = useState('');
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [players, setPlayers] = useState([]);
  const [lineupPositions, setLineupPositions] = useState(initialPositions);

  // Efeito para carregar as ligas do back-end
  const fetchLeagues = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/leagues');
      const data = await response.json();
      setLeagues(data.competitions);
    } catch (error) {
      console.error('Falha ao buscar as ligas:', error);
    }
  };

  // Função para buscar os times do back-end
  const fetchTeams = async (leagueId) => {
    if (!leagueId) return;
    try {
      const response = await fetch(`http://localhost:3001/api/teams?leagueId=${leagueId}`);
      const data = await response.json();
      setTeams(data.teams);
    } catch (error) {
      console.error('Falha ao buscar os times:', error);
    }
  };

  // Função para buscar os jogadores do back-end
  const fetchPlayers = async (teamId) => {
    if (!teamId) return;
    try {
      const response = await fetch(`http://localhost:3001/api/players?teamId=${teamId}`);
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error('Falha ao buscar os jogadores:', error);
    }
  };

  // Efeito para carregar a escalação para edição do back-end
  useEffect(() => {
    if (editId) {
      const fetchEscalacao = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/escalacoes/${editId}`);
          const data = await response.json();
          if (data) {
            setLineupName(data.name);
            setFormation(data.formation);
            setLineupPositions(data.players);
          }
        } catch (error) {
          console.error("Erro ao buscar escalação para edição:", error);
        }
      };
      fetchEscalacao();
    }
  }, [editId]);

  useEffect(() => {
    fetchLeagues();
  }, []);

  useEffect(() => {
    if (selectedLeague) {
      fetchTeams(selectedLeague);
    } else {
      setTeams([]);
      setSelectedTeam('');
      setPlayers([]);
    }
  }, [selectedLeague]);

  useEffect(() => {
    if (selectedTeam) {
      fetchPlayers(selectedTeam);
    } else {
      setPlayers([]);
    }
  }, [selectedTeam]);

  // Lógica de Drag and Drop
  const handleDragStart = (e, player, sourceIndex = null) => {
    e.dataTransfer.setData('player', JSON.stringify(player));
    e.dataTransfer.setData('sourceIndex', sourceIndex);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const playerData = e.dataTransfer.getData('player');
    if (!playerData) return; // Corrigido o erro de sintaxe

    const player = JSON.parse(playerData);
    const sourceIndex = e.dataTransfer.getData('sourceIndex');

    const newPositions = [...lineupPositions];

    if (sourceIndex === 'null') {
      newPositions[targetIndex] = player;
    } else {
      const oldPlayer = lineupPositions[sourceIndex];
      const targetPlayer = lineupPositions[targetIndex];

      newPositions[targetIndex] = oldPlayer;
      newPositions[sourceIndex] = targetPlayer;
    }
    setLineupPositions(newPositions);
  };

  const handleRemovePlayer = (e) => {
    e.preventDefault();
    const sourceIndex = e.dataTransfer.getData('sourceIndex');
    if (sourceIndex !== 'null') {
      const newPositions = [...lineupPositions];
      newPositions[sourceIndex] = null;
      setLineupPositions(newPositions);
    }
  };

  const renderFormation = () => {
    const formationMap = {
      '4-4-2': [4, 4, 2],
      '4-3-3': [4, 3, 3],
      '4-2-3-1': [4, 2, 3, 1],
      '3-5-2': [3, 5, 2],
    };

    const rows = [];
    let positionIndex = 1;

    const formationParts = (formationMap[formation] || formationMap['4-3-3']).slice().reverse();
    for (const numPlayers of formationParts) {
      const playerRow = [];
      for (let i = 0; i < numPlayers; i++) {
        const currentPositionIndex = positionIndex + i;
        playerRow.push(
          <div
            key={currentPositionIndex}
            className={styles.playerContainer}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, currentPositionIndex)}
          >
            <div
              className={styles.playerCircle}
              draggable={lineupPositions[currentPositionIndex] !== null}
              onDragStart={(e) => handleDragStart(e, lineupPositions[currentPositionIndex], currentPositionIndex)}
            >
              {lineupPositions[currentPositionIndex] && (
                <span className={styles.playerInfo}>{lineupPositions[currentPositionIndex].name}</span>
              )}
            </div>
          </div>
        );
      }
      rows.push(
        <div key={rows.length} className={styles.playerRow} style={{ gridTemplateColumns: `repeat(${numPlayers}, 1fr)` }}>
          {playerRow}
        </div>
      );
      positionIndex += numPlayers;
    }

    rows.push(
      <div key="gk" className={styles.playerRow} style={{ gridTemplateColumns: '1fr' }}>
        <div
          className={styles.playerContainer}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 0)}
        >
          <div
            className={styles.playerCircle}
            draggable={lineupPositions[0] !== null}
            onDragStart={(e) => handleDragStart(e, lineupPositions[0], 0)}
          >
            {lineupPositions[0] && (
              <span className={styles.playerInfo}>{lineupPositions[0].name}</span>
            )}
          </div>
        </div>
      </div>
    );

    return rows;
  };

  const handleSaveLineup = async () => {
    if (!lineupName) {
      alert('Por favor, dê um nome à sua escalação antes de salvar.');
      return;
    }

    const updatedEscalacao = {
      name: lineupName,
      formation: formation,
      players: lineupPositions,
      date: new Date().toLocaleDateString('pt-BR'),
      leagueId: selectedLeague,
      teamId: selectedTeam,
    };

    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `http://localhost:3001/api/escalacoes/${editId}` : `http://localhost:3001/api/escalacoes`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEscalacao),
      });

      if (response.ok) {
        alert('Escalação salva com sucesso!');
        router.push('/MinhasEscalacoes');
      } else {
        alert('Erro ao salvar a escalação.');
      }
    } catch (error) {
      console.error("Erro ao salvar escalação:", error);
      alert('Erro ao conectar com o servidor.');
    }
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
                {leagues && leagues.map((league) => (
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
                {teams && teams.map((team) => (
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
              {editId ? 'Salvar Edição' : 'Salvar Escalação'}
            </button>
          </div>
        </div>

        <div className={styles.fieldPreviewCard}>
          <div className={styles.formationDisplay}>
            {renderFormation()}
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.playerSelectionCard}>
            <h2 className={styles.playerSelectionTitle}>
              Selecionar Jogadores
            </h2>
            <div
              className={styles.playerGrid}
              onDragOver={handleDragOver}
              onDrop={handleRemovePlayer}
            >
              {players && players.length > 0 ? (
                players.map((player) => (
                  <div
                    key={player.id}
                    className={styles.playerCard}
                    draggable
                    onDragStart={(e) => handleDragStart(e, player, null)}
                  >
                    <FaUserCircle size={24} color="#38702c" />
                    <span className={styles.playerName}>{player.name}</span>
                  </div>
                ))
              ) : (
                <p className={styles.emptyPlayerMessage}>Selecione um time para ver a lista de jogadores.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}