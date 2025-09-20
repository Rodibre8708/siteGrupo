'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

// Ícone de voltar
const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const formationOptions = ['4-4-2', '4-3-3', '4-2-3-1', '3-5-2'];

const getFormationGrid = (formation) => {
  const parts = formation.split('-').map(Number);
  const rows = [];
  
  // Adiciona as linhas de jogadores
  for (let i = parts.length - 1; i >= 0; i--) {
    rows.push(
      <div key={i} className={styles.playerRow} style={{ gridTemplateColumns: `repeat(${parts[i]}, 1fr)` }}>
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
    <div key="gk" className={styles.playerRow} style={{ gridTemplateColumns: '1fr' }}>
      <div className={styles.playerContainer}>
        <div className={styles.playerCircle}></div>
      </div>
    </div>
  );
  
  return rows;
};

export default function CreateLineupPage() {
  const [formation, setFormation] = useState('4-3-3');
  const [lineupName, setLineupName] = useState('');
  const router = useRouter();

  const handleSaveLineup = () => {
    if (!lineupName) {
      alert("Por favor, dê um nome à sua escalação antes de salvar.");
      return;
    }

    const newEscalacao = {
      name: lineupName,
      formation: formation,
      players: [],
      date: new Date().toLocaleDateString('pt-BR'),
    };

    const existingEscalacoes = JSON.parse(localStorage.getItem('escalacoes')) || [];
    const updatedEscalacoes = [...existingEscalacoes, newEscalacao];
    localStorage.setItem('escalacoes', JSON.stringify(updatedEscalacoes));

    router.push('/MinhasEscalacoes');
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
              <select className={styles.inputField}>
                <option value="">Selecione a liga...</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Formação</label>
              <select 
                className={styles.inputField} 
                value={formation}
                onChange={(e) => setFormation(e.target.value)}
              >
                {formationOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
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
              {/* Cards de jogadores virão aqui */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}