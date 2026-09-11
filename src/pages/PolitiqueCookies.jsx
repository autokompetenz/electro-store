import { LegalLayout, LegalSection } from '../components/LegalLayout';
import { company } from '../data/company';

export default function PolitiqueCookies() {
  return (
    <LegalLayout
      title="Politique de cookies"
      intro="Informations sur les cookies utilisés sur ce site et sur la manière de les gérer, conformément aux recommandations de l'AEPD."
      updated={company.updated}
    >
      <LegalSection n={1} title="Qu'est-ce qu'un cookie ?">
        <p>
          Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez
          notre site web. Ils permettent de reconnaître votre navigateur et d'améliorer votre
          expérience d'utilisateur.
        </p>
      </LegalSection>

      <LegalSection n={2} title="Types de cookies utilisés">
        <div className="legal-scroll">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Finalité</th>
                <th>Consentement requis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Techniques / nécessaires</td>
                <td>Panier d'achat, connexion, sécurité</td>
                <td>Non</td>
              </tr>
              <tr>
                <td>Préférences</td>
                <td>Langue, devise, configuration d'affichage</td>
                <td>Oui</td>
              </tr>
              <tr>
                <td>Analytiques (ex. Google Analytics)</td>
                <td>Statistiques d'utilisation et de navigation</td>
                <td>Oui</td>
              </tr>
              <tr>
                <td>Publicitaires / marketing (ex. Meta Ads, Google Ads)</td>
                <td>Publicité personnalisée, remarketing</td>
                <td>Oui</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection n={3} title="Gestion du consentement">
        <p>
          Dès votre première visite, un panneau vous permet d'accepter, de refuser ou de configurer
          les cookies de manière granulaire, conformément au guide des cookies de l'AEPD. Vous pouvez
          modifier vos préférences à tout moment via le lien « Configuration des cookies » en pied de page.
        </p>
      </LegalSection>

      <LegalSection n={4} title="Cookies de tiers">
        <p>
          Certains cookies sont installés par des prestataires externes (Google Analytics, passerelle
          de paiement, etc.). Le traitement de ces données est régi par les politiques de confidentialité
          de ces tiers.
        </p>
      </LegalSection>

      <LegalSection n={5} title="Comment désactiver les cookies depuis le navigateur">
        <p>Vous pouvez configurer votre navigateur pour bloquer ou supprimer les cookies :</p>
        <ul className="legal-list">
          <li>Chrome / Edge / Firefox / Safari : options disponibles dans Paramètres &gt; Confidentialité</li>
        </ul>
      </LegalSection>

      <LegalSection n={6} title="Plus d'informations">
        <p>
          Pour toute question relative à cette politique, contactez-nous à : <strong>{company.emailData}</strong>
        </p>
      </LegalSection>

      <p className="legal-note">
        Cette politique est une base générique. Une liste actualisée des cookies réellement installés
        (via un outil d'audit type Cookiebot/CookieYes) doit être intégrée avant publication.
      </p>
    </LegalLayout>
  );
}