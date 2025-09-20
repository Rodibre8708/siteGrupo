'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

// Ícones para os botões
const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const AddIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export default function MinhasEscalacoesPage() {
  const [escalacoes, setEscalacoes] = useState([]);

  useEffect(() => {
    const savedEscalacoes = JSON.parse(localStorage.getItem('escalacoes')) || [];
    setEscalacoes(savedEscalacoes);
  }, []);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.topBar}>
        <Link href="/" className={styles.backButton}>
          <BackIcon />
          Voltar
        </Link>
        <h1 className={styles.title}>Minhas Escalações</h1>
        <Link href="/NovaEscalacao" className={styles.newButton}>
          <AddIcon />
          Nova Escalação
        </Link>
      </div>

      <div className={styles.contentGrid}>
        {escalacoes.length === 0 ? (
          <p className={styles.emptyMessage}>Nenhuma escalação salva. Crie sua primeira escalação!</p>
        ) : (
          escalacoes.map((escalacao, index) => (
            <div key={index}>
              {/* O card de escalação virá aqui */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}   