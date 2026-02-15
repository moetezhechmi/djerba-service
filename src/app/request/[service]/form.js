
'use client';

import { useState, useEffect } from 'react';
import styles from './form.module.css';



const TIME_SLOTS = {
    matin: ['08:00', '09:00', '10:00', '11:00'],
    apres_midi: ['13:00', '14:00', '15:00', '16:00', '17:00'],
    soir: ['18:00', '19:00', '20:00']
};

const COUNTRY_CODES = [
    { code: 'FR', dial: '+33', flag: '🇫🇷' },
    { code: 'BE', dial: '+32', flag: '🇧🇪' },
    { code: 'CH', dial: '+41', flag: '🇨🇭' },
    { code: 'UK', dial: '+44', flag: '🇬🇧' },
    { code: 'US', dial: '+1', flag: '🇺🇸' },
    { code: 'TN', dial: '+216', flag: '🇹🇳' },
];

export default function RequestForm({ serviceKey }) {
    const [serviceData, setServiceData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [step, setStep] = useState(1);
    const [selectedSubService, setSelectedSubService] = useState(null);
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);

    // Step 2 States: Calendar
    const [viewDate, setViewDate] = useState(new Date()); // Current month view
    const [selectedDate, setSelectedDate] = useState(new Date()); // Selected date
    const [selectedTime, setSelectedTime] = useState('10:00');
    const [frequency, setFrequency] = useState('once');

    // Step 3 States: Validation
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
        countryCode: COUNTRY_CODES[0],
        paymentMethod: 'onsite'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step, serviceKey]);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await fetch(`/api/services/${serviceKey}`);
                const data = await response.json();
                setServiceData(data);
            } catch (error) {
                console.error('Error fetching service:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [serviceKey]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => URL.createObjectURL(file));
        setImages([...images, ...newImages]);
    };

    if (loading) return (
        <div className={styles.loading}>
            <div className={styles.loaderIcon}>🛠️</div>
            <p className={styles.loadingText}>Préparation de vos services...</p>
        </div>
    );
    if (!serviceData) return <div className={styles.error}>Service non trouvé.</div>;

    const subServices = serviceData.sub_services || [];

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleNext = () => {
        if (step === 1) {
            if (!selectedSubService) {
                alert('Veuillez sélectionner un type de prestation.');
                return;
            }
            setStep(2);
        } else if (step === 2) {
            setStep(3);
        } else if (step === 3) {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        // Step 3 validation
        if (!formData.nom.trim() || !formData.prenom.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.city.trim() || !formData.zip.trim()) {
            alert('Veuillez remplir toutes vos coordonnées.');
            return;
        }

        if (!validateEmail(formData.email)) {
            alert('Veuillez entrer une adresse email valide.');
            return;
        }

        const phoneClean = formData.phone.replace(/\s/g, '');
        if (phoneClean.length < 8) {
            alert('Votre numéro de téléphone semble incomplet.');
            return;
        }

        setIsSubmitting(true);
        try {
            const subService = subServices.find(s => s.id === selectedSubService);
            const basePrice = subService?.price || 0;
            const extraFee = frequency === 'urgent' ? 15 : 0;
            const totalPrice = basePrice + extraFee;

            const payload = {
                service_key: serviceKey,
                sub_service: subService?.title,
                service_price: basePrice,
                service_unit: subService?.unit,
                date: selectedDate.toLocaleDateString('fr-FR'),
                time: selectedTime,
                frequency: frequency,
                description: description,
                images: images,
                client_name: `${formData.prenom} ${formData.nom}`,
                client_email: formData.email,
                client_phone: `${formData.countryCode.dial} ${formData.phone}`,
                client_address: formData.address,
                client_city: formData.city,
                client_zip: formData.zip,
                payment_method: formData.paymentMethod,
                total_price: totalPrice
            };

            const response = await fetch('/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setShowSuccess(true);
            } else {
                alert('Une erreur est survenue lors de la confirmation.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Erreur de connexion.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    // Calendar Logic
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1; // Adjust for Monday start (0=Mon, 6=Sun)
    };

    const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

    // Previous month padding
    const prevMonthDays = [];
    const daysInPrevMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth() - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
        prevMonthDays.push(daysInPrevMonth - i);
    }

    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const changeMonth = (offset) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
        setViewDate(newDate);
    };

    const isSelected = (day) => {
        return selectedDate.getDate() === day &&
            selectedDate.getMonth() === viewDate.getMonth() &&
            selectedDate.getFullYear() === viewDate.getFullYear();
    };

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() &&
            viewDate.getMonth() === today.getMonth() &&
            viewDate.getFullYear() === today.getFullYear();
    };

    const selectDay = (day) => {
        setSelectedDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
    };

    return (
        <div className={styles.pageWrapper}>
            {/* Header / Tunnel Steps */}
            <div className={styles.tunnelHeader}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
                    <div className={styles.stepper}>
                        <div className={`${styles.step} ${step >= 1 ? styles.activeStep : ''}`}>
                            <div className={step >= 1 ? styles.stepCircle : styles.stepCircleOutline}>1</div>
                            <span className={styles.stepLabel}>SERVICE</span>
                        </div>
                        <div className={styles.stepLine}></div>
                        <div className={`${styles.step} ${step >= 2 ? styles.activeStep : ''}`}>
                            <div className={step >= 2 ? styles.stepCircle : styles.stepCircleOutline}>2</div>
                            <span className={styles.stepLabel}>PLANIFICATION</span>
                        </div>
                        <div className={styles.stepLine}></div>
                        <div className={`${styles.step} ${step >= 3 ? styles.activeStep : ''}`}>
                            <div className={step >= 3 ? styles.stepCircle : styles.stepCircleOutline}>3</div>
                            <span className={styles.stepLabel}>PAIEMENT</span>
                        </div>
                    </div>

                    <button
                        className={styles.closeBtn}
                        onClick={() => window.location.href = '/services'}
                    >
                        ✕
                    </button>
                </div>
            </div>

            <div className={styles.contentGrid}>
                {step === 1 && (
                    <div className={styles.leftColumn}>
                        <div className={styles.stepHeader}>
                            <h2>Étape 1 : Choix du service</h2>
                            <span className={styles.listIcon}>📄</span>
                        </div>
                        <p className={styles.stepDesc}>Sélectionnez la prestation précise pour une affectation immédiate.</p>

                        <div className={styles.serviceGrid}>
                            {subServices.map((item) => (
                                <div
                                    key={item.id}
                                    className={`${styles.serviceCard} ${selectedSubService === item.id ? styles.selectedCard : ''}`}
                                    onClick={() => setSelectedSubService(item.id)}
                                >
                                    <div className={styles.cardHeader}>
                                        <div className={styles.iconBox}>{item.icon}</div>
                                        {selectedSubService === item.id && <div className={styles.checkIcon}>✓</div>}
                                    </div>
                                    <h3 className={styles.cardTitle}>{item.title}</h3>
                                    <p className={styles.cardDesc}>{item.desc}</p>
                                    {/* Price removed as per user request */}
                                </div>
                            ))}
                        </div>

                        {/* Affectation Banner */}
                        <div className={styles.bannerInfo}>
                            <div className={styles.bannerIcon}>🛡️</div>
                            <div>
                                <strong>Affectation intelligente</strong>
                                <p>Nous sélectionnons pour vous l'expert le mieux noté disponible à cette date.</p>
                                <p>Gain de temps garanti.</p>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Précisions supplémentaires (optionnel)</label>
                            <textarea
                                className={styles.textarea}
                                placeholder="Ex: Digicode 1234, 3ème étage sans ascenseur..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {/* Image Upload */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Photos de l'intervention (optionnel)</label>
                            <div className={styles.uploadContainer}>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className={styles.fileInput}
                                    onChange={handleImageUpload}
                                    id="image-upload"
                                />
                                <label htmlFor="image-upload" className={styles.uploadBox}>
                                    <span className={styles.uploadIcon}>📸</span>
                                    <span className={styles.uploadText}>Ajouter des photos</span>
                                    <span className={styles.uploadSubtext}>JPG, PNG jusqu'à 5 Mo</span>
                                </label>

                                {images.length > 0 && (
                                    <div className={styles.imagePreviewGrid}>
                                        {images.map((img, idx) => (
                                            <div key={idx} className={styles.imageThumb}>
                                                <img src={img} alt={`preview ${idx}`} />
                                                <button className={styles.removeImg} onClick={() => setImages(images.filter((_, i) => i !== idx))}>×</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sticky Bottom Bar for Step 1 */}
                        {selectedSubService && !showSuccess && (
                            <div className={styles.stickyBar}>
                                <div className={styles.recap}>
                                    <div className={styles.recapIcon}>📄</div>
                                    <div className={styles.recapText}>
                                        <div>Service sélectionné</div>
                                        <strong>
                                            {subServices.find(s => s.id === selectedSubService)?.title}
                                        </strong>
                                    </div>
                                </div>
                                <div className={styles.barActions}>
                                    <button className={styles.btnPrev} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }} onClick={() => window.location.href = '/services'}>✕ Annuler</button>
                                    <button className={styles.btnNext} onClick={handleNext}>Continuer vers la planification →</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className={styles.planningContainer}>
                        <div className={styles.stepHeader}>
                            <h2>Choisissez votre créneau</h2>
                        </div>
                        <p className={styles.stepDesc}>Sélectionnez la date et l'heure qui vous conviennent le mieux pour votre intervention.</p>

                        <div className={styles.planningGrid}>
                            {/* Calendar Column */}
                            <div className={styles.calendarCard}>
                                <div className={styles.calendarHeader}>
                                    <span style={{ textTransform: 'capitalize' }}>
                                        {viewDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
                                    </span>
                                    <div className={styles.calendarNav}>
                                        <button onClick={() => changeMonth(-1)}>‹</button>
                                        <button onClick={() => changeMonth(1)}>›</button>
                                    </div>
                                </div>
                                <div className={styles.calendarDays}>
                                    <span>LUN</span><span>MAR</span><span>MER</span><span>JEU</span><span>VEN</span><span>SAM</span><span>DIM</span>
                                </div>
                                <div className={styles.calendarDates}>
                                    {prevMonthDays.map(day => (
                                        <span key={`prev-${day}`} className={styles.disabledDate}>{day}</span>
                                    ))}
                                    {currentMonthDays.map(day => (
                                        <span
                                            key={day}
                                            className={`${styles.dateCell} ${isSelected(day) ? styles.selectedDate : ''} ${isToday(day) ? styles.todayDate : ''}`}
                                            onClick={() => selectDay(day)}
                                        >
                                            {day}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Time & Frequency Column */}
                            <div className={styles.optionsColumn}>
                                <div className={styles.optionSection}>
                                    <div className={styles.optionHeader}>
                                        <span className={styles.clockIcon}>🕒</span> Créneaux disponibles
                                    </div>

                                    <div className={styles.timeGroupLabel}>MATIN</div>
                                    <div className={styles.timeGrid}>
                                        {TIME_SLOTS.matin.map(t => (
                                            <button key={t} className={`${styles.timeBtn} ${selectedTime === t ? styles.selectedTime : ''}`} onClick={() => setSelectedTime(t)}>{t}</button>
                                        ))}
                                    </div>

                                    <div className={styles.timeGroupLabel}>APRÈS-MIDI</div>
                                    <div className={styles.timeGrid}>
                                        {TIME_SLOTS.apres_midi.map(t => (
                                            <button key={t} className={`${styles.timeBtn} ${selectedTime === t ? styles.selectedTime : ''}`} onClick={() => setSelectedTime(t)}>{t}</button>
                                        ))}
                                    </div>

                                    <div className={styles.timeGroupLabel}>SOIR</div>
                                    <div className={styles.timeGrid}>
                                        {TIME_SLOTS.soir.map(t => (
                                            <button key={t} className={`${styles.timeBtn} ${selectedTime === t ? styles.selectedTime : ''}`} onClick={() => setSelectedTime(t)}>{t}</button>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.optionSection}>
                                    <div className={styles.optionHeader}>Fréquence du service</div>
                                    <div
                                        className={`${styles.freqCard} ${frequency === 'once' ? styles.selectedFreq : ''}`}
                                        onClick={() => setFrequency('once')}
                                    >
                                        <div className={styles.radio}>{frequency === 'once' && <div className={styles.radioInner} />}</div>
                                        <div>
                                            <div className={styles.freqTitle}>Une seule fois</div>
                                            <div className={styles.freqDesc}>Service ponctuel sans engagement</div>
                                        </div>
                                    </div>
                                    <div
                                        className={`${styles.freqCard} ${frequency === 'urgent' ? styles.selectedFreq : ''}`}
                                        onClick={() => setFrequency('urgent')}
                                    >
                                        <div className={styles.radio}>{frequency === 'urgent' && <div className={styles.radioInner} />}</div>
                                        <div>
                                            <div className={styles.freqTitle}>
                                                Urgent 🚨 <span className={styles.urgentBadge}>+15 DT</span>
                                            </div>
                                            <div className={styles.freqDesc}>Intervention prioritaire dans les 24h</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Bottom Bar */}
                        {!showSuccess && (
                            <div className={styles.stickyBar}>
                                <div className={styles.recap}>
                                    <div className={styles.recapIcon}>📅</div>
                                    <div className={styles.recapText}>
                                        <div>Récapitulatif</div>
                                        <strong>
                                            {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {selectedTime}
                                        </strong>
                                    </div>
                                </div>
                                <div className={styles.barActions}>
                                    <button className={styles.btnPrev} onClick={handleBack}>Précédent</button>
                                    <button className={styles.btnNext} onClick={handleNext}>Suivant : Adresse et Paiement →</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {step === 3 && (
                    <div className={styles.validationContainer}>
                        <div className={styles.validationHeader}>
                            <h2>Validation et Coordonnées</h2>
                            <p>Finalisez votre demande d'intervention en quelques instants.</p>
                        </div>

                        {/* 1. Coordonnées */}
                        <div className={styles.cardSection}>
                            <div className={styles.cardSectionHeader}>
                                <div className={styles.sectionIcon}>👤</div>
                                <h3>1. Coordonnées</h3>
                            </div>
                            <div className={styles.formGrid}>
                                <div className={styles.inputGroupFull} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label className={styles.label}>Prénom</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            placeholder="Jean"
                                            value={formData.prenom}
                                            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className={styles.label}>Nom</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            placeholder="Dupont"
                                            value={formData.nom}
                                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className={styles.inputGroupFull}>
                                    <label className={styles.label}>Email</label>
                                    <input
                                        type="email"
                                        className={styles.input}
                                        placeholder="jean.dupont@email.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className={styles.inputGroupFull}>
                                    <label className={styles.label}>Numéro de téléphone</label>
                                    <div className={styles.phoneInputWrapper} style={{ position: 'relative' }}>
                                        <div
                                            className={styles.flagSelector}
                                            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                        >
                                            {formData.countryCode.flag} ▾
                                        </div>

                                        {/* Country Dropdown */}
                                        {isCountryDropdownOpen && (
                                            <div className={styles.countryDropdown}>
                                                {COUNTRY_CODES.map((country) => (
                                                    <div
                                                        key={country.code}
                                                        className={styles.countryItem}
                                                        onClick={() => {
                                                            setFormData({ ...formData, countryCode: country });
                                                            setIsCountryDropdownOpen(false);
                                                        }}
                                                    >
                                                        <span>{country.flag}</span>
                                                        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{country.dial}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <input
                                            type="tel"
                                            className={styles.input}
                                            placeholder="06 12 34 56 78"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Adresse */}
                        <div className={styles.cardSection}>
                            <div className={styles.cardSectionHeader}>
                                <div className={styles.sectionIcon}>📍</div>
                                <h3>2. Adresse de l'intervention</h3>
                            </div>
                            <div className={styles.inputGroupFull} style={{ marginBottom: '1rem' }}>
                                <label className={styles.label}>Adresse (Rue et Numéro)</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="Ex: 42 rue de la Paix"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGrid}>
                                <div className={styles.inputGroupFull}>
                                    <label className={styles.label}>Ville</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="Paris"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>
                                <div className={styles.inputGroupFull}>
                                    <label className={styles.label}>Code postal</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="75001"
                                        value={formData.zip}
                                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3. Paiement */}
                        <div className={styles.cardSection}>
                            <div className={styles.cardSectionHeader}>
                                <div className={styles.sectionIcon}>💶</div>
                                <h3>3. Mode de paiement</h3>
                            </div>

                            <div className={styles.paymentCardSelected}>
                                <div className={styles.paymentHeader}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div className={styles.paymentIcon}>💵</div>
                                        <div>
                                            <div className={styles.paymentTitle}>Paiement sur place</div>
                                            <div className={styles.paymentSub}>(Espèces ou Chèque)</div>
                                        </div>
                                    </div>
                                    <span className={styles.recommendBadge}>RECOMMANDÉ</span>
                                </div>
                                <div className={styles.infoBox}>
                                    <span style={{ marginRight: '0.5rem' }}>ℹ️</span>
                                    Le règlement s'effectue <strong>directement auprès du professionnel</strong> à la fin de l'intervention.
                                </div>
                            </div>

                            <div className={styles.trustBadges}>
                                <span>🔒 Réservation garantie</span>
                                <span>🛡️ Paiement après service</span>
                            </div>
                        </div>

                        {/* Sticky Bottom Bar */}
                        {!showSuccess && (
                            <div className={styles.stickyBar}>
                                <div className={styles.recap}>
                                    <div className={styles.recapIcon}>📅</div>
                                    <div className={styles.recapText}>
                                        <div>Récapitulatif</div>
                                        <strong>
                                            {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {selectedTime}
                                        </strong>
                                    </div>
                                </div>
                                <div className={styles.barActions}>
                                    <button className={styles.btnPrev} onClick={handleBack} disabled={isSubmitting}>Précédent</button>
                                    <button
                                        className={styles.btnNext}
                                        onClick={handleNext}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Confirmation...' : 'Confirmer la demande ✓'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <div className={styles.successIcon}>✓</div>
                        </div>
                        <h2 className={styles.modalTitle}>Demande Confirmée !</h2>
                        <p className={styles.modalText}>
                            Merci <strong>{formData.prenom}</strong>, votre demande pour <strong>{subServices.find(s => s.id === selectedSubService)?.title}</strong> a bien été enregistrée.
                        </p>
                        <div className={styles.recapCard}>
                            <div className={styles.recapLine}>
                                <span>📅 Date :</span>
                                <strong>{selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</strong>
                            </div>
                            <div className={styles.recapLine}>
                                <span>🕒 Heure :</span>
                                <strong>{selectedTime}</strong>
                            </div>
                            <div className={styles.recapLine}>
                                <span>📍 Ville :</span>
                                <strong>{formData.city}</strong>
                            </div>
                        </div>
                        <p className={styles.modalSubText}>
                            Un expert de <strong>Easy Services Djerba</strong> vous contactera prochainement pour confirmer les détails.
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
