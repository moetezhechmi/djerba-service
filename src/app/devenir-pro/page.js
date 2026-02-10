'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './pro.module.css';

export default function DevenirProPage() {
    const [formData, setFormData] = useState({
        name: '',
        service_key: '',
        phone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [services, setServices] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('/api/services');
                const data = await response.json();
                setServices(data);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };
        fetchServices();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.service_key || !formData.phone) {
            alert('Veuillez remplir tous les champs.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/artisans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setShowSuccess(true);
                setFormData({ name: '', service_key: '', phone: '' });
            } else {
                const data = await response.json();
                alert(data.error || 'Une erreur est survenue.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Erreur de connexion au serveur.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.pageWrapper}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.heroLeft}>
                        <div className={styles.badge}>
                            <span>⏱️ Inscription en moins de 2 minutes</span>
                        </div>
                        <h1 className={styles.title}>
                            Inscrivez-vous et <br />
                            <span className={styles.titleBlue}>recevez des missions.</span>
                        </h1>
                        <p className={styles.subtitle}>
                            Démarrez votre activité immédiatement. Nous vous envoyons des missions qualifiées directement selon vos disponibilités. Simple, rapide et efficace.
                        </p>
                        <div className={styles.socialProof}>
                            <div className={styles.avatars}>
                                <div className={styles.avatar}></div>
                                <div className={styles.avatar}></div>
                                <div className={styles.avatar}></div>
                            </div>
                            <span className={styles.socialText}>Rejoignez notre réseau de professionnels</span>
                        </div>
                    </div>

                    <div className={styles.heroRight}>
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Inscription Express</h2>
                            <form className={styles.form} onSubmit={handleSubmit}>
                                <div className={styles.field}>
                                    <label className={styles.label}>Nom complet</label>
                                    <input
                                        type="text"
                                        placeholder="Votre nom et prénom"
                                        className={styles.input}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>Votre métier</label>
                                    <select
                                        className={styles.select}
                                        value={formData.service_key}
                                        onChange={(e) => setFormData({ ...formData, service_key: e.target.value })}
                                        required
                                    >
                                        <option value="">Sélectionnez votre activité</option>
                                        {services.map(s => (
                                            <option key={s.key} value={s.key}>{s.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>Numéro de téléphone</label>
                                    <input
                                        type="tel"
                                        placeholder="06 00 00 00 00"
                                        className={styles.input}
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                    />
                                </div>
                                <button
                                    className={styles.btnSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Envoi en cours...' : 'Recevoir mes premières missions'}
                                </button>
                                <div className={styles.cardFooter}>
                                    <span>✅ Inscription gratuite et sans engagement</span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Join Section */}
            <section className={styles.whySection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Pourquoi nous rejoindre ?</h2>
                    <p className={styles.sectionDesc}>Une solution simple pour booster votre activité sans aucune démarche commerciale.</p>
                </div>

                <div className={styles.grid}>
                    <div className={styles.featCard}>
                        <div className={styles.featIcon}>⚡</div>
                        <h3 className={styles.featTitle}>Missions automatiques</h3>
                        <p className={styles.featDesc}>
                            Travail immédiat. Recevez des missions directement sur votre téléphone. Plus besoin de chercher des clients ou de faire des devis sans lendemain.
                        </p>
                    </div>
                    <div className={styles.featCard}>
                        <div className={styles.featIcon}>📅</div>
                        <h3 className={styles.featTitle}>Planning flexible</h3>
                        <p className={styles.featDesc}>
                            Travaillez quand vous voulez. Vous êtes maître de votre emploi du temps. Activez votre disponibilité selon vos besoins et vos envies.
                        </p>
                    </div>
                    <div className={styles.featCard}>
                        <div className={styles.featIcon}>🏠</div>
                        <h3 className={styles.featTitle}>Inscription gratuite et rapide</h3>
                        <p className={styles.featDesc}>
                            Pas de frais d'entrée ni d'abonnement. Créez votre profil en quelques secondes et accédez immédiatement à nos opportunités.
                        </p>
                    </div>
                </div>
            </section>

            {/* Final CTA Banner */}
            <section className={styles.finalCta}>
                <div className={styles.ctaBanner}>
                    <div className={styles.ctaContent}>
                        <h2 className={styles.ctaTitle}>Prêt à recevoir vos premières missions ?</h2>
                        <p className={styles.ctaText}>
                            Rejoignez la communauté et profitez d'un flux constant de travail sans aucun effort de prospection.
                        </p>
                        <button className={styles.btnCta} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Commencer maintenant</button>
                    </div>
                </div>
            </section>

            {/* Success Modal */}
            {showSuccess && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <div className={styles.successIcon}>🚀</div>
                        </div>
                        <h2 className={styles.modalTitle}>Inscription Reçue !</h2>
                        <p className={styles.modalText}>
                            Bienvenue dans le réseau, <strong>{formData.name || 'Pro'}</strong> ! Votre demande de partenariat a été transmise à notre équipe.
                        </p>
                        <div className={styles.infoCard}>
                            <div className={styles.infoLine}>
                                <span>📋 Statut :</span>
                                <strong style={{ color: '#f59e0b' }}>En cours d'examen</strong>
                            </div>
                            <div className={styles.infoLine}>
                                <span>⏳ Délai :</span>
                                <strong>Moins de 24 heures</strong>
                            </div>
                        </div>
                        <p className={styles.modalSubText}>
                            Un responsable de <strong>Dipanini</strong> vous contactera par téléphone pour valider votre profil.
                        </p>
                        <button
                            className={styles.modalBtn}
                            onClick={() => window.location.href = '/'}
                        >
                            Retour à l'accueil
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
