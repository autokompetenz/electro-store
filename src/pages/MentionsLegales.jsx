import { LegalLayout, LegalSection } from '../components/LegalLayout';
import { company } from '../data/company';

export default function MentionsLegales() {
  return (
    <LegalLayout
      title="Mentions légales"
      intro="Informations relatives à l'éditeur et à l'hébergement du site, conformément à l'article 10 de la loi espagnole 34/2002 (LSSI-CE)."
      updated={company.updated}
    >
      <LegalSection n={1} title="Identification">
        <p>En application de l'article 10 de la loi 34/2002, du 11 juillet, relative aux services de la société de l'information et au commerce électronique (LSSI-CE), voici les données relatives à l'éditeur du site :</p>
        <dl className="legal-dl">
          <dt>Dénomination sociale</dt>
          <dd>{company.name}</dd>
          <dt>Nom commercial</dt>
          <dd>{company.brand}</dd>
          <dt>CIF / NIF</dt>
          <dd>{company.cif}</dd>
          <dt>Forme juridique</dt>
          <dd>{company.legalForm}</dd>
          <dt>Domicile social</dt>
          <dd>{company.address}</dd>
          <dt>Inscription au registre</dt>
          <dd>{company.registry}</dd>
          <dt>Administrateur unique</dt>
          <dd>{company.admin}</dd>
          <dt>Capital social</dt>
          <dd>{company.capital}</dd>
          <dt>Email de contact</dt>
          <dd>{company.email}</dd>
          <dt>Site web</dt>
          <dd>www.electro-domesticos.com</dd>
        </dl>
      </LegalSection>

      <LegalSection n={2} title="Objet">
        <p>
          Le présent site a pour objet la vente en ligne d'électroménagers et de produits associés.
          L'accès et l'utilisation du site confèrent la condition d'utilisateur et impliquent
          l'acceptation pleine et entière des conditions incluses dans le présent Aviso Legal,
          ainsi que dans la politique de confidentialité et les conditions générales de vente.
        </p>
      </LegalSection>

      <LegalSection n={3} title="Conditions d'utilisation">
        <p>
          L'utilisateur s'engage à faire un usage adapté du site et à ne pas l'employer pour des
          activités illicites, contraires aux droits des tiers, ou susceptibles d'endommager,
          de rendre inutilisable ou de saturer le site.
        </p>
      </LegalSection>

      <LegalSection n={4} title="Propriété intellectuelle et industrielle">
        <ul className="legal-list">
          <li>
            Tous les contenus du site (textes, images, logos, design, code source, marques) sont
            la propriété de {company.name} ou de tiers ayant autorisé leur utilisation, et sont
            protégés par la réglementation en matière de propriété intellectuelle et industrielle.
          </li>
          <li>
            Les marques de fabricants d'électroménagers (Bosch, Siemens, BSH et autres) citées sur
            le site appartiennent à leurs titulaires respectifs et ne sont mentionnées qu'à titre
            informatif ou d'identification de produit, sans impliquer de relation, de parrainage
            ou d'affiliation avec ces marques, sauf indication expresse.
          </li>
        </ul>
      </LegalSection>

      <LegalSection n={5} title="Exclusion de responsabilité">
        <p>{company.name} ne saurait être tenue responsable des dommages découlant de :</p>
        <ul className="legal-list">
          <li>Interruptions, virus informatiques ou dysfonctionnements du site web</li>
          <li>Usage inapproprié du site par l'utilisateur</li>
          <li>Défaillances de disponibilité ou de continuité du fonctionnement du site et de ses services</li>
        </ul>
      </LegalSection>

      <LegalSection n={6} title="Législation applicable et juridiction">
        <p>
          Les présentes conditions sont régies par la législation espagnole. Pour la résolution de
          toute controverse, les parties se soumettent aux tribunaux de Saragosse, sans préjudice
          des droits dont dispose le consommateur en vertu de la réglementation de protection des
          consommateurs et usagers (for du domicile du consommateur).
        </p>
      </LegalSection>

      <LegalSection n={7} title="Résolution de litiges en ligne">
        <p>
          Conformément au règlement (UE) 524/2013, il existe une plateforme européenne de résolution
          des litiges en ligne, accessible à l'adresse :{' '}
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noreferrer" style={{ color: 'var(--terracotta)' }}>
            ec.europa.eu/consumers/odr
          </a>
        </p>
      </LegalSection>

      <p className="legal-note">
        Ce document est fourni à titre informatif et ne constitue pas un conseil juridique.
        Une révision par un avocat spécialisé en droit numérique espagnol est recommandée avant publication.
      </p>
    </LegalLayout>
  );
}