import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.mainContainer}>
      <h1 className={styles.title}>Escalação FC</h1>
      <div className={styles.cardsContainer}>
        {/* Card para Criar Nova Escalação */}
        <div className={styles.card}>
          <div>
            <h2 className={styles.cardTitle}>Nova Escalação</h2>
            <p className={styles.cardDescription}>
              Crie uma nova escalação escolhendo liga, formação e seus jogadores favoritos.
            </p>
          </div>
          <Link href="/NovaEscalacao" className={styles.cardButton}>
            Começar Agora
          </Link>
        </div>

        {/* Card para Minhas Escalações (AGORA CORRIGIDO) */}
        <div className={styles.card}>
          <div>
            <h2 className={styles.cardTitle}>Minhas Escalações</h2>
            <p className={styles.cardDescription}>
              Visualize, edite ou delete suas escalações salvas.
            </p>
          </div>
          {/* Corrigido o link para a nova rota */}
          <Link href="/MinhasEscalacoes" className={styles.cardButton}>
            Ver Escalações
          </Link>
        </div>
      </div>
    </div>
  );
}