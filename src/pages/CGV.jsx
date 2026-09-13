import { LegalLayout, LegalSection } from '../components/LegalLayout';
import { company } from '../data/company';

export default function CGV() {
  return (
    <LegalLayout
      title="Condiciones Generales de Venta"
      intro="Las condiciones que rigen sus compras en nuestra tienda en línea, de conformidad con el Real Decreto Legislativo español 1/2007 (TRLGDCU) para el comercio electrónico B2C."
      updated={company.updated}
    >
      <LegalSection n={1} title="Objeto e identificación del vendedor">
        <p>
          Las presentes Condiciones Generales de Venta regulan la compra de productos en el sitio web
          {' '}<strong>{company.brand}</strong>, explotado por {company.name}, con CIF {company.cif},
          con domicilio en {company.address}, correo electrónico {company.emailSales}.
        </p>
      </LegalSection>

      <LegalSection n={2} title="Productos">
        <p>
          Los productos ofrecidos (electrodomésticos y accesorios) se describen con la mayor
          exactitud posible: características técnicas, precio, disponibilidad e imágenes. Las imágenes
          tienen carácter ilustrativo y pueden no corresponder exactamente al producto real.
          Las marcas de los fabricantes (Bosch, Siemens, BSH y otras) pertenecen a sus respectivos titulares.
        </p>
      </LegalSection>

      <LegalSection n={3} title="Precios e impuestos">
        <p>
          Todos los precios se muestran en euros (€) e incluyen el IVA vigente en España. Los gastos
          de envío se indican por separado antes de finalizar el pedido, salvo que se especifique un envío gratuito.
        </p>
      </LegalSection>

      <LegalSection n={4} title="Proceso de compra">
        <ol className="legal-list">
          <li>Selección del producto y adición al carrito</li>
          <li>Introducción de los datos de envío y facturación</li>
          <li>Elección del método de pago</li>
          <li>Confirmación del pedido (aceptación expresa de las presentes CGV)</li>
          <li>Envío de un correo electrónico de confirmación con el resumen del pedido</li>
        </ol>
      </LegalSection>

      <LegalSection n={5} title="Medios de pago">
        <p>Aceptamos los siguientes medios de pago:</p>
        <ul className="legal-list">
          <li>Tarjeta de crédito / débito (Visa, Mastercard, Maestro)</li>
          <li>Bizum</li>
          <li>PayPal</li>
          <li>Transferencia bancaria</li>
        </ul>
        <p>
          Todas las transacciones se procesan a través de pasarelas de pago seguras y cifradas.
          No almacenamos los datos completos de la tarjeta bancaria en nuestros servidores.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Plazos y condiciones de entrega">
        <ul className="legal-list">
          <li>Plazo estimado de entrega: <strong>de 2 a 5 días hábiles</strong> para la península; plazos diferenciados para Baleares, Canarias, Ceuta y Melilla (ver la página Envíos y devoluciones)</li>
          <li>El transporte lo realizan empresas de transporte colaboradoras</li>
          <li>
            El riesgo de pérdida o deterioro se transfiere al consumidor en el momento en que este,
            o un tercero designado por él, toma posesión material del producto
          </li>
        </ul>
      </LegalSection>

      <LegalSection n={7} title="Derecho de desistimiento">
        <p>
          De conformidad con el artículo 102 y siguientes del TRLGDCU, el cliente dispone de{' '}
          <strong>14 días naturales</strong> desde la recepción del producto para desistir
          sin justificación, salvo las excepciones legales (productos personalizados o productos precintados
          por razones de higiene ya abiertos).
        </p>
        <p>
          Para ejercer este derecho, el cliente debe comunicarlo a <strong>{company.emailSales}</strong> o
          mediante el formulario de desistimiento disponible en el sitio web. Los gastos de devolución corren
          a cargo de la empresa en caso de producto defectuoso; en caso de un simple desistimiento, corren
          a cargo del cliente, salvo acuerdo en contrario. El reembolso se realiza en un plazo máximo de 14 días
          desde la notificación (o desde la recepción del producto devuelto, si es posterior).
        </p>
      </LegalSection>

      <LegalSection n={8} title="Garantías">
        <p>
          Todos los productos gozan de la garantía legal de conformidad de{' '}
          <strong>3 años</strong> (art. 120 TRLGDCU, para los contratos posteriores al 01/01/2022) a
          partir de la entrega. Además, el fabricante puede ofrecer garantías comerciales adicionales,
          según las condiciones que este determine.
        </p>
        <p>
          En caso de falta de conformidad, el cliente tiene derecho a la reparación, la sustitución,
          la reducción del precio o la resolución del contrato, de conformidad con la normativa vigente.
        </p>
      </LegalSection>

      <LegalSection n={9} title="Servicio de atención al cliente y reclamaciones">
        <p>
          Para cualquier reclamación, el cliente puede contactar con <strong>{company.emailSupport}</strong>. {company.name} pone a
          disposición del consumidor formularios de reclamación, de conformidad con la normativa autonómica aplicable.
        </p>
      </LegalSection>

      <LegalSection n={10} title="Resolución de litigios">
        <p>
          En caso de conflicto, el consumidor puede recurrir a la Plataforma europea de resolución
          de litigios en línea:{' '}
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noreferrer" style={{ color: 'var(--terracotta)' }}>
            ec.europa.eu/consumers/odr
          </a>
        </p>
      </LegalSection>

      <LegalSection n={11} title="Legislación aplicable">
        <p>
          Las presentes CGV se rigen por la legislación española, en particular el Real Decreto
          Legislativo 1/2007 (TRLGDCU) y la Ley 34/2002 (LSSI-CE).
        </p>
      </LegalSection>

      <p className="legal-note">
        Este documento se facilita a título informativo y no constituye asesoramiento jurídico.
      </p>
    </LegalLayout>
  );
}