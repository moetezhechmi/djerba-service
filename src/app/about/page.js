'use client';

import styles from './about.module.css';

export default function AboutPage() {
    return (
        <div className={styles.pageWrapper}>
            <main>
                {/* HERO SECTION */}
                <section className={styles.hero}>
                    <div className={styles.badge}>Notre Histoire</div>
                    <h1 className={styles.title}>
                        Simplifier la gestion de votre maison, <span className={styles.highlight}>un service à la fois.</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Dipanini est née d'une idée simple : rendre les services à domicile accessibles, transparents et d'une qualité irréprochable pour tout le monde.
                    </p>
                </section>

                {/* MISSION SECTION */}
                <section className={styles.section}>
                    <div className={styles.grid}>
                        <div className={styles.textContent}>
                            <h2 className={styles.sectionTitle}>Notre Mission</h2>
                            <p className={styles.text}>
                                Notre mission est de transformer la façon dont vous entretenez votre espace de vie. Nous croyons que votre temps est précieux et que trouver un professionnel de confiance ne devrait pas être un parcours du combattant.
                                <br /><br />
                                En combinant technologie moderne et expertise humaine, <span className={styles.highlight}>Dipanini</span> connecte les meilleurs prestataires aux foyers exigeants.
                            </p>
                        </div>
                        <div className={styles.imagePlaceholder}>
                            🤝
                        </div>
                    </div>
                </section>

                {/* VALUES SECTION */}
                <section className={styles.valuesSection}>
                    <div className={styles.valuesHeader}>
                        <h2 className={styles.sectionTitle} style={{ color: 'white' }}>Nos Valeurs Fondamentales</h2>
                        <p className={styles.text} style={{ color: '#94a3b8' }}>Ce qui nous guide au quotidien.</p>
                    </div>

                    <div className={styles.valuesGrid}>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>💎</div>
                            <h3 className={styles.valueTitle}>Excellence</h3>
                            <p className={styles.valueDesc}>Nous sélectionnons rigoureusement chaque professionnel pour garantir un service qui dépasse vos attentes.</p>
                        </div>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>🛡️</div>
                            <h3 className={styles.valueTitle}>Confiance</h3>
                            <p className={styles.valueDesc}>La sécurité est notre priorité. Tous nos prestataires sont vérifiés et suivis en temps réel.</p>
                        </div>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>⚡</div>
                            <h3 className={styles.valueTitle}>Rapidité</h3>
                            <p className={styles.valueDesc}>Réservez en 2 minutes et recevez une confirmation immédiate pour vos interventions.</p>
                        </div>
                    </div>
                </section>

                {/* CONTACT SECTION */}
                <section className={styles.contactSection}>
                    <div className={styles.contactCard}>
                        <div className={styles.contactInfo}>
                            <h3 className={styles.sectionTitle}>Contactez-nous</h3>
                            <p className={styles.text} style={{ marginBottom: '2.5rem' }}>
                                Une question ou un projet particulier ? Notre équipe est à votre écoute pour vous accompagner.
                            </p>

                            <div className={styles.infoItem}>
                                <div className={styles.infoIcon}>📞</div>
                                <div className={styles.infoDetail}>
                                    <strong>Téléphone</strong>
                                    <span>+216 29 334 197</span>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <div className={styles.infoIcon}>✉️</div>
                                <div className={styles.infoDetail}>
                                    <strong>Email</strong>
                                    <span>contact@dipanini.com</span>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <div className={styles.infoIcon}>📍</div>
                                <div className={styles.infoDetail}>
                                    <strong>Localisation</strong>
                                    <span>Djerba, Tunisie</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.imagePlaceholder}>
                            🏠
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
