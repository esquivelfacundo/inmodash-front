import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos y Condiciones - InmoDash',
  description: 'Términos y condiciones del servicio de InmoDash',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-8">Términos y Condiciones del Servicio</h1>
          
          <div className="space-y-6 text-white/80">
            <p className="text-sm text-white/60">
              Última actualización: {new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Aceptación de los Términos</h2>
              <p>
                Al acceder y utilizar InmoDash ("el Servicio"), aceptas estar sujeto a estos Términos y Condiciones. 
                Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro servicio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Descripción del Servicio</h2>
              <p className="mb-4">
                InmoDash es una plataforma de gestión inmobiliaria que proporciona:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Gestión de edificios y propiedades</li>
                <li>Administración de contratos de alquiler</li>
                <li>Control de pagos y vencimientos</li>
                <li>Gestión de inquilinos y propietarios</li>
                <li>Bot de WhatsApp para atención al cliente (opcional)</li>
                <li>Reportes y análisis</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Registro y Cuenta</h2>
              <p className="mb-4">
                Para utilizar el Servicio, debes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Proporcionar información precisa y completa durante el registro</li>
                <li>Mantener la seguridad de tu contraseña</li>
                <li>Notificarnos inmediatamente sobre cualquier uso no autorizado</li>
                <li>Ser responsable de todas las actividades en tu cuenta</li>
                <li>Tener al menos 18 años de edad</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Planes y Pagos</h2>
              <p className="mb-4">
                <strong>Período de Prueba:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Ofrecemos un período de prueba gratuito de 30 días</li>
                <li>No se requiere tarjeta de crédito para el período de prueba</li>
                <li>Puedes cancelar en cualquier momento durante la prueba</li>
              </ul>
              
              <p className="mb-4">
                <strong>Suscripción Profesional:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Después del período de prueba, se requiere suscripción</li>
                <li>Los pagos se procesan de forma segura</li>
                <li>Puedes cancelar tu suscripción en cualquier momento</li>
                <li>No hay reembolsos por períodos parciales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Uso Aceptable</h2>
              <p className="mb-4">
                Te comprometes a NO:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Usar el Servicio para actividades ilegales</li>
                <li>Intentar acceder a cuentas de otros usuarios</li>
                <li>Interferir con el funcionamiento del Servicio</li>
                <li>Realizar ingeniería inversa del software</li>
                <li>Compartir tu cuenta con terceros</li>
                <li>Usar el Servicio para enviar spam o contenido malicioso</li>
                <li>Violar derechos de propiedad intelectual</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Bot de WhatsApp</h2>
              <p className="mb-4">
                Si activas el bot de WhatsApp:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Eres responsable de configurar correctamente las credenciales de Meta</li>
                <li>Debes cumplir con las políticas de WhatsApp Business</li>
                <li>Eres responsable de las conversaciones generadas por el bot</li>
                <li>Debes tener los permisos necesarios para usar WhatsApp Business API</li>
                <li>Los costos de WhatsApp API son tu responsabilidad</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Propiedad Intelectual</h2>
              <p className="mb-4">
                El Servicio y su contenido original están protegidos por derechos de autor y otras leyes. Tú conservas 
                los derechos sobre los datos que ingresas en la plataforma.
              </p>
              <p>
                InmoDash conserva todos los derechos sobre:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>El software y código de la plataforma</li>
                <li>El diseño y la interfaz de usuario</li>
                <li>Las marcas comerciales y logos</li>
                <li>La documentación y materiales de ayuda</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Privacidad y Datos</h2>
              <p>
                El uso de tus datos personales está regido por nuestra{' '}
                <a href="/legal/privacy" className="text-blue-400 hover:underline">
                  Política de Privacidad
                </a>
                . Al usar el Servicio, aceptas el procesamiento de tus datos según esa política.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Disponibilidad del Servicio</h2>
              <p className="mb-4">
                Nos esforzamos por mantener el Servicio disponible 24/7, pero:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Puede haber interrupciones por mantenimiento</li>
                <li>No garantizamos disponibilidad ininterrumpida</li>
                <li>Podemos modificar o discontinuar funcionalidades</li>
                <li>Notificaremos sobre cambios significativos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Limitación de Responsabilidad</h2>
              <p className="mb-4">
                En la máxima medida permitida por la ley:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>El Servicio se proporciona "tal cual" sin garantías</li>
                <li>No somos responsables por pérdidas de datos o ingresos</li>
                <li>No garantizamos resultados específicos</li>
                <li>Nuestra responsabilidad está limitada al monto pagado por el servicio</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Terminación</h2>
              <p className="mb-4">
                Podemos suspender o terminar tu acceso si:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violas estos Términos y Condiciones</li>
                <li>No pagas tu suscripción</li>
                <li>Usas el Servicio de manera fraudulenta</li>
                <li>Lo solicitamos por razones legales</li>
              </ul>
              <p className="mt-4">
                Tú puedes cancelar tu cuenta en cualquier momento desde la configuración.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Modificaciones</h2>
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos sobre 
                cambios significativos por correo electrónico o mediante un aviso en la plataforma. El uso continuado 
                del Servicio después de los cambios constituye tu aceptación de los nuevos términos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Ley Aplicable</h2>
              <p>
                Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa se resolverá en 
                los tribunales de la Ciudad Autónoma de Buenos Aires.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">14. Contacto</h2>
              <p className="mb-4">
                Para preguntas sobre estos términos:
              </p>
              <ul className="list-none space-y-2">
                <li>📧 Email: legal@inmodash.com.ar</li>
                <li>🌐 Web: www.inmodash.com.ar</li>
              </ul>
            </section>

            <section className="mt-8 pt-8 border-t border-white/20">
              <p className="text-sm text-white/60">
                Al usar InmoDash, confirmas que has leído, entendido y aceptado estos Términos y Condiciones.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
