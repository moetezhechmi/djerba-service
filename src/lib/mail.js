
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'grounmoetezhechmi@gmail.com',
        pass: process.env.EMAIL_APP_PASSWORD || ''
    }
});

const BASE_HTML_TEMPLATE = (title, subtitle, clientName, content, footerText) => `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #3b82f6; padding: 30px 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px; letter-spacing: -0.5px;">Easy Services Djerba</h1>
            <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 16px;">${subtitle}</p>
        </div>
        <div style="padding: 40px 30px; background-color: #ffffff;">
            <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Bonjour ${clientName},</h2>
            <div style="color: #475569; line-height: 1.7; font-size: 16px;">
                ${content}
            </div>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #f1f5f9;">
                <a href="https://easy-services-djerba.com" style="background-color: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: 600; display: inline-block;">Accéder à mon espace</a>
            </div>
        </div>
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; color: #94a3b8; font-size: 13px; border-top: 1px solid #f1f5f9;">
            ${footerText}<br/>
            © 2026 Easy Services Djerba - Djerba, Tunisie
        </div>
    </div>
`;

export async function sendConfirmationEmail(clientEmail, requestDetails) {
    const { client_name, service_key, sub_service, date, time, client_address } = requestDetails;

    const content = `
        <p>Votre réservation a bien été enregistrée pour le service <strong>${service_key}</strong>.</p>
        <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #f1f5f9;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px 0; color: #64748b;">Prestation :</td>
                    <td style="padding: 10px 0; font-weight: 600; color: #0f172a; text-align: right;">${sub_service}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; color: #64748b;">Date & Heure :</td>
                    <td style="padding: 10px 0; font-weight: 600; color: #0f172a; text-align: right;">Le ${date} à ${time}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; color: #64748b;">Adresse :</td>
                    <td style="padding: 10px 0; font-weight: 600; color: #0f172a; text-align: right;">${client_address}</td>
                </tr>
            </table>
        </div>
        <p>Un de nos experts va examiner votre demande. Vous recevrez une confirmation finale par WhatsApp dès qu'un artisan sera affecté.</p>
    `;

    const html = BASE_HTML_TEMPLATE(
        'Confirmation de réservation',
        'Votre demande a été prise en compte',
        client_name,
        content,
        'Merci de votre confiance !'
    );

    return transporter.sendMail({
        from: '"Easy Services Djerba" <grounmoetezhechmi@gmail.com>',
        to: clientEmail,
        subject: `Confirmation de votre réservation - Easy Services Djerba`,
        html
    });
}

export async function sendStatusUpdateEmail(clientEmail, requestDetails) {
    const { client_name, service_key, sub_service, date, status } = requestDetails;

    const statusInfo = {
        'confirmed': {
            label: 'Confirmée ✅',
            message: `Bonne nouvelle ! Votre demande pour le service <strong>${service_key}</strong> a été validée. L'artisan est programmé pour le <strong>${date}</strong>.`
        },
        'completed': {
            label: 'Terminée ✨',
            message: `Votre intervention pour le service <strong>${service_key}</strong> est maintenant terminée. Nous espérons que vous êtes satisfait de la prestation.`
        },
        'cancelled': {
            label: 'Annulée ❌',
            message: `Votre demande pour le service <strong>${service_key}</strong> a été annulée. N'hésitez pas à nous contacter pour plus d'informations.`
        }
    }[status] || {
        label: status.toUpperCase(),
        message: `Le statut de votre demande pour le service <strong>${service_key}</strong> a été mis à jour.`
    };

    const content = `
        <p style="font-size: 17px; color: #0f172a;">${statusInfo.message}</p>
        <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #f1f5f9;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px 0; color: #64748b;">Service :</td>
                    <td style="padding: 10px 0; font-weight: 600; color: #0f172a; text-align: right;">${service_key.charAt(0).toUpperCase() + service_key.slice(1)}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; color: #64748b;">Statut :</td>
                    <td style="padding: 10px 0; font-weight: 700; color: #3b82f6; text-align: right; text-transform: uppercase;">${statusInfo.label}</td>
                </tr>
            </table>
        </div>
        <p>Besoin d'assistance ? Répondez simplement à cet email.</p>
    `;

    const html = BASE_HTML_TEMPLATE(
        'Suivi de mission',
        'Mise à jour de votre demande',
        client_name,
        content,
        'Service client disponible 7j/7'
    );

    return transporter.sendMail({
        from: '"Easy Services Djerba" <grounmoetezhechmi@gmail.com>',
        to: clientEmail,
        subject: `Mise à jour de votre mission : ${statusInfo.label} - Easy Services Djerba`,
        html
    });
}

export async function sendArtisanApplicationEmail(artisanEmail, artisanDetails) {
    const { name, service_key, phone } = artisanDetails;

    const content = `
        <p>Bienvenue parmi nous ! Votre demande pour rejoindre notre réseau en tant que professionnel <strong>${service_key}</strong> a bien été reçue.</p>
        <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #f1f5f9;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px 0; color: #64748b;">Nom complet :</td>
                    <td style="padding: 10px 0; font-weight: 600; color: #0f172a; text-align: right;">${name}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; color: #64748b;">Activité :</td>
                    <td style="padding: 10px 0; font-weight: 600; color: #0f172a; text-align: right;">${service_key.charAt(0).toUpperCase() + service_key.slice(1)}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; color: #64748b;">Téléphone :</td>
                    <td style="padding: 10px 0; font-weight: 600; color: #0f172a; text-align: right;">${phone}</td>
                </tr>
            </table>
        </div>
        <p>Notre équipe va examiner votre profil. Un responsable vous contactera par téléphone sous 24h pour valider votre inscription et vous expliquer le fonctionnement du réseau.</p>
        <p>Préparez-vous à recevoir vos premières missions !</p>
    `;

    const html = BASE_HTML_TEMPLATE(
        'Bienvenue dans le Réseau',
        'Votre candidature est en cours d\'examen',
        name,
        content,
        'L\'équipe Easy Services Djerba'
    );

    return transporter.sendMail({
        from: '"Easy Services Djerba" <grounmoetezhechmi@gmail.com>',
        to: artisanEmail,
        subject: `Bienvenue dans le réseau ! - Easy Services Djerba`,
        html
    });
}
