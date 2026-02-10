'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './services.module.css';

function ServicesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('q') || '';
    const [selectedService, setSelectedService] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('/api/services');
                const data = await response.json();
                setServices(data);
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const filteredServices = services.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleNext = () => {
        if (selectedService) {
            router.push(`/request/${selectedService.key}`);
        }
    };

    const handleCancel = () => {
        router.push('/');
    };

    const clearSearch = () => {
        router.push('/services');
    };

    return (
        <div className={styles.pageWrapper}>
            {/* Header */}
            <div className={styles.header}>
                <button className={styles.backBtn} onClick={handleCancel}>←</button>
                <div style={{ textAlign: 'center' }}>
                    <div className={styles.stepInfo}>Étape 1 sur 4</div>
                    <div className={styles.headerTitle}>CATÉGORIE DE SERVICE</div>
                </div>
                <div className={styles.progressBarContainer}>
                    <div className={styles.progressBar}></div>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.contentContainer}>
                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.loaderIcon}>🛠️</div>
                        <p>Chargement des services...</p>
                    </div>
                ) : (
                    <>
                        {searchQuery ? (
                            <div className={styles.searchHeader}>
                                <h1 className={styles.mainTitle}>Résultats pour "{searchQuery}"</h1>
                                <button className={styles.clearSearch} onClick={clearSearch}>Voir tous les services</button>
                            </div>
                        ) : (
                            <>
                                <h1 className={styles.mainTitle}>De quel type de service avez-vous besoin ?</h1>
                                <p className={styles.subTitle}>Choisissez une catégorie pour découvrir nos prestations et obtenir une estimation immédiate.</p>
                            </>
                        )}

                        {filteredServices.length > 0 ? (
                            <div className={styles.grid}>
                                {filteredServices.map((service) => (
                                    <div
                                        key={service.key}
                                        className={`${styles.card} ${selectedService?.key === service.key ? styles.selectedCard : ''}`}
                                        onClick={() => setSelectedService(service)}
                                    >
                                        {selectedService?.key === service.key && (
                                            <div className={styles.checkIcon}>✓</div>
                                        )}
                                        <div className={styles.iconCircle} style={{ background: service.bgColor, color: service.iconColor }}>
                                            {service.icon}
                                        </div>
                                        <h3 className={styles.cardTitle}>{service.title}</h3>
                                        <p className={styles.cardDesc}>{service.desc}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.noResults}>
                                <div className={styles.noResultsIcon}>🔍</div>
                                <h3>Aucun service trouvé</h3>
                                <p>Désolé, nous n'avons pas trouvé de catégorie correspondant à votre recherche.</p>
                                <button className={styles.btnReset} onClick={clearSearch}>Voir tous les services</button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Sticky Footer */}
            {selectedService && (
                <div className={styles.stickyFooter}>
                    <div className={styles.footerInfo}>
                        <div className={styles.footerIcon} style={{ background: selectedService.bgColor, color: selectedService.iconColor }}>
                            {selectedService.icon}
                        </div>
                        <div className={styles.footerText}>
                            <strong>{selectedService.title}</strong>
                            <p>Catégorie sélectionnée</p>
                        </div>
                    </div>
                    <div className={styles.footerActions}>
                        <button className={styles.btnCancel} onClick={() => setSelectedService(null)}>Annuler</button>
                        <button className={styles.btnNext} onClick={handleNext}>Suivant <span>→</span></button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ServicesPage() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <ServicesContent />
        </Suspense>
    );
}
