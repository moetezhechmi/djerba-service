'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    const [requests, setRequests] = useState([]);
    const [artisans, setArtisans] = useState([]);
    const [services, setServices] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [editingService, setEditingService] = useState(null);

    const refreshData = async () => {
        setIsRefreshing(true);
        try {
            const [reqRes, artRes, serRes] = await Promise.all([
                fetch('/api/requests'),
                fetch('/api/artisans'),
                fetch('/api/services')
            ]);
            const [reqData, artData, serData] = await Promise.all([
                reqRes.json(),
                artRes.json(),
                serRes.json()
            ]);
            setRequests(Array.isArray(reqData) ? reqData : []);
            setArtisans(Array.isArray(artData) ? artData : []);
            setServices(Array.isArray(serData) ? serData : []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsRefreshing(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (isAdmin !== 'true') {
            router.push('/admin');
            return;
        }
        refreshData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        router.push('/admin');
    };

    // --- Actions ---
    const handleUpdateRequestStatus = async (id, status) => {
        try {
            await fetch(`/api/requests/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            refreshData();
        } catch (error) { alert('Erreur'); }
    };

    const handleUpdateArtisanStatus = async (id, status) => {
        try {
            await fetch(`/api/artisans/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            refreshData();
        } catch (error) { alert('Erreur'); }
    };

    const stats = useMemo(() => {
        const pendingRequests = requests.filter(r => r.status === 'pending').length;
        const totalRevenue = requests.filter(r => r.status === 'completed').reduce((sum, r) => sum + (r.total_price || 0), 0);
        const activeArtisans = artisans.filter(a => a.status === 'verified').length;
        const totalRequests = requests.length;
        return { pendingRequests, totalRevenue, activeArtisans, totalRequests };
    }, [requests, artisans]);

    if (loading) return null;

    return (
        <div className={styles.dashboardWrapper}>
            {/* SIDEBAR - ALWAYS VISIBLE */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <span className={styles.logoIcon}>🛠️</span>
                    <span className={styles.sidebarTitle}>TailAdmin</span>
                </div>

                <div className={styles.navSection}>
                    <div className={styles.sectionLabel}>Menu Principal</div>
                    <nav className={styles.nav}>
                        <button className={`${styles.navItem} ${activeTab === 'overview' ? styles.activeNavItem : ''}`} onClick={() => setActiveTab('overview')}>
                            <span>📊</span> Dashboard
                        </button>
                        <button className={`${styles.navItem} ${activeTab === 'requests' ? styles.activeNavItem : ''}`} onClick={() => setActiveTab('requests')}>
                            <span>📋</span> Missions
                        </button>
                        <button className={`${styles.navItem} ${activeTab === 'artisans' ? styles.activeNavItem : ''}`} onClick={() => setActiveTab('artisans')}>
                            <span>👷</span> Artisans
                        </button>
                        <button className={`${styles.navItem} ${activeTab === 'services' ? styles.activeNavItem : ''}`} onClick={() => setActiveTab('services')}>
                            <span>⚙️</span> Services
                        </button>
                    </nav>
                </div>

                <button className={`${styles.navItem} ${styles.logoutBtn}`} onClick={handleLogout}>
                    <span>🚪</span> Déconnexion
                </button>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className={styles.mainContent}>
                {/* TOP HEADER */}
                <header className={styles.topHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div className={styles.searchBox}>
                            <span>🔍</span>
                            <input type="text" placeholder="Rechercher une mission, un artisan..." />
                        </div>
                    </div>

                    <div className={styles.userMenu}>
                        <div className={styles.userRole}>
                            <span className={styles.userName}>Administrateur</span>
                            <span className={styles.userTitle}>Gestionnaire</span>
                        </div>
                        <div className={styles.avatar}>A</div>
                    </div>
                </header>

                <div className={styles.pageContent}>
                    {/* STATS */}
                    <div className={styles.statsGrid}>
                        <StatCard icon="💰" value={`${stats.totalRevenue} DT`} title="Total Ventes" />
                        <StatCard icon="📋" value={stats.totalRequests} title="Total Missions" />
                        <StatCard icon="⏳" value={stats.pendingRequests} title="En attente" />
                        <StatCard icon="👷" value={stats.activeArtisans} title="Pros Actifs" />
                    </div>

                    {/* CONTENT COMPONENTS */}
                    {activeTab === 'overview' && <RecentMissions requests={requests} onUpdate={handleUpdateRequestStatus} />}
                    {activeTab === 'requests' && <MissionsTable requests={requests} onUpdate={handleUpdateRequestStatus} />}
                    {activeTab === 'artisans' && <ArtisansTable artisans={artisans} onUpdate={handleUpdateArtisanStatus} />}
                    {activeTab === 'services' && <ServicesList services={services} />}
                </div>
            </main>
        </div>
    );
}

function StatCard({ icon, value, title }) {
    return (
        <div className={styles.statCard}>
            <div className={styles.statIconBox}>{icon}</div>
            <div className={styles.statValue}>{value}</div>
            <div className={styles.statTitle}>{title}</div>
        </div>
    );
}

function RecentMissions({ requests, onUpdate }) {
    const ITEMS_PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const displayedRequests = requests.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className={styles.dataCard}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Dernières Missions</h2>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Client</th>
                        <th>Date</th>
                        <th>Service</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedRequests.map(req => (
                        <tr key={req._id}>
                            <td><strong>{req.client_name}</strong></td>
                            <td>{req.date}</td>
                            <td>{req.sub_service}</td>
                            <td><span className={`${styles.badge} ${styles[req.status] || styles.pending}`}>{req.status}</span></td>
                            <td>
                                <select
                                    className={styles.btnAction}
                                    style={{ background: '#F1F5F9', color: '#1C2434', border: '1px solid #E2E8F0' }}
                                    value={req.status}
                                    onChange={(e) => onUpdate(req._id, e.target.value)}
                                >
                                    <option value="pending">En attente</option>
                                    <option value="confirmed">Confirmé</option>
                                    <option value="completed">Terminé</option>
                                    <option value="cancelled">Annulé</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.pageBtn}
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        Précédent
                    </button>

                    <div className={styles.pageNumbers}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                            <button
                                key={num}
                                className={`${styles.pageBtn} ${currentPage === num ? styles.activePage : ''}`}
                                onClick={() => setCurrentPage(num)}
                            >
                                {num}
                            </button>
                        ))}
                    </div>

                    <button
                        className={styles.pageBtn}
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        Suivant
                    </button>
                </div>
            )}
        </div>
    );
}

