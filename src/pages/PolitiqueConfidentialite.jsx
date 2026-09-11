import { LegalLayout, LegalSection } from '../components/LegalLayout';
import { company } from '../data/company';

export default function PolitiqueConfidentialite() {
  return (
    <LegalLayout
      title="Politique de confidentialité"
      intro="La manière dont nous collectons, utilisons et protégeons vos données personnelles, conformément au RGPD et à la loi organique espagnole 3/2018 (LOPDGDD)."
      updated={company.updated}
    >
      <LegalSection n={1} title="Responsable du traitement">
        <dl className="legal-dl">
          <dt>Responsable</dt>
          <dd>{company.name}</dd>
          <dt>CIF / NIF</dt>
          <dd>{company.cif}</dd>
          <dt>Domicile</dt>
          <dd>{company.address}</dd>
          <dt>Email protection des données</dt>
          <dd>{company.emailData}</dd>
          <dt>Délégué à la protection des données</dt>
          <dd>Non applicable — organisme consolidé du groupe BSH (BSH Finance and Holding GmbH)</dd>
        </dl>
      </LegalSection>

      <LegalSection n={2} title="Réglementation applicable">
        <p>Cette politique est conforme à :</p>
        <ul className="legal-list">
          <li>Règlement (UE) 2016/679 (RGPD)</li>
          <li>Loi organique 3/2018, relative à la protection des données personnelles et à la garantie des droits numériques (LOPDGDD)</li>
          <li>Loi 34/2002 (LSSI-CE)</li>
        </ul>
      </LegalSection>

      <LegalSection n={3} title="Données que nous collectons">
        <p>Selon l'utilisation que vous faites du site, nous pouvons collecter :</p>
        <ul className="legal-list">
          <li><strong>Données d'enregistrement / compte :</strong> nom, prénom, email, mot de passe (chiffré)</li>
          <li><strong>Données d'achat :</strong> adresse de livraison et de facturation, téléphone, historique de commandes</li>
          <li><strong>Données de paiement :</strong> gérées par notre passerelle de paiement sécurisée — nous ne stockons pas les données complètes de carte bancaire sur nos serveurs</li>
          <li><strong>Données de navigation :</strong> adresse IP, cookies, type d'appareil et de navigateur (voir la politique de cookies)</li>
          <li><strong>Communications :</strong> messages envoyés via les formulaires de contact ou le service client</li>
        </ul>
      </LegalSection>

      <LegalSection n={4} title="Finalités du traitement">
        <div className="legal-scroll">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Finalité</th>
                <th>Base juridique</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Gérer les commandes et les livraisons</td><td>Exécution du contrat (art. 6.1.b RGPD)</td></tr>
              <tr><td>Facturation et obligations fiscales</td><td>Obligation légale (art. 6.1.c RGPD)</td></tr>
              <tr><td>Service client</td><td>Exécution du contrat / intérêt légitime</td></tr>
              <tr><td>Envoi de communications commerciales</td><td>Consentement (art. 6.1.a RGPD)</td></tr>
              <tr><td>Amélioration du site et analyse d'usage</td><td>Consentement (cookies analytiques)</td></tr>
              <tr><td>Prévention de la fraude</td><td>Intérêt légitime</td></tr>
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection n={5} title="Conservation des données">
        <p>
          Les données sont conservées pendant la durée nécessaire à la finalité pour laquelle elles
          ont été recueillies et, le cas échéant, pendant les délais légaux applicables
          (obligations comptables et fiscales : 6 ans ; garanties produits : selon la réglementation en vigueur).
        </p>
      </LegalSection>

      <LegalSection n={6} title="Destinataires et cessions">
        <p>Les données peuvent être communiquées à :</p>
        <ul className="legal-list">
          <li>Entreprises de transport et logistique, pour la livraison des commandes</li>
          <li>Banques et passerelles de paiement</li>
          <li>Administrations publiques, lorsqu'il existe une obligation légale</li>
          <li>Fournisseurs de services technologiques (hébergement, email), agissant en qualité de sous-traitants avec contrat conforme à l'art. 28 RGPD</li>
        </ul>
        <p>
          Aucun transfert international de données hors de l'Espace économique européen n'est réalisé,
          sauf si le prestataire dispose de garanties adéquates (clauses contractuelles types,
          décision d'adéquation, etc.).
        </p>
      </LegalSection>

      <LegalSection n={7} title="Droits de l'utilisateur">
        <p>Vous pouvez exercer à tout moment vos droits de :</p>
        <ul className="legal-list">
          <li>Accès</li>
          <li>Rectification</li>
          <li>Suppression (« droit à l'oubli »)</li>
          <li>Opposition</li>
          <li>Limitation du traitement</li>
          <li>Portabilité des données</li>
        </ul>
        <p>
          Pour cela, écrivez à <strong>{company.emailData}</strong> en joignant une copie de votre pièce d'identité.
          Vous pouvez également déposer une réclamation auprès de l'Agence espagnole de protection des
          données (AEPD — www.aepd.es) si vous estimez que vos droits n'ont pas été respectés.
        </p>
      </LegalSection>

      <LegalSection n={8} title="Mesures de sécurité">
        <p>
          Nous appliquons des mesures techniques et organisationnelles adaptées (chiffrement SSL/TLS,
          contrôle des accès, sauvegardes) pour protéger vos données contre les accès non autorisés,
          la perte ou l'altération.
        </p>
      </LegalSection>

      <LegalSection n={9} title="Mineurs">
        <p>
          Les services du site s'adressent aux personnes majeures (18 ans et plus). Nous ne collectons
          pas consciemment les données de mineurs sans le consentement de leurs parents ou tuteurs.
        </p>
      </LegalSection>

      <LegalSection n={10} title="Modifications">
        <p>
          Cette politique peut être mise à jour pour s'adapter aux évolutions législatives ou aux
          changements de service. Nous vous recommandons de la consulter périodiquement.
          Dernière mise à jour : {company.updated}.
        </p>
      </LegalSection>

      <p className="legal-note">
        Ce document est fourni à titre informatif et ne constitue pas un conseil juridique.
      </p>
    </LegalLayout>
  );
}