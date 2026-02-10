
import styles from './login.module.css';

export default function LoginPage() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.loginCard}>
                    <div className={styles.header}>
                        <div className={styles.logoIcon}>🛠️</div>
                        <h1>Bon retour parmi nous</h1>
                        <p>Connectez-vous pour gérer vos services</p>
                    </div>

                    <form className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label>Adresse Email</label>
                            <input type="email" placeholder="nom@exemple.com" required />
                        </div>

                        <div className={styles.inputGroup}>
                            <div className={styles.labelRow}>
                                <label>Mot de passe</label>
                                <a href="#" className={styles.forgot}>Oublié ?</a>
                            </div>
                            <input type="password" placeholder="••••••••" required />
                        </div>

                        <button type="submit" className={styles.submitBtn}>
                            Se connecter
                        </button>
                    </form>



                    <p className={styles.footer}>
                        Pas encore de compte ? <a href="/signup">S'inscrire gratuitement</a>
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
