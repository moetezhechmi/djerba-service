'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

const ITEMS_PER_PAGE = 8;

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('requests');
    const [data, setData] = useState({
        requests: [],
        artisans: [],
        services: []
    });
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Pagination & Search States
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Editing States
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const refreshData = async () => {
        try {
            const [reqRes, artRes, serRes] = await Promise.all([
                fetch('/api/requests'),
                fetch('/api/artisans'),
                fetch('/api/services')
            ]);
            const [requests, artisans, services] = await Promise.all([
                reqRes.json(),
                artRes.json(),
                serRes.json()
            ]);
            setData({ requests: requests.reverse(), artisans, services });
        } catch (error) {
            console.error('Refresh error:', error);
        }
    };

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (isAdmin !== 'true') {
            router.push('/admin');
            return;
        }
        refreshData().then(() => setLoading(false));
    }, [router]);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchTerm]);

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        router.push('/admin');
    };

    const handleUpdateArtisanStatus = async (id, status) => {
        try {
            const res = await fetch(`/api/artisans/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) refreshData();
        } catch (error) {
            console.error('Update status error:', error);
        }
    };

    const handleUpdateRequestStatus = async (id, status) => {
        try {
            const res = await fetch(`/api/requests/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                // If confirmed, send WhatsApp message
                if (status === 'confirmed') {
                    const req = data.requests.find(r => (r._id || r.id) === id);
                    if (req) {
                        const phone = req.client_phone.replace(/\s/g, '');
                        // Add Tunisia prefix if missing and if it looks like a local number
                        const formattedPhone = (phone.length === 8) ? `216${phone}` : phone;

                        const message = `Bonjour ${req.client_name}, votre demande pour le service *${req.service_key.toUpperCase()}* (${req.sub_service}) prévue le *${req.date}* à *${req.time}* a été ✅ *confirmée*. Un artisan de Dipanini vous contactera prochainement. Merci de votre confiance !`;

                        const encodedMsg = encodeURIComponent(message);
                        window.open(`https://wa.me/${formattedPhone}?text=${encodedMsg}`, '_blank');
                    }
                }
                refreshData();
            }
        } catch (error) {
            console.error('Update request status error:', error);
        }
    };

    const handleSaveService = async (service) => {
        const isNew = !data.services.find(s => s.key === service.key);
        const url = isNew ? '/api/services' : `/api/services/${service.key}`;
        const method = isNew ? 'POST' : 'PUT';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(service)
            });
            if (res.ok) {
                setShowModal(false);
                setEditingItem(null);
                refreshData();
            } else {
                const err = await res.json();
                alert(err.error || 'Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error('Save service error:', error);
        }
    };

    const handleDeleteService = async (key) => {
        if (!confirm('Supprimer ce service ? Cette action est irréversible.')) return;
        try {
            const res = await fetch(`/api/services/${key}`, { method: 'DELETE' });
            if (res.ok) refreshData();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    // Filtering logic
    const filteredData = useMemo(() => {
        const list = data[activeTab] || [];
        if (!searchTerm) return list;

        const term = searchTerm.toLowerCase();
        return list.filter(item => {
            if (activeTab === 'requests') {
                return item.client_name?.toLowerCase().includes(term) ||
                    item.service_key?.toLowerCase().includes(term) ||
                    item.sub_service?.toLowerCase().includes(term);
            }
            if (activeTab === 'artisans') {
                return item.name?.toLowerCase().includes(term) ||
                    item.service_key?.toLowerCase().includes(term);
            }
            if (activeTab === 'services') {
                return item.title?.toLowerCase().includes(term) ||
                    item.desc?.toLowerCase().includes(term);
            }
            return false;
        });
    }, [data, activeTab, searchTerm]);

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const currentItems = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    if (loading) return (
        <div className={styles.loading}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚙️</div>
                <p style={{ fontWeight: 700 }}>Chargement du panneau d'administration...</p>
            </div>
        </div>
    );

    const stats = [
        { title: 'Demandes', value: data.requests.length, icon: '📋', color: '#eff6ff', textColor: '#3b82f6', trend: '+12%' },
        { title: 'Artisans', value: data.artisans.length, icon: '👷', color: '#fef3c7', textColor: '#d97706', trend: 'Actifs' },
        { title: 'Services', value: data.services.length, icon: '🛠️', color: '#f0fdf4', textColor: '#16a34a', trend: 'En ligne' },
        { title: 'Revenus', value: `${data.requests.reduce((acc, curr) => acc + (curr.total_price || 0), 0)} DT`, icon: '💰', color: '#fce7f3', textColor: '#db2777', trend: 'Total' }
    ];

    return (
        <div className={styles.dashboardWrapper}>
            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${!isSidebarOpen ? styles.sidebarClosed : ''}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logoIcon}>DP</div>
                    {isSidebarOpen && <h2 className={styles.sidebarTitle}>Dipanini Admin</h2>}
                </div>

                <nav className={styles.nav}>
                    <button
                        className={`${styles.navItem} ${activeTab === 'requests' ? styles.activeNavItem : ''}`}
                        onClick={() => setActiveTab('requests')}
                    >
                        <span>📋</span> {isSidebarOpen && 'Demandes'}
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === 'artisans' ? styles.activeNavItem : ''}`}
                        onClick={() => setActiveTab('artisans')}
                    >
                        <span>👷</span> {isSidebarOpen && 'Professionnels'}
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === 'services' ? styles.activeNavItem : ''}`}
                        onClick={() => setActiveTab('services')}
                    >
                        <span>🛠️</span> {isSidebarOpen && 'Services'}
                    </button>
                </nav>

                <button className={`${styles.navItem} ${styles.logoutBtn}`} onClick={handleLogout}>
                    <span>🚪</span> {isSidebarOpen && 'Déconnexion'}
                </button>
            </aside>

            {/* Main Content */}
            <main className={`${styles.mainContent} ${!isSidebarOpen ? styles.mainContentExpanded : ''}`}>
                <div className={styles.topBar}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <button className={styles.toggleBtn} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            {isSidebarOpen ? '⇠' : '⇢'}
                        </button>
                        <h1 className={styles.pageTitle}>Dashboard Overview</h1>
                    </div>
                    <div className={styles.adminProfile}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 800, color: '#0f172a' }}>Admin Central</div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Statut: Super Admin</div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className={styles.statsGrid}>
                    {stats.map((stat, i) => (
                        <div key={i} className={styles.statCard}>
                            <div className={styles.statTop}>
                                <div className={styles.statIcon} style={{ background: stat.color, color: stat.textColor }}>
                                    {stat.icon}
                                </div>
                                <span className={styles.statTrend}>{stat.trend}</span>
                            </div>
                            <div className={styles.statInfo}>
                                <h3>{stat.title}</h3>
                                <div className={styles.statNumber}>{stat.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Data Table */}
                <div className={styles.tableCard}>
                    <div className={styles.tableHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <h2 className={styles.tableTitle}>
                                {activeTab === 'requests' && 'Journal des Demandes'}
                                {activeTab === 'artisans' && 'Annuaire des Pros'}
                                {activeTab === 'services' && 'Gestion du Catalogue'}
                            </h2>
                            {activeTab === 'services' && (
                                <button className={styles.btnAdd} onClick={() => { setEditingItem(null); setShowModal(true); }}>
                                    + Ajouter un Service
                                </button>
                            )}
                        </div>
                        <div className={styles.searchBar}>
                            <span>🔍</span>
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                className={styles.searchInput}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {activeTab === 'requests' && (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Client</th>
                                    <th>Prestation</th>
                                    <th>Planification</th>
                                    <th>Montant</th>
                                    <th>Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.length > 0 ? currentItems.map((req) => (
                                    <tr key={req.id}>
                                        <td>
                                            <span className={styles.clientName}>{req.client_name}</span>
                                            <span className={styles.clientSub}>{req.client_phone}</span>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 700 }}>{req.service_key.toUpperCase()}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{req.sub_service}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{req.date}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{req.time} ({req.frequency})</div>
                                        </td>
                                        <td><span className={styles.priceTag}>{req.total_price} DT</span></td>
                                        <td>
                                            <select
                                                className={styles.statusSelect}
                                                value={req.status || 'pending'}
                                                onChange={(e) => handleUpdateRequestStatus(req._id || req.id, e.target.value)}
                                            >
                                                <option value="pending">⏳ En attente</option>
                                                <option value="confirmed">✅ Confirmé</option>
                                                <option value="completed">🎉 Terminé</option>
                                                <option value="cancelled">❌ Annulé</option>
                                            </select>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className={styles.emptyState}>Aucun résultat trouvé.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'artisans' && (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nom du Pro</th>
                                    <th>Activité</th>
                                    <th>Coordonnées</th>
                                    <th>Statut de Validation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.length > 0 ? currentItems.map((art) => (
                                    <tr key={art._id}>
                                        <td><span className={styles.clientName}>{art.name}</span></td>
                                        <td><span className={styles.statusBadge} style={{ background: '#f1f5f9', color: '#475569' }}>{art.service_key}</span></td>
                                        <td>{art.phone}</td>
                                        <td>
                                            <select
                                                className={styles.statusSelect}
                                                value={art.status || 'pending'}
                                                onChange={(e) => handleUpdateArtisanStatus(art._id, e.target.value)}
                                            >
                                                <option value="pending">⏳ En attente</option>
                                                <option value="verified">✅ Vérifié</option>
                                                <option value="suspended">🚫 Suspendu</option>
                                            </select>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className={styles.emptyState}>Aucun professionnel trouvé.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'services' && (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Catégorie</th>
                                    <th>Description</th>
                                    <th>Outils</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((ser) => (
                                    <tr key={ser.key}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <span className={styles.statIcon} style={{ width: 40, height: 40, fontSize: '1.2rem', background: '#f8fafc' }}>{ser.icon}</span>
                                                <div className={styles.clientName}>{ser.title}</div>
                                            </div>
                                        </td>
                                        <td><p style={{ maxWidth: 300, fontSize: '0.85rem' }}>{ser.desc}</p></td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.8rem' }}>
                                                <button className={styles.actionIcon} onClick={() => { setEditingItem(ser); setShowModal(true); }}>✏️</button>
                                                <button className={styles.actionIcon} onClick={() => handleDeleteService(ser.key)}>🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* Pagination Bar */}
                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <div className={styles.paginationInfo}>
                                Affichage de {((currentPage - 1) * ITEMS_PER_PAGE) + 1} à {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} sur {filteredData.length} résultats
                            </div>
                            <div className={styles.paginationBtns}>
                                <button className={styles.pageBtn} onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>‹</button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button key={i} className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.activePageBtn : ''}`} onClick={() => setCurrentPage(i + 1)}>
                                        {i + 1}
                                    </button>
                                ))}
                                <button className={styles.pageBtn} onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>›</button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Service Modal */}
            {showModal && (
                <ServiceModal
                    item={editingItem}
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveService}
                />
            )}
        </div>
    );
}

function ServiceModal({ item, onClose, onSave }) {
    const [formData, setFormData] = useState(item || {
        key: '',
        title: '',
        desc: '',
        icon: '🛠️',
        bgColor: '#eff6ff',
        iconColor: '#3b82f6',
        sub_services: []
    });

    const addSubService = () => {
        setFormData({
            ...formData,
            sub_services: [
                ...formData.sub_services,
                { id: Date.now().toString(), title: '', desc: '', price: 0, unit: 'FORFAIT', icon: '⚡' }
            ]
        });
    };

    const removeSubService = (id) => {
        setFormData({
            ...formData,
            sub_services: formData.sub_services.filter(s => s.id !== id)
        });
    };

    const updateSubService = (id, field, value) => {
        setFormData({
            ...formData,
            sub_services: formData.sub_services.map(s => s.id === id ? { ...s, [field]: value } : s)
        });
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>{item ? 'Modifier Service' : 'Nouveau Service'}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Clé Unique (ex: plomberie)</label>
                    <input
                        className={styles.formInput}
                        value={formData.key}
                        onChange={e => setFormData({ ...formData, key: e.target.value })}
                        disabled={!!item}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Titre</label>
                    <input className={styles.formInput} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Description</label>
                    <textarea className={styles.formTextarea} rows="2" value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Icône Emoji</label>
                        <input className={styles.formInput} value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} />
                    </div>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <h3 className={styles.formLabel}>Sous-services / Prestations</h3>
                    {formData.sub_services.map((sub, idx) => (
                        <div key={sub.id} className={styles.subItem}>
                            <button className={styles.removeSub} onClick={() => removeSubService(sub.id)}>×</button>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '0.5rem' }}>
                                <input placeholder="Nom prestation" className={styles.formInput} value={sub.title} onChange={e => updateSubService(sub.id, 'title', e.target.value)} />
                                <input placeholder="Prix" type="number" className={styles.formInput} value={sub.price} onChange={e => updateSubService(sub.id, 'price', Number(e.target.value))} />
                            </div>
                            <input placeholder="Unité (ex: FORFAIT, /h)" className={styles.formInput} value={sub.unit} onChange={e => updateSubService(sub.id, 'unit', e.target.value)} />
                        </div>
                    ))}
                    <button className={styles.btnAddSub} onClick={addSubService}>+ Ajouter une prestation</button>
                </div>

                <div className={styles.modalActions}>
                    <button className={styles.btnSecondary} onClick={onClose}>Annuler</button>
                    <button className={styles.btnPrimary} onClick={() => onSave(formData)}>Enregistrer</button>
                </div>
            </div>
        </div>
    );
}
