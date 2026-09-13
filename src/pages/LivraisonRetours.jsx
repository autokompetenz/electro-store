import { LegalLayout, LegalSection } from '../components/LegalLayout';
import { company } from '../data/company';

export default function LivraisonRetours() {
  return (
    <LegalLayout
      title="Envíos, devoluciones y reembolsos"
      intro="Las zonas de envío, los plazos, los costes y el procedimiento de devolución y reembolso de sus pedidos."
      updated={company.updated}
    >
      <LegalSection n={1} title="Zonas y plazos de entrega">
        <div className="legal-scroll">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Zona</th>
                <th>Plazo estimado</th>
                <th>Coste</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>España — Península</td>
                <td>De 2 a 5 días hábiles</td>
                <td>Gratis</td>
              </tr>
              <tr>
                <td>Baleares</td>
                <td>De 3 a 6 días hábiles</td>
                <td>9,90 €</td>
              </tr>
              <tr>
                <td>Canarias, Ceuta y Melilla</td>
                <td>De 5 a 10 días hábiles</td>
                <td>19,90 € + posibles tasas IGIC / portuarias</td>
              </tr>
              <tr>
                <td>Portugal / UE</td>
                <td>De 3 a 6 días hábiles</td>
                <td>9,90 €</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Los electrodomésticos de gran volumen (lavadoras, frigoríficos, hornos) pueden requerir
          un plazo de entrega mayor y, en algunos casos, una entrega a domicilio con cita previa.
        </p>
      </LegalSection>

      <LegalSection n={2} title="Instalación y desembalaje">
        <p>
          Opcionalmente, se puede ofrecer un servicio de instalación y retirada del embalaje para
          los aparatos de gran volumen. Este servicio se indica al realizar el pedido y se factura
          por separado, salvo oferta especial. Contacte con nosotros antes de finalizar su pedido para más información.
        </p>
      </LegalSection>

      <LegalSection n={3} title="Devoluciones">
        <ul className="legal-list">
          <li>
            Plazo: <strong>30 días naturales</strong> desde la recepción (siendo el derecho legal de
            desistimiento de 14 días, lo ampliamos a 30 días para la mayoría de los productos no instalados)
          </li>
          <li>
            El producto debe devolverse en su embalaje original, sin signos de uso, con todos
            los accesorios y manuales
          </li>
          <li>
            Los gastos de devolución de los electrodomésticos de gran volumen corren a cargo del cliente en caso de
            simple desistimiento; los asume la empresa en caso de producto defectuoso
          </li>
          <li>
            No se acepta la devolución de productos que hayan sido instalados y puestos en funcionamiento, salvo
            defecto de fabricación (por razones de higiene o seguridad, según el tipo de producto)
          </li>
        </ul>
      </LegalSection>

      <LegalSection n={4} title="Producto defectuoso o dañado en el transporte">
        <p>
          Si el producto llega dañado o defectuoso, el cliente debe comunicarlo en un plazo de{' '}
          <strong>48 horas</strong> a <strong>{company.emailSupport}</strong>, adjuntando
          fotografías. Organizamos la recogida, la sustitución o la reparación sin coste
          para el cliente.
        </p>
      </LegalSection>

      <LegalSection n={5} title="Reembolsos">
        <p>
          Los reembolsos se realizan por el mismo medio de pago utilizado en la compra, en
          un plazo máximo de 14 días desde la recepción del producto devuelto o de la prueba de
          su reenvío.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Garantía del fabricante">
        <p>
          Independientemente de la garantía legal de conformidad (véanse las CGV, artículo 8), muchos
          fabricantes ofrecen garantías comerciales adicionales y un servicio técnico oficial.
          Le recomendamos conservar la factura y el número de serie del producto.
        </p>
      </LegalSection>

      <p className="legal-note">
        Este documento se facilita a título informativo y no constituye asesoramiento jurídico.
      </p>
    </LegalLayout>
  );
}