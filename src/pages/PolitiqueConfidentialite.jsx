import { LegalLayout, LegalSection } from '../components/LegalLayout';
import { company } from '../data/company';

export default function PolitiqueConfidentialite() {
  return (
    <LegalLayout
      title="Política de privacidad"
      intro="La forma en que recopilamos, utilizamos y protegemos sus datos personales, de conformidad con el RGPD y la Ley Orgánica española 3/2018 (LOPDGDD)."
      updated={company.updated}
    >
      <LegalSection n={1} title="Responsable del tratamiento">
        <dl className="legal-dl">
          <dt>Responsable</dt>
          <dd>{company.name}</dd>
          <dt>CIF / NIF</dt>
          <dd>{company.cif}</dd>
          <dt>Domicilio</dt>
          <dd>{company.address}</dd>
          <dt>Correo electrónico de protección de datos</dt>
          <dd>{company.emailData}</dd>
          <dt>Delegado de protección de datos</dt>
          <dd>No aplicable — entidad consolidada del grupo BSH (BSH Finance and Holding GmbH)</dd>
        </dl>
      </LegalSection>

      <LegalSection n={2} title="Normativa aplicable">
        <p>Esta política cumple con:</p>
        <ul className="legal-list">
          <li>Reglamento (UE) 2016/679 (RGPD)</li>
          <li>Ley Orgánica 3/2018, de protección de datos personales y garantía de los derechos digitales (LOPDGDD)</li>
          <li>Ley 34/2002 (LSSI-CE)</li>
        </ul>
      </LegalSection>

      <LegalSection n={3} title="Datos que recopilamos">
        <p>Según el uso que haga del sitio, podemos recopilar:</p>
        <ul className="legal-list">
          <li><strong>Datos de registro / cuenta:</strong> nombre, apellidos, correo electrónico, contraseña (cifrada)</li>
          <li><strong>Datos de compra:</strong> dirección de envío y facturación, teléfono, historial de pedidos</li>
          <li><strong>Datos de pago:</strong> gestionados por nuestra pasarela de pago segura: no almacenamos los datos completos de la tarjeta bancaria en nuestros servidores</li>
          <li><strong>Datos de navegación:</strong> dirección IP, cookies, tipo de dispositivo y de navegador (ver la política de cookies)</li>
          <li><strong>Comunicaciones:</strong> mensajes enviados a través de los formularios de contacto o del servicio de atención al cliente</li>
        </ul>
      </LegalSection>

      <LegalSection n={4} title="Finalidades del tratamiento">
        <div className="legal-scroll">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Finalidad</th>
                <th>Base jurídica</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Gestionar los pedidos y los envíos</td><td>Ejecución del contrato (art. 6.1.b RGPD)</td></tr>
              <tr><td>Facturación y obligaciones fiscales</td><td>Obligación legal (art. 6.1.c RGPD)</td></tr>
              <tr><td>Servicio de atención al cliente</td><td>Ejecución del contrato / interés legítimo</td></tr>
              <tr><td>Envío de comunicaciones comerciales</td><td>Consentimiento (art. 6.1.a RGPD)</td></tr>
              <tr><td>Mejora del sitio y análisis de uso</td><td>Consentimiento (cookies analíticas)</td></tr>
              <tr><td>Prevención del fraude</td><td>Interés legítimo</td></tr>
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection n={5} title="Conservación de los datos">
        <p>
          Los datos se conservan durante el tiempo necesario para la finalidad para la que fueron
          recogidos y, en su caso, durante los plazos legales aplicables
          (obligaciones contables y fiscales: 6 años; garantías de los productos: según la normativa vigente).
        </p>
      </LegalSection>

      <LegalSection n={6} title="Destinatarios y cesiones">
        <p>Los datos pueden comunicarse a:</p>
        <ul className="legal-list">
          <li>Empresas de transporte y logística, para la entrega de los pedidos</li>
          <li>Bancos y pasarelas de pago</li>
          <li>Administraciones públicas, cuando exista una obligación legal</li>
          <li>Proveedores de servicios tecnológicos (alojamiento, correo electrónico), que actúan como encargados del tratamiento con un contrato conforme al art. 28 RGPD</li>
        </ul>
        <p>
          No se realiza ninguna transferencia internacional de datos fuera del Espacio Económico Europeo,
          salvo que el proveedor disponga de garantías adecuadas (cláusulas contractuales tipo,
          decisión de adecuación, etc.).
        </p>
      </LegalSection>

      <LegalSection n={7} title="Derechos del usuario">
        <p>Puede ejercer en cualquier momento sus derechos de:</p>
        <ul className="legal-list">
          <li>Acceso</li>
          <li>Rectificación</li>
          <li>Supresión («derecho al olvido»)</li>
          <li>Oposición</li>
          <li>Limitación del tratamiento</li>
          <li>Portabilidad de los datos</li>
        </ul>
        <p>
          Para ello, escríbanos a <strong>{company.emailData}</strong> acompañando una copia de su documento de identidad.
          También puede presentar una reclamación ante la Agencia Española de Protección de
          Datos (AEPD — www.aepd.es) si considera que sus derechos no han sido respetados.
        </p>
      </LegalSection>

      <LegalSection n={8} title="Medidas de seguridad">
        <p>
          Aplicamos medidas técnicas y organizativas adecuadas (cifrado SSL/TLS,
          control de accesos, copias de seguridad) para proteger sus datos frente a accesos no autorizados,
          pérdida o alteración.
        </p>
      </LegalSection>

      <LegalSection n={9} title="Menores">
        <p>
          Los servicios del sitio están dirigidos a personas mayores de edad (18 años o más). No recopilamos
          conscientemente los datos de menores sin el consentimiento de sus padres o tutores.
        </p>
      </LegalSection>

      <LegalSection n={10} title="Modificaciones">
        <p>
          Esta política puede actualizarse para adaptarse a los cambios legislativos o a las
          modificaciones del servicio. Le recomendamos consultarla periódicamente.
          Última actualización: {company.updated}.
        </p>
      </LegalSection>

      <p className="legal-note">
        Este documento se facilita a título informativo y no constituye asesoramiento jurídico.
      </p>
    </LegalLayout>
  );
}