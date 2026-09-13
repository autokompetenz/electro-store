import { LegalLayout, LegalSection } from '../components/LegalLayout';
import { company } from '../data/company';

export default function PolitiqueCookies() {
  return (
    <LegalLayout
      title="Política de cookies"
      intro="Información sobre las cookies utilizadas en este sitio y sobre cómo gestionarlas, de conformidad con las recomendaciones de la AEPD."
      updated={company.updated}
    >
      <LegalSection n={1} title="¿Qué es una cookie?">
        <p>
          Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita
          nuestro sitio web. Permiten reconocer su navegador y mejorar su
          experiencia de usuario.
        </p>
      </LegalSection>

      <LegalSection n={2} title="Tipos de cookies utilizadas">
        <div className="legal-scroll">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Finalidad</th>
                <th>Consentimiento requerido</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Técnicas / necesarias</td>
                <td>Carrito de compra, inicio de sesión, seguridad</td>
                <td>No</td>
              </tr>
              <tr>
                <td>Preferencias</td>
                <td>Idioma, moneda, configuración de visualización</td>
                <td>Sí</td>
              </tr>
              <tr>
                <td>Analíticas (p. ej., Google Analytics)</td>
                <td>Estadísticas de uso y de navegación</td>
                <td>Sí</td>
              </tr>
              <tr>
                <td>Publicitarias / de marketing (p. ej., Meta Ads, Google Ads)</td>
                <td>Publicidad personalizada, remarketing</td>
                <td>Sí</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection n={3} title="Gestión del consentimiento">
        <p>
          Desde su primera visita, un panel le permite aceptar, rechazar o configurar
          las cookies de forma granular, de conformidad con la guía de cookies de la AEPD. Puede
          modificar sus preferencias en cualquier momento a través del enlace «Configuración de cookies» en el pie de página.
        </p>
      </LegalSection>

      <LegalSection n={4} title="Cookies de terceros">
        <p>
          Algunas cookies son instaladas por proveedores externos (Google Analytics, pasarela
          de pago, etc.). El tratamiento de estos datos se rige por las políticas de privacidad
          de dichos terceros.
        </p>
      </LegalSection>

      <LegalSection n={5} title="Cómo desactivar las cookies desde el navegador">
        <p>Puede configurar su navegador para bloquear o eliminar las cookies:</p>
        <ul className="legal-list">
          <li>Chrome / Edge / Firefox / Safari: opciones disponibles en Configuración &gt; Privacidad</li>
        </ul>
      </LegalSection>

      <LegalSection n={6} title="Más información">
        <p>
          Para cualquier consulta relativa a esta política, contacte con nosotros en: <strong>{company.emailData}</strong>
        </p>
      </LegalSection>

      <p className="legal-note">
        Esta política es una base genérica. Antes de su publicación debe integrarse una lista actualizada
        de las cookies realmente instaladas (mediante una herramienta de auditoría como Cookiebot/CookieYes).
      </p>
    </LegalLayout>
  );
}