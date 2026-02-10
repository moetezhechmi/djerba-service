
import styles from './HowItWorks.module.css';

export default function HowItWorks() {
    const steps = [
        {
            id: 1,
            title: "1. Recherchez",
            description: "Décrivez votre besoin et parcourez les profils des meilleurs professionnels près de chez vous.",
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            )
        },
        {
            id: 2,
            title: "2. Réservez",
            description: "Choisissez un créneau horaire qui vous convient. La réservation est instantanée.",
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
            )
        },
        {
            id: 3,
            title: "3. Profitez",
            description: "Le professionnel s'occupe de tout. Le paiement est débloqué une fois la prestation validée.",
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
            )
        }
    ];

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>Comment ça marche ?</h2>
                    <p className={styles.subtitle}>Obtenez de l'aide rapidement en suivant ces étapes simples.</p>
                </div>

                <div className={styles.grid}>
                    {steps.map((step) => (
                        <div key={step.id} className={styles.step}>
                            <div className={styles.iconCircle}>
                                {step.icon}
                            </div>
                            <h3 className={styles.stepTitle}>{step.title}</h3>
                            <p className={styles.stepDesc}>{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
