'use client';

import { useState, useEffect } from 'react';
import styles from './Services.module.css';
import Link from 'next/link';

export default function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('/api/services');
                const data = await response.json();
                setServices(data.slice(0, 4)); // Show top 4 popular
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    if (loading) return null; // Or skeleton

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>Services Populaires</h2>
                </div>

                <div className={styles.grid}>
                    {services.map((service) => (
                        <Link key={service.key} href={`/request/${service.key}`} className={styles.card}>
                            <div
                                className={styles.iconBox}
                                style={{ backgroundColor: service.bgColor, color: service.iconColor, fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                {service.icon}
                            </div>
                            <h3 className={styles.cardTitle}>{service.title}</h3>
                            <p className={styles.cardDesc}>{service.desc}</p>
                        </Link>
                    ))}
                </div>

                <div className={styles.footerLink}>
                    <Link href="/services" className={styles.viewAll}>
                        Voir toutes les catégories <span>→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
