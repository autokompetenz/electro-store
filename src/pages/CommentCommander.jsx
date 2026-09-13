import { LegalLayout, LegalSection } from '../components/LegalLayout';
import { company } from '../data/company';

export default function CommentCommander() {
  return (
    <LegalLayout
      title="¿Cómo hacer un pedido?"
      intro="Hacer un pedido en Electro Store es muy fácil: elige tus productos, confirma el pedido y paga por transferencia indicando el concepto. Recibirás un correo en cada paso."
      updated={company.updated}
    >
      <LegalSection n={1} title="1 · Elige tus productos">
        <p>
          Navega por el <a href="/catalogue">catálogo</a>. Haz clic en «Añadir
          al carrito» en los productos que te interesen y, cuando estés listo,
          abre tu carrito desde la parte superior de la página.
        </p>
      </LegalSection>

      <LegalSection n={2} title="2 · Haz el pedido">
        <p>
          Indica tu nombre, tu correo electrónico y tu dirección de entrega y
          confirma el pedido. En cuanto el pedido quede registrado, recibirás
          al instante un correo de confirmación con los <strong>datos de pago
          por transferencia bancaria</strong> (IBAN, BIC y titular de la
          cuenta).
        </p>
      </LegalSection>

      <LegalSection n={3} title="3 · Paga por transferencia indicando tu concepto">
        <p>
          Realiza tu transferencia indicando el <strong>concepto</strong>
          que aparece en tu correo de confirmación. El concepto es único e
          incluye automáticamente el número de pedido, tu nombre y el producto
          solicitado. Nos permite asociar la transferencia a tu pedido.
          En cuanto recibimos la transferencia, tu pedido pasa a estado «
          confirmado » y te lo comunicamos por correo.
        </p>
        <h3>Ejemplo de concepto</h3>
        <p style={{ backgroundColor: '#f7f3ec', fontFamily: 'monospace', padding: '12px 16px', borderRadius: 8 }}>
          CMD 42 JEAN-MARTIN ROBOT-ASPIRATEUR-LIDAR-NAVIGATE
        </p>
      </LegalSection>

      <LegalSection n={4} title="4 · Envío y seguimiento">
        <p>
          Preparamos y enviamos tu pedido en un plazo de 2 a 5 días laborables.
          Puedes seguir su estado en cualquier momento desde la página{' '}
          <a href="/suivi-commande">Seguimiento de pedido</a>, y recibirás un
          correo con cada cambio de estado (confirmado, enviado, entregado).
        </p>
        <p style={{ marginTop: 8, fontSize: 13 }}>
          💳 Pago: nuestra tienda <strong>nunca</strong> te pide los datos de
          tu tarjeta bancaria. El pago se realiza únicamente por transferencia
          SEPA.
        </p>
      </LegalSection>

      <LegalSection n={5} title="Preguntas frecuentes">
        <p><strong>¿Cuánto tarda en enviarse mi pedido?</strong></p>
        <p style={{ marginTop: -8 }}>
          Tu pedido se envía después de recibir tu transferencia.
          Cuenta de 2 a 5 días laborables una vez confirmado.
        </p>
        <p style={{ marginTop: 16 }}><strong>¿Qué hago si no he recibido el correo de confirmación?</strong></p>
        <p style={{ marginTop: -8 }}>
          Revisa la carpeta de spam. Si no aparece, contáctanos desde la página{' '}
          <a href="/contact">Contacto</a>: te reenviamos los datos de la
          transferencia en cuanto sea posible.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
