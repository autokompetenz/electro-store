import { LegalLayout, LegalSection } from '../components/LegalLayout';
import { company } from '../data/company';

export default function CommentCommander() {
  return (
    <LegalLayout
      title="Comment commander ?"
      intro="Commander sur Electro Store est simple : choisissez vos produits, validez, et réglez par virement en indiquant votre motif. Vous recevez un email à chaque étape."
      updated={company.updated}
    >
      <LegalSection n={1} title="1 · Choisissez vos produits">
        <p>
          Parcourez le <a href="/catalogue">catalogue</a>. Cliquez sur « Ajouter
          au panier » sur les produits qui vous intéressent, puis ouvrez votre
          panier en haut de page quand vous êtes prêt.
        </p>
      </LegalSection>

      <LegalSection n={2} title="2 · Passez commande">
        <p>
          Renseignez votre nom, votre email et votre adresse de livraison, puis
          validez. Une fois la commande enregistrée, vous recevez immédiatement
          un email de confirmation contenant les <strong>coordonnées de
          paiement par virement bancaire</strong> (IBAN, BIC et titulaire du
          compte).
        </p>
      </LegalSection>

      <LegalSection n={3} title="3 · Réglez par virement avec votre motif">
        <p>
          Effectuez votre virement en indiquant le <strong>motif</strong>
          affiché dans votre email de confirmation. Le motif est unique et
          contient automatiquement le n° de commande, votre nom et le produit
          commandé. Il nous permet d'associer le virement à votre commande.
          Dès que le virement est reçu, votre commande passe en statut «
          confirmée » et vous en êtes informé par email.
        </p>
        <h3>Exemple de motif</h3>
        <p style={{ backgroundColor: '#f7f3ec', fontFamily: 'monospace', padding: '12px 16px', borderRadius: 8 }}>
          CMD 42 JEAN-MARTIN ROBOT-ASPIRATEUR-LIDAR-NAVIGATE
        </p>
      </LegalSection>

      <LegalSection n={4} title="4 · Livraison et suivi">
        <p>
          Nous préparons et expédions votre commande sous 2 à 5 jours ouvrés.
          Vous pouvez suivre l'avancement à tout moment grâce à la page{' '}
          <a href="/suivi-commande">Suivi de commande</a>, et vous recevez un
          email à chaque changement de statut (confirmée, expédiée, livrée).
        </p>
        <p style={{ marginTop: 8, fontSize: 13 }}>
          💳 Paiement : notre boutique ne demande <strong>jamais</strong> vos
          coordonnées bancaires de carte. Le paiement se fait uniquement par
          virement SEPA.
        </p>
      </LegalSection>

      <LegalSection n={5} title="Questions fréquentes">
        <p><strong>Combien de temps pour que ma commande soit expédiée ?</strong></p>
        <p style={{ marginTop: -8 }}>
          Votre commande est expédiée après réception de votre virement.
          Compter 2 à 5 jours ouvrés une fois confirmée.
        </p>
        <p style={{ marginTop: 16 }}><strong>Que faire si je n'ai pas reçu l'email de confirmation ?</strong></p>
        <p style={{ marginTop: -8 }}>
          Vérifiez vos spams. Sinon, contactez-nous via la page{' '}
          <a href="/contact">Contact</a> — nous renvoyons les coordonnées de
          virement dès que possible.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
