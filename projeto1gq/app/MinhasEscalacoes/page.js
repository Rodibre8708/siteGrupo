"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import Parse from "../../lib/back4appconfig.js"; // ajuste o caminho se necessário minhas

// Ícones
const BackIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={styles.icon}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
    />
  </svg>
);
const AddIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={styles.icon}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);
const ThreeDotsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={styles.icon}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
    />
  </svg>
);

export default function MinhasEscalacoesPage() {
  const [escalacoes, setEscalacoes] = useState([]);
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState(null);
  const router = useRouter();

  // Buscar escalações no Back4App
  const recarregarEscalacoes = async () => {
    try {
      const Escalacao = Parse.Object.extend("Escalacao");
      const query = new Parse.Query(Escalacao);
      const results = await query.find();

      const data = results.map((e) => ({
        id: e.id,
        name: e.get("name"),
        formation: e.get("formation"),
        date: e.get("date"),
        players: e.get("players"),
      }));

      setEscalacoes(data);
    } catch (error) {
      console.error("Erro ao buscar escalações:", error);
    }
  };

  useEffect(() => {
    recarregarEscalacoes();
  }, []);

  const handleCardClick = (id) => {
    router.push(`/NovaEscalacao?edit=${id}`);
  };

  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setDropdownOpenIndex(dropdownOpenIndex === id ? null : id);
  };

  const handleRename = async (id, e) => {
    e.stopPropagation();
    const newName = window.prompt("Digite o novo nome para a escalação:");
    if (newName && newName.trim() !== "") {
      try {
        const Escalacao = Parse.Object.extend("Escalacao");
        const escalacao = await new Parse.Query(Escalacao).get(id);
        escalacao.set("name", newName);
        await escalacao.save();
        recarregarEscalacoes();
      } catch (error) {
        console.error("Erro ao renomear a escalação:", error);
      }
    }
    setDropdownOpenIndex(null);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Tem certeza de que deseja deletar esta escalação?")) {
      try {
        const Escalacao = Parse.Object.extend("Escalacao");
        const escalacao = await new Parse.Query(Escalacao).get(id);
        await escalacao.destroy();
        recarregarEscalacoes();
      } catch (error) {
        console.error("Erro ao deletar a escalação:", error);
      }
    }
    setDropdownOpenIndex(null);
  };

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
          <p className={styles.emptyMessage}>
            Nenhuma escalação salva. Crie sua primeira escalação!
          </p>
        ) : (
          escalacoes.map((escalacao) => (
            <div
              key={escalacao.id}
              className={styles.lineupCard}
              onClick={() => handleCardClick(escalacao.id)}
            >
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{escalacao.name}</h2>
                <div className={styles.cardActions}>
                  <button
                    className={styles.dropdownButton}
                    onClick={(e) => toggleDropdown(escalacao.id, e)}
                  >
                    <ThreeDotsIcon />
                  </button>
                  {dropdownOpenIndex === escalacao.id && (
                    <div className={styles.dropdownMenu}>
                      <button
                        onClick={(e) => handleRename(escalacao.id, e)}
                        className={styles.menuItem}
                      >
                        Renomear
                      </button>
                      <button
                        onClick={(e) => handleDelete(escalacao.id, e)}
                        className={styles.menuItem}
                      >
                        Deletar
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.cardDetails}>
                <span className={styles.detailItem}>{escalacao.formation}</span>
                <span className={styles.detailItem}>{escalacao.date}</span>
              </div>
              <p className={styles.playerSummary}>
                {escalacao.players &&
                escalacao.players.filter((p) => p).length > 0
                  ? `${
                      escalacao.players.filter((p) => p).length
                    } jogadores selecionados`
                  : "Nenhum jogador selecionado"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
