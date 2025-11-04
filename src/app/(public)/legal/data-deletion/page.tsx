import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Eliminación de Datos - InmoDash',
  description: 'Instrucciones para solicitar la eliminación de tus datos de InmoDash',
}

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-8">Eliminación de Datos de Usuario</h1>
          
          <div className="space-y-6 text-white/80">
            <p className="text-lg">
              En InmoDash respetamos tu derecho a la privacidad y al control de tus datos personales. 
              Esta página explica cómo puedes solicitar la eliminación de tus datos.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">¿Qué Datos se Eliminan?</h2>
              <p className="mb-4">
                Cuando solicitas la eliminación de tu cuenta, se eliminan permanentemente:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Tu información de perfil (nombre, email, teléfono)</li>
                <li>Información de tu empresa/inmobiliaria</li>
                <li>Todos los edificios y propiedades registrados</li>
                <li>Contratos de alquiler y pagos</li>
                <li>Información de inquilinos y propietarios</li>
                <li>Documentos subidos a la plataforma</li>
                <li>Conversaciones del bot de WhatsApp</li>
                <li>Configuración de WhatsApp Business</li>
                <li>Historial de actividad y logs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Datos que se Conservan</h2>
              <p className="mb-4">
                Por razones legales y de seguridad, conservamos temporalmente:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Registros de transacciones financieras (según ley fiscal - 5 años)</li>
                <li>Logs de seguridad y auditoría (90 días)</li>
                <li>Información necesaria para cumplir obligaciones legales</li>
              </ul>
              <p className="mt-4 text-sm text-white/60">
                Estos datos se mantienen de forma segura y se eliminan automáticamente cuando expira el período de retención legal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Cómo Solicitar la Eliminación</h2>
              
              <div className="space-y-6">
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-3">Opción 1: Desde tu Cuenta</h3>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Inicia sesión en tu cuenta de InmoDash</li>
                    <li>Ve a <strong>Configuración</strong> → <strong>Cuenta</strong></li>
                    <li>Desplázate hasta <strong>"Zona de Peligro"</strong></li>
                    <li>Click en <strong>"Eliminar Cuenta"</strong></li>
                    <li>Confirma la eliminación ingresando tu contraseña</li>
                  </ol>
                  <p className="mt-4 text-sm text-yellow-300">
                    ⚠️ Esta acción es irreversible. Todos tus datos se eliminarán permanentemente.
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-3">Opción 2: Por Correo Electrónico</h3>
                  <p className="mb-4">
                    Si no puedes acceder a tu cuenta, envía un correo a:
                  </p>
                  <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
                    <p className="text-lg font-semibold text-blue-300">📧 privacy@inmodash.com.ar</p>
                  </div>
                  <p className="mt-4 mb-3">
                    Incluye en tu correo:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Asunto: "Solicitud de Eliminación de Datos"</li>
                    <li>Tu nombre completo</li>
                    <li>Email registrado en InmoDash</li>
                    <li>Razón de la solicitud (opcional)</li>
                    <li>Confirmación de que entiendes que la acción es irreversible</li>
                  </ul>
                </div>

                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-3">Opción 3: Para Usuarios de WhatsApp Bot</h3>
                  <p className="mb-4">
                    Si solo usaste el bot de WhatsApp (sin registrarte en la plataforma):
                  </p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Envía un mensaje de WhatsApp al número del bot con: <strong>"Eliminar mis datos"</strong></li>
                    <li>O envía un correo a privacy@inmodash.com.ar con tu número de teléfono</li>
                  </ol>
                  <p className="mt-4 text-sm text-white/60">
                    Eliminaremos todas las conversaciones y datos asociados a tu número de teléfono.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Tiempo de Procesamiento</h2>
              <div className="bg-green-500/20 rounded-lg p-6 border border-green-500/30">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    <span><strong>Eliminación desde la cuenta:</strong> Inmediata (datos eliminados en menos de 24 horas)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    <span><strong>Solicitud por email:</strong> 3-5 días hábiles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    <span><strong>Datos de WhatsApp:</strong> 24-48 horas</span>
                  </li>
                </ul>
              </div>
              <p className="mt-4 text-sm text-white/60">
                Recibirás un correo de confirmación cuando tus datos hayan sido eliminados completamente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Antes de Eliminar tu Cuenta</h2>
              <div className="bg-yellow-500/20 rounded-lg p-6 border border-yellow-500/30">
                <p className="text-yellow-300 font-semibold mb-3">⚠️ Considera lo siguiente:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Descarga tus datos importantes antes de eliminar</li>
                  <li>Cancela cualquier suscripción activa</li>
                  <li>Guarda copias de contratos y documentos</li>
                  <li>Notifica a inquilinos y propietarios si es necesario</li>
                  <li>Desactiva el bot de WhatsApp si lo tienes configurado</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Alternativas a la Eliminación</h2>
              <p className="mb-4">
                Si no estás seguro de eliminar tu cuenta, considera:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Desactivar temporalmente:</strong> Puedes pausar tu cuenta sin eliminar datos</li>
                <li><strong>Exportar datos:</strong> Descarga toda tu información antes de decidir</li>
                <li><strong>Cancelar suscripción:</strong> Mantén tu cuenta pero cancela el plan de pago</li>
                <li><strong>Contactar soporte:</strong> Podemos ayudarte a resolver problemas sin eliminar tu cuenta</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Preguntas Frecuentes</h2>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">¿Puedo recuperar mi cuenta después de eliminarla?</h4>
                  <p className="text-white/70">
                    No. La eliminación es permanente e irreversible. Deberás crear una nueva cuenta si deseas usar 
                    el servicio nuevamente.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">¿Qué pasa con mis suscripciones activas?</h4>
                  <p className="text-white/70">
                    Se cancelan automáticamente. No se realizan reembolsos por períodos no utilizados.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">¿Los inquilinos y propietarios pierden acceso?</h4>
                  <p className="text-white/70">
                    Sí. Toda la información asociada a tu cuenta se elimina, incluyendo el acceso de terceros.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">¿Puedo eliminar solo algunos datos?</h4>
                  <p className="text-white/70">
                    Sí. Desde tu cuenta puedes eliminar propiedades, contratos o documentos específicos sin eliminar 
                    toda la cuenta.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contacto</h2>
              <p className="mb-4">
                Para cualquier consulta sobre eliminación de datos:
              </p>
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="text-2xl mr-3">📧</span>
                    <div>
                      <p className="font-semibold text-white">Email</p>
                      <p className="text-blue-300">privacy@inmodash.com.ar</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <span className="text-2xl mr-3">🌐</span>
                    <div>
                      <p className="font-semibold text-white">Web</p>
                      <p className="text-blue-300">www.inmodash.com.ar</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <span className="text-2xl mr-3">⏰</span>
                    <div>
                      <p className="font-semibold text-white">Tiempo de respuesta</p>
                      <p className="text-white/70">24-48 horas hábiles</p>
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mt-8 pt-8 border-t border-white/20">
              <p className="text-sm text-white/60">
                Esta política cumple con la Ley de Protección de Datos Personales N° 25.326 de Argentina, 
                el GDPR de la Unión Europea, y las políticas de Meta para aplicaciones de WhatsApp Business.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