function MissionsTable({ requests, onUpdate }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    // Filter logic
    const filteredRequests = useMemo(() => {
        return requests.filter(req => {
            const matchesSearch =
                req.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                req.sub_service?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || req.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [requests, searchTerm, statusFilter]);

    // Reset pagination on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const displayedRequests = filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className={styles.dataCard}>
            <div className={styles.cardHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 className={styles.cardTitle}>Gestion des Missions</h2>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {/* Search Input */}
                    <div className={styles.searchBox} style={{ border: '1px solid #E2E8F0', padding: '0.4rem 0.8rem', borderRadius: '4px', width: '250px' }}>
                        <span>🔍</span>
                        <input
                            type="text"
                            placeholder="Client ou service..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ fontSize: '0.85rem' }}
                        />
                    </div>

                    {/* Status Dropdown */}
                    <select
                        className={styles.btnAction}
                        style={{ background: '#fff', color: '#1C2434', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmé</option>
                        <option value="completed">Terminé</option>
                        <option value="cancelled">Annulé</option>
                    </select>
                </div>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Client</th>
                        <th>Date</th>
                        <th>Service</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedRequests.length > 0 ? displayedRequests.map(req => (
                        <tr key={req._id}>
                            <td><strong>{req.client_name}</strong></td>
                            <td>{req.date}</td>
                            <td>{req.sub_service}</td>
                            <td><span className={`${styles.badge} ${styles[req.status] || styles.pending}`}>{req.status}</span></td>
                            <td>
                                <select
                                    className={styles.btnAction}
                                    style={{ background: '#F1F5F9', color: '#1C2434', border: '1px solid #E2E8F0', padding: '0.3rem' }}
                                    value={req.status}
                                    onChange={(e) => onUpdate(req._id, e.target.value)}
                                >
                                    <option value="pending">En attente</option>
                                    <option value="confirmed">Confirmé</option>
                                    <option value="completed">Terminé</option>
                                    <option value="cancelled">Annulé</option>
                                </select>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                                Aucune mission correspondant à vos filtres.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.pageBtn}
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        Précédent
                    </button>

                    <div className={styles.pageNumbers}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                            <button
                                key={num}
                                className={`${styles.pageBtn} ${currentPage === num ? styles.activePage : ''}`}
                                onClick={() => setCurrentPage(num)}
                            >
                                {num}
                            </button>
                        ))}
                    </div>

                    <button
                        className={styles.pageBtn}
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        Suivant
                    </button>
                </div>
            )}
        </div>
    );
}

function ArtisansTable({ artisans, onUpdate }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [specialtyFilter, setSpecialtyFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    // Get unique specialties for the filter dropdown
    const specialties = useMemo(() => {
        const specs = new Set(artisans.map(a => a.service_key).filter(Boolean));
        return Array.from(specs).sort();
    }, [artisans]);

    // Filter logic
    const filteredArtisans = useMemo(() => {
        return artisans.filter(art => {
            const matchesSearch = art.name?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || art.status === statusFilter;
            const matchesSpecialty = specialtyFilter === 'all' || art.service_key === specialtyFilter;

            return matchesSearch && matchesStatus && matchesSpecialty;
        });
    }, [artisans, searchTerm, statusFilter, specialtyFilter]);

    // Reset pagination on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, specialtyFilter]);

    const totalPages = Math.ceil(filteredArtisans.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const displayedArtisans = filteredArtisans.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className={styles.dataCard}>
            <div className={styles.cardHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 className={styles.cardTitle}>Artisans</h2>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Search Input */}
                    <div className={styles.searchBox} style={{ border: '1px solid #E2E8F0', padding: '0.4rem 0.8rem', borderRadius: '4px', width: '200px' }}>
                        <span>🔍</span>
                        <input
                            type="text"
                            placeholder="Rechercher un nom..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ fontSize: '0.85rem' }}
                        />
                    </div>

                    {/* Specialty Filter */}
                    <select
                        className={styles.btnAction}
                        style={{ background: '#fff', color: '#1C2434', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}
                        value={specialtyFilter}
                        onChange={(e) => setSpecialtyFilter(e.target.value)}
                    >
                        <option value="all">Toutes spécialités</option>
                        {specialties.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                        ))}
                    </select>

                    {/* Status Dropdown */}
                    <select
                        className={styles.btnAction}
                        style={{ background: '#fff', color: '#1C2434', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="pending">En attente</option>
                        <option value="verified">Vérifié</option>
                    </select>
                </div>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr><th>Nom</th><th>Spécialité</th><th>Téléphone</th><th>Statut</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {displayedArtisans.length > 0 ? displayedArtisans.map(art => (
                        <tr key={art._id}>
                            <td><strong>{art.name}</strong></td>
                            <td>{art.service_key}</td>
                            <td>{art.phone || 'Non renseigné'}</td>
                            <td><span className={`${styles.badge} ${art.status === 'verified' ? styles.completed : styles.pending}`}>{art.status}</span></td>
                            <td>
                                <button className={styles.btnAction} style={{ padding: '0.4rem 0.8rem' }} onClick={() => onUpdate(art._id, art.status === 'verified' ? 'pending' : 'verified')}>
                                    {art.status === 'verified' ? 'Suspendre' : 'Valider'}
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                                Aucun artisan correspondant à ces critères.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.pageBtn}
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        Précédent
                    </button>

                    <div className={styles.pageNumbers}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                            <button
                                key={num}
                                className={`${styles.pageBtn} ${currentPage === num ? styles.activePage : ''}`}
                                onClick={() => setCurrentPage(num)}
                            >
                                {num}
                            </button>
                        ))}
                    </div>

                    <button
                        className={styles.pageBtn}
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        Suivant
                    </button>
                </div>
            )}
        </div>
    );
}

function ServicesList({ services }) {
    return (
        <div className={styles.servicesGrid}>
            {services.map(s => (
                <div key={s.key} className={styles.serviceItem}>
                    <div className={styles.serviceInfo}>
                        <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                        <div>
                            <div style={{ fontWeight: 600 }}>{s.title}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{s.sub_services?.length} prestations</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
