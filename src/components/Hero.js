'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Hero.module.css';

export default function Hero() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/services?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            router.push('/services');
        }
    };

    return (
        <section className={styles.hero}>
            <div className={styles.container}>
                <div className={styles.badge}>✨ Trouvez l'expert qu'il vous faut</div>
                <h1 className={styles.title}>
                    Prendre soin de votre maison
                    <br />
                    n'a jamais été aussi simple.
                </h1>
                <p className={styles.subtitle}>
                    Des experts vérifiés pour le ménage, la plomberie, le jardinage et plus encore.
                    <br />
                    Réservez en quelques clics.
                </p>

                <div className={styles.searchBox}>
                    <div className={styles.searchIcon}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="De quel service avez-vous besoin ? (ex: Ménage, Fuite d'eau...)"
                        className={styles.input}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button className={styles.searchButton} onClick={handleSearch}>Rechercher</button>
                </div>

                <div className={styles.trustBadges}>
                    <div className={styles.badgeItem}>
                        <span className={styles.checkIcon}>✓</span> Professionnels vérifiés
                    </div>
                    <div className={styles.badgeItem}>
                        <span className={styles.checkIcon}>✓</span> Devis gratuit
                    </div>
                    <div className={styles.badgeItem}>
                        <span className={styles.checkIcon}>✓</span> Service client 7j/7
                    </div>
                </div>
            </div>

            {/* Background decoration - Simplified representation of the image background */}
            <div className={styles.bgDecoration}></div>
        </section>
    );
}
