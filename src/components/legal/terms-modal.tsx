'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Términos y Condiciones</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)] px-6 py-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-white/60 text-sm mb-6">
                Última actualización: {new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">1. ACEPTACIÓN DE LOS TÉRMINOS</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Al acceder y utilizar Inmobiliaria Pro (en adelante, "la Plataforma"), usted acepta estar legalmente vinculado por estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.
                </p>
                <p className="text-white/80 leading-relaxed">
                  Estos términos constituyen un acuerdo legal vinculante entre usted (ya sea personalmente o en nombre de una entidad) y Momento IA S.A. (en adelante, "la Empresa", "nosotros" o "nuestro") con respecto al acceso y uso de la Plataforma.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">2. DEFINICIONES</h3>
                <ul className="space-y-3 text-white/80">
                  <li><strong className="text-white">Usuario:</strong> Persona física o jurídica que utiliza la Plataforma.</li>
                  <li><strong className="text-white">Cuenta:</strong> Registro único creado por el Usuario para acceder a los servicios.</li>
                  <li><strong className="text-white">Contenido:</strong> Toda información, datos, textos, software, música, sonido, fotografías, gráficos, videos, mensajes u otros materiales.</li>
                  <li><strong className="text-white">Servicios:</strong> Todas las funcionalidades, herramientas y recursos proporcionados por la Plataforma.</li>
                  <li><strong className="text-white">Suscripción:</strong> Plan de pago que otorga acceso a funcionalidades premium de la Plataforma.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">3. REGISTRO Y CUENTA DE USUARIO</h3>
                <h4 className="text-lg font-semibold text-white mb-3">3.1. Requisitos de Registro</h4>
                <p className="text-white/80 leading-relaxed mb-4">
                  Para utilizar ciertos servicios de la Plataforma, debe crear una cuenta proporcionando información precisa, actual y completa. Usted se compromete a:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
                  <li>Proporcionar información veraz y actualizada</li>
                  <li>Mantener la seguridad de su contraseña</li>
                  <li>Notificar inmediatamente cualquier uso no autorizado de su cuenta</li>
                  <li>Ser responsable de todas las actividades realizadas bajo su cuenta</li>
                </ul>

                <h4 className="text-lg font-semibold text-white mb-3">3.2. Elegibilidad</h4>
                <p className="text-white/80 leading-relaxed mb-4">
                  Debe ser mayor de 18 años y tener capacidad legal para celebrar contratos vinculantes. Si representa a una empresa u organización, garantiza tener la autoridad necesaria para vincular a dicha entidad a estos términos.
                </p>

                <h4 className="text-lg font-semibold text-white mb-3">3.3. Suspensión y Terminación</h4>
                <p className="text-white/80 leading-relaxed">
                  Nos reservamos el derecho de suspender o terminar su cuenta en cualquier momento, sin previo aviso, si determinamos que ha violado estos términos o si su conducta es perjudicial para otros usuarios o para la Plataforma.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">4. SERVICIOS Y SUSCRIPCIONES</h3>
                <h4 className="text-lg font-semibold text-white mb-3">4.1. Descripción de Servicios</h4>
                <p className="text-white/80 leading-relaxed mb-4">
                  La Plataforma proporciona herramientas de gestión inmobiliaria que incluyen, pero no se limitan a:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
                  <li>Gestión de propiedades y edificios</li>
                  <li>Control de contratos y pagos</li>
                  <li>Sistema de documentación</li>
                  <li>Análisis y reportes</li>
                  <li>Chatbot con inteligencia artificial</li>
                  <li>Firma digital de documentos</li>
                </ul>

                <h4 className="text-lg font-semibold text-white mb-3">4.2. Planes y Precios</h4>
                <p className="text-white/80 leading-relaxed mb-4">
                  Los precios de las suscripciones se establecen en dólares estadounidenses (USD) y están sujetos a cambios con previo aviso de 30 días. Los usuarios actuales mantendrán su precio durante el período de facturación vigente.
                </p>

                <h4 className="text-lg font-semibold text-white mb-3">4.3. Período de Prueba</h4>
                <p className="text-white/80 leading-relaxed mb-4">
                  Ofrecemos un período de prueba gratuito de 30 días. Al finalizar este período, se le cobrará automáticamente a menos que cancele antes del vencimiento. No se requiere tarjeta de crédito para iniciar el período de prueba.
                </p>

                <h4 className="text-lg font-semibold text-white mb-3">4.4. Facturación y Renovación</h4>
                <p className="text-white/80 leading-relaxed mb-4">
                  Las suscripciones se renuevan automáticamente al final de cada período de facturación. Usted autoriza el cargo automático a su método de pago registrado. Puede cancelar la renovación automática en cualquier momento desde la configuración de su cuenta.
                </p>

                <h4 className="text-lg font-semibold text-white mb-3">4.5. Reembolsos</h4>
                <p className="text-white/80 leading-relaxed">
                  Los pagos son no reembolsables excepto cuando lo requiera la ley aplicable. Si cancela su suscripción, mantendrá acceso hasta el final del período de facturación pagado.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">5. USO ACEPTABLE</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Usted se compromete a NO utilizar la Plataforma para:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80">
                  <li>Violar cualquier ley o regulación local, estatal, nacional o internacional</li>
                  <li>Infringir derechos de propiedad intelectual de terceros</li>
                  <li>Transmitir material ilegal, amenazante, abusivo, difamatorio u obsceno</li>
                  <li>Intentar obtener acceso no autorizado a sistemas o redes</li>
                  <li>Interferir con el funcionamiento normal de la Plataforma</li>
                  <li>Realizar ingeniería inversa, descompilar o desensamblar cualquier parte del software</li>
                  <li>Utilizar robots, scrapers u otros medios automatizados sin autorización</li>
                  <li>Revender o redistribuir los servicios sin consentimiento expreso</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">6. PROPIEDAD INTELECTUAL</h3>
                <h4 className="text-lg font-semibold text-white mb-3">6.1. Derechos de la Empresa</h4>
                <p className="text-white/80 leading-relaxed mb-4">
                  La Plataforma y todo su contenido, características y funcionalidad (incluyendo pero no limitado a información, software, texto, displays, imágenes, video y audio, y el diseño, selección y disposición de los mismos) son propiedad de Momento IA S.A., sus licenciantes u otros proveedores de dicho material y están protegidos por derechos de autor, marcas comerciales, patentes, secretos comerciales y otras leyes de propiedad intelectual.
                </p>

                <h4 className="text-lg font-semibold text-white mb-3">6.2. Licencia Limitada</h4>
                <p className="text-white/80 leading-relaxed mb-4">
                  Se le otorga una licencia limitada, no exclusiva, intransferible y revocable para acceder y utilizar la Plataforma únicamente para sus propósitos comerciales internos de acuerdo con estos términos.
                </p>

                <h4 className="text-lg font-semibold text-white mb-3">6.3. Contenido del Usuario</h4>
                <p className="text-white/80 leading-relaxed">
                  Usted conserva todos los derechos sobre el contenido que carga a la Plataforma. Al cargar contenido, nos otorga una licencia mundial, no exclusiva, libre de regalías para usar, almacenar, mostrar y transmitir dicho contenido únicamente con el propósito de proporcionar los servicios.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">7. PRIVACIDAD Y PROTECCIÓN DE DATOS</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  El uso de la Plataforma también está regido por nuestra Política de Privacidad, que describe cómo recopilamos, usamos y protegemos su información personal. Al utilizar la Plataforma, usted acepta la recopilación y uso de información de acuerdo con nuestra Política de Privacidad.
                </p>
                <p className="text-white/80 leading-relaxed">
                  Cumplimos con todas las leyes aplicables de protección de datos, incluyendo el Reglamento General de Protección de Datos (GDPR) de la Unión Europea y la Ley de Protección de Datos Personales de Argentina (Ley 25.326).
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">8. DESCARGO DE RESPONSABILIDAD</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  LA PLATAFORMA SE PROPORCIONA "TAL CUAL" Y "SEGÚN DISPONIBILIDAD" SIN GARANTÍAS DE NINGÚN TIPO, YA SEAN EXPRESAS O IMPLÍCITAS, INCLUYENDO, PERO NO LIMITADO A, GARANTÍAS IMPLÍCITAS DE COMERCIABILIDAD, IDONEIDAD PARA UN PROPÓSITO PARTICULAR Y NO INFRACCIÓN.
                </p>
                <p className="text-white/80 leading-relaxed mb-4">
                  NO GARANTIZAMOS QUE:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
                  <li>La Plataforma funcionará sin interrupciones o errores</li>
                  <li>Los defectos serán corregidos</li>
                  <li>La Plataforma esté libre de virus u otros componentes dañinos</li>
                  <li>Los resultados del uso de la Plataforma cumplirán sus requisitos</li>
                </ul>
                <p className="text-white/80 leading-relaxed">
                  Usted asume toda la responsabilidad y riesgo por el uso de la Plataforma y cualquier contenido obtenido a través de ella.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">9. LIMITACIÓN DE RESPONSABILIDAD</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY APLICABLE, EN NINGÚN CASO MOMENTO IA S.A., SUS DIRECTORES, EMPLEADOS, SOCIOS, AGENTES, PROVEEDORES O AFILIADOS SERÁN RESPONSABLES POR DAÑOS INDIRECTOS, INCIDENTALES, ESPECIALES, CONSECUENTES O PUNITIVOS, INCLUYENDO SIN LIMITACIÓN, PÉRDIDA DE BENEFICIOS, DATOS, USO, FONDO DE COMERCIO U OTRAS PÉRDIDAS INTANGIBLES, RESULTANTES DE:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
                  <li>Su acceso o uso o incapacidad de acceder o usar la Plataforma</li>
                  <li>Cualquier conducta o contenido de terceros en la Plataforma</li>
                  <li>Cualquier contenido obtenido de la Plataforma</li>
                  <li>Acceso no autorizado, uso o alteración de sus transmisiones o contenido</li>
                </ul>
                <p className="text-white/80 leading-relaxed">
                  NUESTRA RESPONSABILIDAD TOTAL NO EXCEDERÁ EL MONTO QUE USTED HAYA PAGADO A LA EMPRESA EN LOS ÚLTIMOS DOCE (12) MESES, O CIEN DÓLARES ESTADOUNIDENSES ($100 USD), LO QUE SEA MAYOR.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">10. INDEMNIZACIÓN</h3>
                <p className="text-white/80 leading-relaxed">
                  Usted acepta defender, indemnizar y mantener indemne a Momento IA S.A. y sus licenciantes y licenciatarios, y sus empleados, contratistas, agentes, funcionarios y directores, de y contra todas y cada una de las reclamaciones, daños, obligaciones, pérdidas, responsabilidades, costos o deudas, y gastos (incluyendo pero no limitado a honorarios de abogados), resultantes de o que surjan de: (a) su uso y acceso a la Plataforma; (b) su violación de cualquier término de estos Términos; (c) su violación de cualquier derecho de terceros, incluyendo sin limitación cualquier derecho de autor, propiedad, o derecho de privacidad; o (d) cualquier reclamo de que su Contenido causó daño a un tercero.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">11. MODIFICACIONES</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Nos reservamos el derecho de modificar o reemplazar estos Términos en cualquier momento a nuestra sola discreción. Si una revisión es material, intentaremos proporcionar un aviso de al menos 30 días antes de que entren en vigencia los nuevos términos.
                </p>
                <p className="text-white/80 leading-relaxed">
                  Al continuar accediendo o usando nuestra Plataforma después de que esas revisiones entren en vigencia, usted acepta estar sujeto a los términos revisados. Si no está de acuerdo con los nuevos términos, debe dejar de usar la Plataforma.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">12. LEY APLICABLE Y JURISDICCIÓN</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Estos Términos se regirán e interpretarán de acuerdo con las leyes de la República Argentina, sin dar efecto a ningún principio de conflictos de leyes.
                </p>
                <p className="text-white/80 leading-relaxed">
                  Cualquier disputa que surja de o en relación con estos Términos estará sujeta a la jurisdicción exclusiva de los tribunales de la Ciudad Autónoma de Buenos Aires, Argentina.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">13. DISPOSICIONES GENERALES</h3>
                <h4 className="text-lg font-semibold text-white mb-3">13.1. Acuerdo Completo</h4>
                <p className="text-white/80 leading-relaxed mb-4">
                  Estos Términos constituyen el acuerdo completo entre usted y Momento IA S.A. con respecto a la Plataforma y reemplazan todos los acuerdos anteriores y contemporáneos.
                </p>

                <h4 className="text-lg font-semibold text-white mb-3">13.2. Divisibilidad</h4>
                <p className="text-white/80 leading-relaxed mb-4">
                  Si alguna disposición de estos Términos se considera inválida o inaplicable, dicha disposición se eliminará o limitará en la medida mínima necesaria, y las disposiciones restantes continuarán en pleno vigor y efecto.
                </p>

                <h4 className="text-lg font-semibold text-white mb-3">13.3. Renuncia</h4>
                <p className="text-white/80 leading-relaxed mb-4">
                  Ninguna renuncia por parte de la Empresa a cualquier término o condición establecida en estos Términos se considerará una renuncia adicional o continua de dicho término o condición o una renuncia de cualquier otro término o condición.
                </p>

                <h4 className="text-lg font-semibold text-white mb-3">13.4. Cesión</h4>
                <p className="text-white/80 leading-relaxed">
                  Usted no puede ceder o transferir estos Términos, por operación de ley o de otra manera, sin nuestro consentimiento previo por escrito. Cualquier intento de cesión o transferencia en violación de lo anterior será nulo. Podemos ceder libremente estos Términos sin restricción.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">14. CONTACTO</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Si tiene alguna pregunta sobre estos Términos y Condiciones, puede contactarnos:
                </p>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-2 text-white/80">
                  <p><strong className="text-white">Momento IA S.A.</strong></p>
                  <p>Email: legal@momentoia.com</p>
                  <p>Teléfono: +54 11 1234-5678</p>
                  <p>Dirección: Av. Corrientes 1234, CABA, Argentina</p>
                </div>
              </section>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-white/60 text-sm">
                  Al utilizar Inmobiliaria Pro, usted reconoce que ha leído, entendido y acepta estar sujeto a estos Términos y Condiciones.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 px-6 py-4">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-medium shadow-lg"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  )
}
