import { LegalLayout, LegalSection } from '../components/LegalLayout';
import { company } from '../data/company';

export default function CGV() {
  return (
    <LegalLayout
      title="Conditions générales de vente"
      intro="Les conditions qui régissent vos achats sur notre boutique en ligne, conformément au décret législatif royal espagnol 1/2007 (TRLGDCU) pour le commerce électronique B2C."
      updated={company.updated}
    >
      <LegalSection n={1} title="Objet et identification du vendeur">
        <p>
          Les présentes Conditions générales de vente régissent l'achat de produits sur le site
          {' '}<strong>{company.brand}</strong>, exploité par {company.name}, CIF {company.cif},
          domiciliée au {company.address}, email {company.emailSales}.
        </p>
      </LegalSection>

      <LegalSection n={2} title="Produits">
        <p>
          Les produits proposés (électroménagers et accessoires) sont décrits avec la plus grande
          exactitude possible : caractéristiques techniques, prix, disponibilité et images. Les images
          ont un caractère illustratif et peuvent ne pas correspondre exactement au produit réel.
          Les marques de fabricants (Bosch, Siemens, BSH et autres) appartiennent à leurs titulaires respectifs.
        </p>
      </LegalSection>

      <LegalSection n={3} title="Prix et taxes">
        <p>
          Tous les prix sont affichés en euros (€) et incluent la TVA en vigueur en Espagne. Les frais
          de livraison sont indiqués séparément avant de finaliser la commande, sauf mention d'une livraison gratuite.
        </p>
      </LegalSection>

      <LegalSection n={4} title="Processus d'achat">
        <ol className="legal-list">
          <li>Sélection du produit et ajout au panier</li>
          <li>Saisie des données de livraison et de facturation</li>
          <li>Choix du mode de paiement</li>
          <li>Confirmation de la commande (acceptation expresse des présentes CGV)</li>
          <li>Envoi d'un email de confirmation avec le récapitulatif de la commande</li>
        </ol>
      </LegalSection>

      <LegalSection n={5} title="Moyens de paiement">
        <p>Nous acceptons les moyens de paiement suivants :</p>
        <ul className="legal-list">
          <li>Carte de crédit / débit (Visa, Mastercard, Maestro)</li>
          <li>Bizum</li>
          <li>PayPal</li>
          <li>Transfert bancaire</li>
        </ul>
        <p>
          Toutes les transactions sont traitées via des passerelles de paiement sécurisées et chiffrées.
          Nous ne stockons pas les données complètes de carte bancaire sur nos serveurs.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Délais et conditions de livraison">
        <ul className="legal-list">
          <li>Délai estimé de livraison : <strong>2 à 5 jours ouvrés</strong> pour la péninsule ; délais différenciés pour les Baléares, les Canaries, Ceuta et Melilla (voir la page Livraisons et retours)</li>
          <li>Le transport est effectué par des entreprises de transport partenaires</li>
          <li>
            Le risque de perte ou d'endommagement est transféré au consommateur au moment où celui-ci,
            ou un tiers qu'il a désigné, prend matériellement possession du produit
          </li>
        </ul>
      </LegalSection>

      <LegalSection n={7} title="Droit de rétractation">
        <p>
          Conformément à l'article 102 et suivants du TRLGDCU, le client dispose de{' '}
          <strong>14 jours calendaires</strong> à compter de la réception du produit pour se rétracter
          sans justification, sauf exceptions légales (produits personnalisés ou produits scellés pour
          des raisons d'hygiène déjà ouverts).
        </p>
        <p>
          Pour exercer ce droit, le client doit le notifier à <strong>{company.emailSales}</strong> ou
          au moyen du formulaire de rétractation disponible sur le site. Les frais de retour sont à la
          charge de l'entreprise en cas de produit défectueux ; pour une simple rétractation, ils sont
          à la charge du client, sauf accord contraire. Le remboursement est effectué sous 14 jours
          maximum à compter de la notification (ou de la réception du produit retourné, si postérieure).
        </p>
      </LegalSection>

      <LegalSection n={8} title="Garanties">
        <p>
          Tous les produits bénéficient de la garantie légale de conformité de{' '}
          <strong>3 ans</strong> (art. 120 TRLGDCU, pour les contrats postérieurs au 01/01/2022) à
          compter de la livraison. Des garanties commerciales supplémentaires peuvent en outre être
          offertes par le fabricant, selon les conditions qu'il détermine.
        </p>
        <p>
          En cas de défaut de conformité, le client dispose du droit à la réparation, au remplacement,
          à la réduction du prix ou à la résolution du contrat, conformément à la réglementation en vigueur.
        </p>
      </LegalSection>

      <LegalSection n={9} title="Service client et réclamations">
        <p>
          Pour toute réclamation, le client peut contacter <strong>{company.emailSupport}</strong>. {company.name} met des formulaires de réclamation à la
          disposition du consommateur, conformément à la réglementation autonome applicable.
        </p>
      </LegalSection>

      <LegalSection n={10} title="Résolution de litiges">
        <p>
          En cas de conflit, le consommateur peut recourir à la Plateforme européenne de résolution
          des litiges en ligne :{' '}
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noreferrer" style={{ color: 'var(--terracotta)' }}>
            ec.europa.eu/consumers/odr
          </a>
        </p>
      </LegalSection>

      <LegalSection n={11} title="Législation applicable">
        <p>
          Les présentes CGV sont régies par la législation espagnole, en particulier le décret
          législatif royal 1/2007 (TRLGDCU) et la loi 34/2002 (LSSI-CE).
        </p>
      </LegalSection>

      <p className="legal-note">
        Ce document est fourni à titre informatif et ne constitue pas un conseil juridique.
      </p>
    </LegalLayout>
  );
}