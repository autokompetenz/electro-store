import { LegalLayout, LegalSection } from '../components/LegalLayout';
import { company } from '../data/company';

export default function MentionsLegales() {
  return (
    <LegalLayout
      title="Aviso legal"
      intro="Información relativa al editor y al alojamiento del sitio web, de conformidad con el artículo 10 de la Ley española 34/2002 (LSSI-CE)."
      updated={company.updated}
    >
      <LegalSection n={1} title="Identificación">
        <p>En aplicación del artículo 10 de la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE), se facilitan los siguientes datos relativos al editor del sitio web:</p>
        <dl className="legal-dl">
          <dt>Denominación social</dt>
          <dd>{company.name}</dd>
          <dt>Nombre comercial</dt>
          <dd>{company.brand}</dd>
          <dt>CIF / NIF</dt>
          <dd>{company.cif}</dd>
          <dt>Forma jurídica</dt>
          <dd>{company.legalForm}</dd>
          <dt>Domicilio social</dt>
          <dd>{company.address}</dd>
          <dt>Inscripción en el registro</dt>
          <dd>{company.registry}</dd>
          <dt>Administrador único</dt>
          <dd>{company.admin}</dd>
          <dt>Capital social</dt>
          <dd>{company.capital}</dd>
          <dt>Correo electrónico de contacto</dt>
          <dd>{company.email}</dd>
          <dt>Sitio web</dt>
          <dd>www.electro-domesticos.com</dd>
        </dl>
      </LegalSection>

      <LegalSection n={2} title="Objeto">
        <p>
          El presente sitio web tiene por objeto la venta en línea de electrodomésticos y productos asociados.
          El acceso y el uso del sitio otorgan la condición de usuario e implican
          la aceptación plena y expresa de las condiciones incluidas en el presente Aviso Legal,
          así como en la política de privacidad y las condiciones generales de venta.
        </p>
      </LegalSection>

      <LegalSection n={3} title="Condiciones de uso">
        <p>
          El usuario se compromete a hacer un uso adecuado del sitio y a no emplearlo para
          actividades ilícitas, contrarias a los derechos de terceros o susceptibles de dañar,
          inutilizar o saturar el sitio.
        </p>
      </LegalSection>

      <LegalSection n={4} title="Propiedad intelectual e industrial">
        <ul className="legal-list">
          <li>
            Todos los contenidos del sitio (textos, imágenes, logotipos, diseño, código fuente, marcas) son
            propiedad de {company.name} o de terceros que han autorizado su uso, y están
            protegidos por la normativa en materia de propiedad intelectual e industrial.
          </li>
          <li>
            Las marcas de los fabricantes de electrodomésticos (Bosch, Siemens, BSH y otras) citadas en
            el sitio pertenecen a sus respectivos titulares y solo se mencionan a título
            informativo o de identificación del producto, sin implicar relación, patrocinio
            o afiliación alguna con dichas marcas, salvo indicación expresa.
          </li>
        </ul>
      </LegalSection>

      <LegalSection n={5} title="Exclusión de responsabilidad">
        <p>{company.name} no será responsable de los daños derivados de:</p>
        <ul className="legal-list">
          <li>Interrupciones, virus informáticos o fallos de funcionamiento del sitio web</li>
          <li>Uso inapropiado del sitio por parte del usuario</li>
          <li>Fallos de disponibilidad o de continuidad del funcionamiento del sitio y de sus servicios</li>
        </ul>
      </LegalSection>

      <LegalSection n={6} title="Legislación aplicable y jurisdicción">
        <p>
          Las presentes condiciones se rigen por la legislación española. Para la resolución de
          cualquier controversia, las partes se someten a los tribunales de Zaragoza, sin perjuicio
          de los derechos que asisten al consumidor en virtud de la normativa de protección de los
          consumidores y usuarios (fuero del domicilio del consumidor).
        </p>
      </LegalSection>

      <LegalSection n={7} title="Resolución de litigios en línea">
        <p>
          De conformidad con el Reglamento (UE) 524/2013, existe una plataforma europea de resolución
          de litigios en línea, accesible en la dirección:{' '}
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noreferrer" style={{ color: 'var(--terracotta)' }}>
            ec.europa.eu/consumers/odr
          </a>
        </p>
      </LegalSection>

      <p className="legal-note">
        Este documento se facilita a título informativo y no constituye asesoramiento jurídico.
        Se recomienda su revisión por un abogado especializado en derecho digital español antes de su publicación.
      </p>
    </LegalLayout>
  );
}