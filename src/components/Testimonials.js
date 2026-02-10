
import styles from './Testimonials.module.css';

const testimonials = [
    {
        id: 1,
        name: "Sophie Martin",
        location: "Paris, France",
        text: "Super expérience ! Le plombier est arrivé à l'heure, très professionnel et a réparé ma fuite en 30 minutes. Je recommande vivement.",
        stars: 5
    },
    {
        id: 2,
        name: "Thomas Dubois",
        location: "Lyon, France",
        text: "J'avais besoin d'un grand nettoyage de printemps. L'équipe était efficace et discrète. Ma maison n'a jamais été aussi propre.",
        stars: 5
    },
    {
        id: 3,
        name: "Léa Bernard",
        location: "Bordeaux, France",
        text: "Très pratique pour trouver un jardinier rapidement. L'application est intuitive et le service client est réactif.",
        stars: 4
    }
];

export default function Testimonials() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>Ce que disent nos clients</h2>
                    <p className={styles.subtitle}>Plus de 10 000 avis vérifiés sur notre plateforme.</p>
                </div>

                <div className={styles.grid}>
                    {testimonials.map((item) => (
                        <div key={item.id} className={styles.card}>
                            <div className={styles.stars}>
                                {"★".repeat(item.stars)}{"☆".repeat(5 - item.stars)}
                            </div>
                            <p className={styles.text}>"{item.text}"</p>
                            <div className={styles.author}>
                                <div className={styles.avatar}>{item.name[0]}</div>
                                <div>
                                    <div className={styles.name}>{item.name}</div>
                                    <div className={styles.location}>{item.location}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
