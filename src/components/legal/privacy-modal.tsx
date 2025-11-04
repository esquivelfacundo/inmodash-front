'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface PrivacyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
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
              <h2 className="text-2xl font-bold text-white">Política de Privacidad</h2>
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
                <h3 className="text-xl font-bold text-white mb-4">1. INTRODUCCIÓN</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Momento IA S.A. (en adelante, "nosotros", "nuestro" o "la Empresa") se compromete a proteger su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos su información cuando utiliza InmoDash (la "Plataforma").
                </p>
                <p className="text-white/80 leading-relaxed">
                  Al utilizar nuestra Plataforma, usted acepta la recopilación y uso de información de acuerdo con esta política. Si no está de acuerdo con nuestras políticas y prácticas, no utilice la Plataforma.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">2. INFORMACIÓN QUE RECOPILAMOS</h3>
                
                <h4 className="text-lg font-semibold text-white mb-3">2.1. Información que Usted Proporciona</h4>
                <p className="text-white/80 leading-relaxed mb-4">
                  Recopilamos información que usted proporciona directamente, incluyendo:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
                  <li><strong className="text-white">Información de Cuenta:</strong> Nombre, dirección de correo electrónico, número de teléfono, cargo, contraseña</li>
                  <li><strong className="text-white">Información Empresarial:</strong> Nombre de la empresa, CUIT/RUT, dirección, teléfono, sitio web</li>
                  <li><strong className="text-white">Información de Pago:</strong> Datos de tarjeta de crédito/débito, información de facturación (procesada por proveedores terceros seguros)</li>
                  <li><strong className="text-white">Contenido del Usuario:</strong> Información sobre propiedades, clientes, contratos, documentos y cualquier otro contenido que cargue</li>
                  <li><strong className="text-white">Comunicaciones:</strong> Correos electrónicos, mensajes de chat y otras comunicaciones con nosotros</li>
                </ul>

                <h4 className="text-lg font-semibold text-white mb-3">2.2. Información Recopilada Automáticamente</h4>
                <p className="text-white/80 leading-relaxed mb-4">
                  Cuando accede y utiliza la Plataforma, recopilamos automáticamente:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
                  <li><strong className="text-white">Información de Dispositivo:</strong> Dirección IP, tipo de navegador, sistema operativo, identificadores únicos de dispositivo</li>
                  <li><strong className="text-white">Información de Uso:</strong> Páginas visitadas, tiempo de permanencia, clics, funciones utilizadas, búsquedas realizadas</li>
                  <li><strong className="text-white">Información de Ubicación:</strong> Ubicación aproximada basada en dirección IP</li>
                  <li><strong className="text-white">Cookies y Tecnologías Similares:</strong> Datos recopilados a través de cookies, web beacons y tecnologías similares</li>
                </ul>

                <h4 className="text-lg font-semibold text-white mb-3">2.3. Información de Terceros</h4>
                <p className="text-white/80 leading-relaxed">
                  Podemos recibir información sobre usted de terceros, como proveedores de servicios de autenticación, servicios de verificación de identidad, y fuentes públicamente disponibles.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">3. CÓMO UTILIZAMOS SU INFORMACIÓN</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Utilizamos la información recopilada para:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80">
                  <li>Proporcionar, mantener y mejorar nuestros servicios</li>
                  <li>Procesar transacciones y enviar confirmaciones</li>
                  <li>Enviar información técnica, actualizaciones, alertas de seguridad y mensajes administrativos</li>
                  <li>Responder a sus comentarios, preguntas y solicitudes de soporte</li>
                  <li>Comunicarnos con usted sobre productos, servicios, ofertas y eventos</li>
                  <li>Monitorear y analizar tendencias, uso y actividades</li>
                  <li>Detectar, investigar y prevenir fraude y actividades ilegales</li>
                  <li>Personalizar y mejorar su experiencia</li>
                  <li>Facilitar concursos, sorteos y promociones</li>
                  <li>Cumplir con obligaciones legales y regulatorias</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">4. COMPARTIR INFORMACIÓN</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Podemos compartir su información en las siguientes circunstancias:
                </p>

                <h4 className="text-lg font-semibold text-white mb-3">4.1. Proveedores de Servicios</h4>
                <p className="text-white/80 leading-relaxed mb-4">
                  Compartimos información con proveedores terceros que realizan servicios en nuestro nombre, como:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
                  <li>Procesamiento de pagos (Stripe, PayPal)</li>
                  <li>Alojamiento de datos (AWS, Google Cloud)</li>
                  <li>Análisis y métricas (Google Analytics)</li>
                  <li>Servicios de email (SendGrid)</li>
                  <li>Soporte al cliente (Intercom, Zendesk)</li>
                </ul>

                <h4 className="text-lg font-semibold text-white mb-3">4.2. Cumplimiento Legal</h4>
                <p className="text-white/80 leading-relaxed mb-4">
                  Podemos divulgar información si creemos de buena fe que es necesario para:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
                  <li>Cumplir con una obligación legal</li>
                  <li>Proteger y defender nuestros derechos o propiedad</li>
                  <li>Prevenir o investigar posibles irregularidades</li>
                  <li>Proteger la seguridad personal de usuarios o del público</li>
                  <li>Protegernos contra responsabilidad legal</li>
                </ul>

                <h4 className="text-lg font-semibold text-white mb-3">4.3. Transferencias Comerciales</h4>
                <p className="text-white/80 leading-relaxed mb-4">
                  En caso de fusión, adquisición, reorganización o venta de activos, su información puede ser transferida como parte de esa transacción.
                </p>

                <h4 className="text-lg font-semibold text-white mb-3">4.4. Con su Consentimiento</h4>
                <p className="text-white/80 leading-relaxed">
                  Podemos compartir información con terceros cuando usted nos da su consentimiento explícito para hacerlo.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">5. SEGURIDAD DE DATOS</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Implementamos medidas de seguridad técnicas, administrativas y físicas diseñadas para proteger su información contra acceso no autorizado, alteración, divulgación o destrucción, incluyendo:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
                  <li>Encriptación SSL/TLS para datos en tránsito</li>
                  <li>Encriptación AES-256 para datos en reposo</li>
                  <li>Autenticación de dos factores (2FA)</li>
                  <li>Controles de acceso basados en roles</li>
                  <li>Auditorías de seguridad regulares</li>
                  <li>Monitoreo continuo de amenazas</li>
                  <li>Backups automáticos y cifrados</li>
                  <li>Cumplimiento con estándares ISO 27001</li>
                </ul>
                <p className="text-white/80 leading-relaxed">
                  Sin embargo, ningún método de transmisión por Internet o almacenamiento electrónico es 100% seguro. No podemos garantizar la seguridad absoluta de su información.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">6. RETENCIÓN DE DATOS</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Retenemos su información personal durante el tiempo que sea necesario para cumplir con los propósitos descritos en esta Política de Privacidad, a menos que la ley requiera o permita un período de retención más largo.
                </p>
                <p className="text-white/80 leading-relaxed">
                  Cuando elimine su cuenta, eliminaremos o anonimizaremos su información personal dentro de los 90 días, excepto cuando debamos retenerla para cumplir con obligaciones legales, resolver disputas o hacer cumplir nuestros acuerdos.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">7. SUS DERECHOS</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Dependiendo de su ubicación, puede tener los siguientes derechos:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
                  <li><strong className="text-white">Acceso:</strong> Solicitar una copia de la información personal que tenemos sobre usted</li>
                  <li><strong className="text-white">Rectificación:</strong> Solicitar la corrección de información inexacta o incompleta</li>
                  <li><strong className="text-white">Eliminación:</strong> Solicitar la eliminación de su información personal</li>
                  <li><strong className="text-white">Portabilidad:</strong> Recibir sus datos en un formato estructurado y de uso común</li>
                  <li><strong className="text-white">Oposición:</strong> Oponerse al procesamiento de su información personal</li>
                  <li><strong className="text-white">Restricción:</strong> Solicitar la restricción del procesamiento</li>
                  <li><strong className="text-white">Retirar Consentimiento:</strong> Retirar su consentimiento en cualquier momento</li>
                </ul>
                <p className="text-white/80 leading-relaxed">
                  Para ejercer estos derechos, contáctenos en privacy@momentoia.com. Responderemos a su solicitud dentro de los 30 días.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">8. COOKIES Y TECNOLOGÍAS DE SEGUIMIENTO</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Utilizamos cookies y tecnologías similares para:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80 mb-4">
                  <li>Mantener su sesión activa</li>
                  <li>Recordar sus preferencias</li>
                  <li>Analizar el uso de la Plataforma</li>
                  <li>Personalizar contenido y anuncios</li>
                  <li>Mejorar la seguridad</li>
                </ul>
                <p className="text-white/80 leading-relaxed">
                  Puede configurar su navegador para rechazar cookies, pero esto puede afectar la funcionalidad de la Plataforma.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">9. TRANSFERENCIAS INTERNACIONALES</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Su información puede ser transferida y mantenida en servidores ubicados fuera de su país de residencia, donde las leyes de protección de datos pueden ser diferentes.
                </p>
                <p className="text-white/80 leading-relaxed">
                  Cuando transferimos información fuera de Argentina, implementamos salvaguardas apropiadas, como cláusulas contractuales estándar aprobadas por autoridades de protección de datos.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">10. PRIVACIDAD DE MENORES</h3>
                <p className="text-white/80 leading-relaxed">
                  Nuestra Plataforma no está dirigida a menores de 18 años. No recopilamos intencionalmente información personal de menores. Si descubrimos que hemos recopilado información de un menor, la eliminaremos inmediatamente.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">11. CAMBIOS A ESTA POLÍTICA</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos sobre cambios materiales publicando la nueva política en esta página y actualizando la fecha de "Última actualización".
                </p>
                <p className="text-white/80 leading-relaxed">
                  Le recomendamos revisar esta Política periódicamente. Los cambios son efectivos cuando se publican en esta página.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">12. CUMPLIMIENTO NORMATIVO</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Cumplimos con las siguientes regulaciones de protección de datos:
                </p>
                <ul className="list-disc list-inside space-y-2 text-white/80">
                  <li>Ley de Protección de Datos Personales de Argentina (Ley 25.326)</li>
                  <li>Reglamento General de Protección de Datos (GDPR) de la UE</li>
                  <li>California Consumer Privacy Act (CCPA)</li>
                  <li>Lei Geral de Proteção de Dados (LGPD) de Brasil</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">13. CONTACTO</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos, contáctenos:
                </p>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-2 text-white/80">
                  <p><strong className="text-white">Oficial de Protección de Datos</strong></p>
                  <p><strong className="text-white">Momento IA S.A.</strong></p>
                  <p>Email: privacy@momentoia.com</p>
                  <p>Email DPO: dpo@momentoia.com</p>
                  <p>Teléfono: +54 11 1234-5678</p>
                  <p>Dirección: Av. Corrientes 1234, CABA, Argentina</p>
                </div>
              </section>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-white/60 text-sm">
                  Al utilizar InmoDash, usted reconoce que ha leído y comprendido esta Política de Privacidad y acepta el procesamiento de su información personal como se describe aquí.
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
