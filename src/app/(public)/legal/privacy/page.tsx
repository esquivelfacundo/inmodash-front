import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad - InmoDash',
  description: 'Política de privacidad de InmoDash - Sistema de gestión inmobiliaria',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-8">Política de Privacidad</h1>
          
          <div className="space-y-6 text-white/80">
            <p className="text-sm text-white/60">
              Última actualización: {new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Información que Recopilamos</h2>
              <p className="mb-4">
                En InmoDash, recopilamos la siguiente información:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Información de registro: nombre, correo electrónico, teléfono</li>
                <li>Información de la empresa: nombre de la inmobiliaria, CUIT, dirección</li>
                <li>Información de propiedades: edificios, departamentos, contratos</li>
                <li>Información de inquilinos y propietarios</li>
                <li>Conversaciones del bot de WhatsApp (cuando está activo)</li>
                <li>Información de uso y análisis de la plataforma</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Cómo Usamos tu Información</h2>
              <p className="mb-4">
                Utilizamos la información recopilada para:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Proporcionar y mantener nuestros servicios</li>
                <li>Gestionar tu cuenta y propiedades</li>
                <li>Procesar pagos y transacciones</li>
                <li>Enviar notificaciones importantes sobre el servicio</li>
                <li>Mejorar nuestros servicios y desarrollar nuevas funcionalidades</li>
                <li>Proporcionar atención al cliente</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Compartir Información</h2>
              <p className="mb-4">
                No vendemos ni alquilamos tu información personal a terceros. Podemos compartir información con:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Proveedores de servicios que nos ayudan a operar la plataforma</li>
                <li>Autoridades legales cuando sea requerido por ley</li>
                <li>En caso de fusión o adquisición de la empresa</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Seguridad de los Datos</h2>
              <p>
                Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>Encriptación de datos en tránsito y en reposo</li>
                <li>Autenticación segura con tokens JWT</li>
                <li>Acceso restringido a datos personales</li>
                <li>Monitoreo continuo de seguridad</li>
                <li>Copias de seguridad regulares</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Bot de WhatsApp</h2>
              <p className="mb-4">
                Si activas el bot de WhatsApp:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Almacenamos las conversaciones para mejorar el servicio</li>
                <li>Procesamos mensajes con OpenAI para entender las consultas</li>
                <li>Los datos se asocian únicamente a tu cuenta</li>
                <li>Puedes desactivar el bot en cualquier momento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Tus Derechos</h2>
              <p className="mb-4">
                Tienes derecho a:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Acceder a tu información personal</li>
                <li>Corregir datos inexactos</li>
                <li>Solicitar la eliminación de tus datos</li>
                <li>Exportar tus datos</li>
                <li>Oponerte al procesamiento de tus datos</li>
                <li>Revocar consentimientos otorgados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Retención de Datos</h2>
              <p>
                Conservamos tu información mientras tu cuenta esté activa o según sea necesario para:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>Proporcionar servicios</li>
                <li>Cumplir con obligaciones legales</li>
                <li>Resolver disputas</li>
                <li>Hacer cumplir nuestros acuerdos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Cookies y Tecnologías Similares</h2>
              <p>
                Utilizamos cookies y tecnologías similares para:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>Mantener tu sesión activa</li>
                <li>Recordar tus preferencias</li>
                <li>Analizar el uso de la plataforma</li>
                <li>Mejorar la experiencia del usuario</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Cambios a esta Política</h2>
              <p>
                Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre cambios significativos 
                publicando la nueva política en esta página y actualizando la fecha de "última actualización".
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Contacto</h2>
              <p className="mb-4">
                Si tienes preguntas sobre esta política de privacidad, contáctanos:
              </p>
              <ul className="list-none space-y-2">
                <li>📧 Email: privacy@inmodash.com.ar</li>
                <li>🌐 Web: www.inmodash.com.ar</li>
              </ul>
            </section>

            <section className="mt-8 pt-8 border-t border-white/20">
              <p className="text-sm text-white/60">
                Esta política de privacidad cumple con la Ley de Protección de Datos Personales N° 25.326 de Argentina 
                y el Reglamento General de Protección de Datos (GDPR) de la Unión Europea.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
