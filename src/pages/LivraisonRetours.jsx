import { LegalLayout, LegalSection } from '../components/LegalLayout';
import { company } from '../data/company';

export default function LivraisonRetours() {
  return (
    <LegalLayout
      title="Livraisons, retours & remboursements"
      intro="Les zones de livraison, les délais, les coûts et la procédure de retour et de remboursement de vos commandes."
      updated={company.updated}
    >
      <LegalSection n={1} title="Zones et délais de livraison">
        <div className="legal-scroll">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Zone</th>
                <th>Délai estimé</th>
                <th>Coût</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Espagne — Péninsule</td>
                <td>2 à 5 jours ouvrés</td>
                <td>Gratuite</td>
              </tr>
              <tr>
                <td>Baléares</td>
                <td>3 à 6 jours ouvrés</td>
                <td>9,90 €</td>
              </tr>
              <tr>
                <td>Canaries, Ceuta, Melilla</td>
                <td>5 à 10 jours ouvrés</td>
                <td>19,90 € + frais IGIC / portuaires éventuels</td>
              </tr>
              <tr>
                <td>Portugal / UE</td>
                <td>3 à 6 jours ouvrés</td>
                <td>9,90 €</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Les électroménagers de grand volume (lave-linge, réfrigérateurs, fours) peuvent nécessiter
          un délai de livraison supérieur et, dans certains cas, une livraison à domicile sur rendez-vous.
        </p>
      </LegalSection>

      <LegalSection n={2} title="Installation et déballage">
        <p>
          Optionnellement, un service d'installation et de retrait de l'emballage peut être proposé pour
          les appareils de grand volume. Ce service est indiqué lors de la commande et facturé
          séparément, sauf offre spéciale. Contactez-nous avant de finaliser votre commande pour plus d'informations.
        </p>
      </LegalSection>

      <LegalSection n={3} title="Retours">
        <ul className="legal-list">
          <li>
            Délai : <strong>30 jours calendaires</strong> à compter de la réception (le droit légal de
            rétractation étant de 14 jours, nous l'étendons à 30 jours pour la plupart des produits non installés)
          </li>
          <li>
            Le produit doit être retourné dans son emballage d'origine, sans signe d'usage, avec tous
            les accessoires et manuels
          </li>
          <li>
            Les frais de retour des électroménagers de grand volume sont à la charge du client en cas de
            simple rétractation ; pris en charge par l'entreprise en cas de produit défectueux
          </li>
          <li>
            Aucun retour n'est accepté pour les produits ayant été installés et mis en service, sauf
            défaut de fabrication (pour des raisons d'hygiène ou de sécurité, selon le type de produit)
          </li>
        </ul>
      </LegalSection>

      <LegalSection n={4} title="Produit défectueux ou endommagé au transport">
        <p>
          Si le produit arrive endommagé ou défectueux, le client doit le signaler sous{' '}
          <strong>48 heures</strong> à <strong>{company.emailSupport}</strong>, en joignant des
          photographies. Nous organisons l'enlèvement, le remplacement ou la réparation sans frais
          pour le client.
        </p>
      </LegalSection>

      <LegalSection n={5} title="Remboursements">
        <p>
          Les remboursements sont effectués par le même moyen de paiement utilisé lors de l'achat, dans
          un délai maximal de 14 jours à compter de la réception du produit retourné ou de la preuve de
          son renvoi.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Garantie du fabricant">
        <p>
          Indépendamment de la garantie légale de conformité (voir les CGV, article 8), de nombreux
          fabricants offrent des garanties commerciales supplémentaires et un service technique officiel.
          Nous vous recommandons de conserver la facture et le numéro de série du produit.
        </p>
      </LegalSection>

      <p className="legal-note">
        Ce document est fourni à titre informatif et ne constitue pas un conseil juridique.
      </p>
    </LegalLayout>
  );
}