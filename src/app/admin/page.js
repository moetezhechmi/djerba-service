'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './admin.module.css';

export default function AdminLoginPage() {
    const router = useRouter();
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if already logged in
        const isAdmin = localStorage.getItem('isAdmin');
        if (isAdmin === 'true') {
            router.push('/admin/dashboard');
        }
    }, [router]);

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simple hardcoded auth for demo/dev purposes
        // In production, this should be a call to an API route with JWT
        if (credentials.username === 'admin' && credentials.password === 'admin2026') {
            localStorage.setItem('isAdmin', 'true');
            router.push('/admin/dashboard');
        } else {
            setError('Identifiants incorrects. Veuillez réessayer.');
            setLoading(false);
        }
    };

    return (
        <div className={styles.adminWrapper}>
            <div className={styles.loginCard}>
                <div className={styles.header}>
                    <span className={styles.logo}>DP</span>
                    <h1 className={styles.title}>Administration</h1>
                    <p className={styles.subtitle}>Connectez-vous pour gérer Dipanini</p>
                </div>

                <form className={styles.form} onSubmit={handleLogin}>
                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.field}>
                        <label className={styles.label}>Nom d'utilisateur</label>
                        <input
                            type="text"
                            name="username"
                            className={styles.input}
                            placeholder="admin"
                            value={credentials.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Mot de passe</label>
                        <input
                            type="password"
                            name="password"
                            className={styles.input}
                            placeholder="••••••••"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.btnSubmit} disabled={loading}>
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

                <div className={styles.footer}>
                    <Link href="/" className={styles.backLink}>
                        ← Retour au site
                    </Link>
                </div>
            </div>
        </div>
    );
}
