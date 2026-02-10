
import styles from '../login/login.module.css';

export default function SignupPage() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.loginCard}>
                    <div className={styles.header}>
                        <div className={styles.logoIcon}>🛠️</div>
                        <h1>Créer un compte</h1>
                        <p>Rejoignez Easy Services Djerba dès aujourd'hui</p>
                    </div>

                    <form className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label>Nom complet</label>
                            <input type="text" placeholder="Jean Dupont" required />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Adresse Email</label>
                            <input type="email" placeholder="nom@exemple.com" required />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Numéro de téléphone</label>
                            <input type="tel" placeholder="06 12 34 56 78" required />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Mot de passe</label>
                            <input type="password" placeholder="••••••••" required />
                        </div>

                        <button type="submit" className={styles.submitBtn}>
                            S'inscrire
                        </button>
                    </form>

                    <p className={styles.footer} style={{ marginTop: '2rem' }}>
                        Vous avez déjà un compte ? <a href="/login">Se connecter</a>
                    </p>
                </div>
            </div>
            <div className={styles.background}>
                <div className={styles.blob1}></div>
                <div className={styles.blob2}></div>
            </div>
        </div>
    );
}
