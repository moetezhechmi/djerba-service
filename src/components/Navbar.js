
'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <div className={styles.logoArea}>
                    <Link href="/" className={styles.logo} onClick={() => setIsOpen(false)}>
                        <img src="/logo.jpeg" alt="Easy Services Djerba" className={styles.logoImg} />
                        <span className={styles.logoText}>Easy Services Djerba</span>
                    </Link>
                </div>

                <button
                    className={styles.hamburger}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Menu"
                >
                    <div className={`${styles.bar} ${isOpen ? styles.bar1 : ''}`}></div>
                    <div className={`${styles.bar} ${isOpen ? styles.bar2 : ''}`}></div>
                    <div className={`${styles.bar} ${isOpen ? styles.bar3 : ''}`}></div>
                </button>

                <div className={`${styles.links} ${isOpen ? styles.linksOpen : ''}`}>
                    <Link href="/services" className={styles.link} onClick={() => setIsOpen(false)}>Services</Link>
                    <Link href="/about" className={styles.link} onClick={() => setIsOpen(false)}>À propos</Link>
                    <Link href="/devenir-pro" className={styles.link} onClick={() => setIsOpen(false)}>Devenir un Pro</Link>

                    <div className={styles.auth}>
                        <Link href="/services" className={styles.signup} onClick={() => setIsOpen(false)}>Réserver</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
