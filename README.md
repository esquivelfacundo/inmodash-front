# Sistema de Gestión Inmobiliaria

Una plataforma completa para la gestión de propiedades inmobiliarias desarrollada con React, TypeScript y Next.js.

## Características Principales

### Gestión de Edificios
- **Registro completo de edificios** con información básica (nombre, dirección, provincia, ciudad, titular)
- **Configuración flexible de pisos** con cantidad personalizable de departamentos por piso
- **Área total del edificio** y estadísticas automáticas
- **Vista detallada** con información completa y listado de departamentos

### Gestión de Departamentos
- **ID único automático** con formato personalizado (ej: N13C100001)
- **Información completa**: área, ambientes, piso, nomenclatura
- **Cálculos automáticos** de porcentajes de área y ambientes
- **Estados**: Disponible, Alquilado, En Refacción, Uso Propio
- **Comercialización**: En venta, No está en venta
- **Soporte para planos** (funcionalidad base implementada)
- **Gestión de inquilinos** integrada en cada unidad

### Gestión de Clientes e Inquilinos
- **Creación de clientes** desde cada departamento
- **Información completa del inquilino**:
  - Nombre o razón social
  - DNI / CUIT
  - Persona de contacto (nombre, teléfono, email, dirección)
  - Dirección del cliente
- **Sistema de documentación** (preparado para carga de archivos)
- **Dashboard de clientes** con métricas y seguimiento

### Sistema de Contratos
- **Contratos de locación** completos con:
  - Fechas de inicio y finalización
  - Cálculo automático de meses restantes
  - Visualización de contratos activos por departamento
- **Plan de pagos flexible**:
  - Monto inicial configurable
  - Tipos de actualización: fijo, por índice (IPC, ICL), por porcentaje
  - Fechas de actualización personalizables
  - Coeficiente mensual opcional
  - Intereses por mora configurables
- **Gestión de garantes**:
  - Múltiples garantes por contrato
  - Información completa: DNI, dirección, contacto
  - Documentación asociada (preparado para archivos)

### Dashboard Inteligente
- **Estadísticas en tiempo real** de edificios y departamentos
- **Visualización de datos** con gráficos y métricas
- **Actividad reciente** de edificios y departamentos
- **Navegación intuitiva** entre secciones

## Tecnologías Utilizadas

- **Frontend**: React 19.1.0 con TypeScript
- **Framework**: Next.js 15.5.4 (App Router)
- **Estilos**: Tailwind CSS 4.0 con diseño moderno y gradientes
- **Formularios**: React Hook Form + Zod para validación
- **Iconos**: Lucide React
- **Gestión de Estado**: Store personalizado en memoria
- **UI/UX**: Componentes reutilizables con animaciones y transiciones
- **Arquitectura**: Estructura modular con separación de responsabilidades

## Estructura del Proyecto

```
src/
├── app/                              # Páginas de Next.js (App Router)
│   ├── buildings/                   # Gestión de edificios
│   │   ├── [id]/                   # Detalle de edificio con acordeón por pisos
│   │   │   └── apartments/new/     # Crear departamento
│   │   ├── new/                    # Crear edificio
│   │   └── page.tsx                # Listado de edificios
│   ├── apartments/                  # Gestión de departamentos
│   │   └── [id]/                   # Detalle de departamento con historial
│   │       └── tenants/            # Gestión de inquilinos
│   │           ├── new/            # Crear cliente
│   │           └── [tenantId]/contract/new/  # Crear contrato
│   ├── clients/                     # Dashboard de clientes
│   │   └── page.tsx                # Listado y métricas
│   ├── layout.tsx                  # Layout principal
│   ├── page.tsx                    # Dashboard principal mejorado
│   └── globals.css                 # Estilos globales con animaciones
├── components/                      # Componentes reutilizables
│   ├── ui/                         # Componentes de interfaz base
│   │   ├── accordion.tsx           # Acordeón reutilizable
│   │   ├── badge.tsx               # Badges con variantes
│   │   ├── button.tsx              # Botones
│   │   ├── card.tsx                # Tarjetas
│   │   ├── empty-state.tsx         # Estados vacíos
│   │   ├── input.tsx               # Inputs
│   │   ├── label.tsx               # Labels
│   │   ├── loading.tsx             # Indicador de carga
│   │   ├── select.tsx              # Selectores
│   │   └── stat-card.tsx           # Tarjetas de estadísticas
│   ├── apartments/                 # Componentes de departamentos
│   │   └── apartment-card.tsx      # Tarjeta de departamento
│   ├── forms/                      # Formularios especializados
│   │   ├── building-form.tsx       # Formulario de edificios
│   │   ├── apartment-form.tsx      # Formulario de departamentos
│   │   ├── tenant-form.tsx         # Formulario de clientes
│   │   ├── guarantor-form.tsx      # Formulario de garantes
│   │   └── contract-form.tsx       # Formulario de contratos con períodos
│   └── layout/                     # Componentes de layout
│       └── navbar.tsx              # Navegación principal mejorada
├── data/                           # Gestión de datos
│   └── store.ts                    # Store con CRUD completo y relaciones
├── hooks/                          # Hooks personalizados
│   ├── useStore.ts                 # Hook para interactuar con el store
│   ├── useApartmentStatus.ts      # Hook para estados de departamentos
│   ├── useContractDates.ts        # Hook para cálculos de fechas
│   └── index.ts                    # Exportaciones centralizadas
├── lib/                            # Utilidades y configuraciones
│   ├── config/                     # Configuraciones
│   │   ├── options.ts              # Opciones para selectores
│   │   └── index.ts
│   ├── helpers/                    # Funciones helper del dominio
│   │   ├── contract.ts             # Helpers de contratos
│   │   └── index.ts
│   ├── validations/                # Schemas de validación (Zod)
│   │   ├── building.ts             # Validaciones de edificios
│   │   ├── tenant.ts               # Validaciones de clientes
│   │   ├── guarantor.ts            # Validaciones de garantes
│   │   ├── contract.ts             # Validaciones de contratos
│   │   └── index.ts
│   ├── constants.ts                # Constantes globales
│   └── utils.ts                    # Utilidades generales (formateo, cálculos)
├── types/                          # Definiciones de TypeScript
│   └── index.ts                    # Tipos completos con relaciones
└── utils/                          # Utilidades adicionales (futuro)
```

## Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repositorio]
cd proyecto-inmobiliaria

# Instalar dependencias
npm install --legacy-peer-deps

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3975`

## Funcionalidades Implementadas

### Completadas
- [x] Configuración del proyecto con TypeScript y Next.js
- [x] Estructura de carpetas organizada
- [x] Modelos de datos para Edificios y Departamentos
- [x] Formulario de registro de edificios
- [x] Creación de departamentos con ID único automático
- [x] Páginas de Perfil de departamentos
- [x] Cálculos automáticos de porcentajes
- [x] Dashboard con estadísticas
- [x] Sistema de navegación

### Recientemente Implementadas
- [x] **Gestión completa de Clientes (Inquilinos)**
  - Creación desde cada departamento
  - Información completa: nombre/razón social, DNI/CUIT, contacto, dirección
  - Dashboard de clientes con métricas en tiempo real
- [x] **Sistema de Contratos de Locación Avanzado**
  - Fechas de inicio y finalización
  - Cálculo automático de meses restantes
  - **Períodos de actualización individuales** con fecha, tipo y valor
  - Intereses por mora específicos por período (opcionales)
  - Soporte para actualización fija, por índice o porcentaje
  - Flexibilidad para dejar valores vacíos si aún no se conocen
- [x] **Gestión de Garantes Asociados a Clientes**
  - Garantes vinculados específicamente a cada cliente
  - No son globales, pertenecen al cliente que respaldan
  - Información completa de contacto y documentación
  - Múltiples garantes por cliente
- [x] **Historial de Alquileres por Departamento**
  - Registro automático de cada contrato
  - Visualización de inquilinos anteriores
  - Fechas de inicio y fin de cada alquiler
  - Montos inicial y final de cada período
- [x] **Creación Automática de Unidades**
  - Al crear un edificio, se generan automáticamente todas las unidades
  - Nomenclatura automática por piso y letra (1A, 1B, 2A, 2B, etc.)
  - Listas para ser completadas con información específica
- [x] **Acordeón de Departamentos por Piso**
  - Vista organizada por pisos en el perfil del edificio
  - Todos los pisos cerrados por defecto
  - Estadísticas por piso (disponibles, alquilados)
  - Fácil navegación y visualización
- [x] **UI/UX Profesional Mejorada**
  - Dashboard con gradientes y diseño moderno
  - Navbar sticky con efectos visuales
  - Componentes reutilizables (Badge, StatCard, EmptyState, Loading, Accordion)
  - Animaciones y transiciones suaves
  - Hover effects y feedback visual
  - Estados de carga mejorados
  - Paleta de colores profesional

### En Desarrollo
- [ ] Funcionalidad de carga de documentos (DNI, recibos, contratos)
- [ ] Historial de inquilinos por departamento
- [ ] Sistema de pagos y seguimiento mensual

### Futuras Funcionalidades
- [ ] Gestión de cocheras
- [ ] Gestión de locales comerciales
- [ ] Reportes y analytics avanzados
- [ ] Exportación de datos (PDF, Excel)
- [ ] Notificaciones automáticas de vencimientos
- [ ] API REST completa
- [ ] Sistema de recordatorios de pagos

## Arquitectura

### Generación de ID Único
Los departamentos tienen un ID único generado automáticamente con el formato:
```
N13C100001
├─ N1: Código del edificio (primeras 2 letras/números)
├─ 3: Número de piso
├─ C: Letra del departamento
├─ 1: Cantidad de ambientes
└─ 00001: Secuencia numérica (5 dígitos)
```

### Cálculos Automáticos
- **Porcentaje de Área**: `(área_departamento / área_total_edificio) * 100`
- **Porcentaje de Ambientes**: `(ambientes_departamento / total_ambientes_edificio) * 100`

### Store de Datos
Sistema de gestión de estado en memoria con:
- Operaciones CRUD completas
- Recálculo automático de porcentajes
- Validación de datos
- Relaciones entre entidades

## Diseño y UX

- **Interfaz moderna** con Tailwind CSS y gradientes
- **Responsive design** para todos los dispositivos
- **Navegación intuitiva** con navbar sticky y breadcrumbs
- **Feedback visual** para acciones del usuario
- **Estados de carga** mejorados con animaciones
- **Componentes reutilizables** para consistencia
- **Animaciones y transiciones** suaves en toda la aplicación
- **Hover effects** y estados interactivos
- **Empty states** informativos y atractivos
- **Badges y estadísticas** visuales
- **Tema claro profesional** optimizado para productividad

## Calidad del Código

- **TypeScript estricto** para type safety
- **Arquitectura en capas** (Presentación, Lógica, Datos)
- **Componentes modulares** y reutilizables
- **Separación de responsabilidades** clara
- **Validación centralizada** con Zod en `/lib/validations`
- **Hooks personalizados** para lógica reutilizable
- **Helpers del dominio** en `/lib/helpers`
- **Código limpio** siguiendo mejores prácticas
- **Estructura escalable** para futuras funcionalidades
- **Constantes centralizadas** en `/lib/constants` y `/lib/config`
- **Utilidades reutilizables** para formateo y cálculos
- **Documentación inline** en funciones complejas
- **Convenciones de nombres** consistentes
- **Manejo de errores** apropiado
- **Patrones de diseño** (Singleton, Custom Hooks, etc.)

### Documentación Técnica
- **README.md** - Guía general del proyecto
- **CONTRIBUTING.md** - Guía para desarrolladores
- **ARCHITECTURE.md** - Documentación de arquitectura detallada

## Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo (puerto 3975)
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linting del código
```

### Mantenimiento

```powershell
# Limpiar archivos basura (macOS metadata, carpetas vacías)
powershell -ExecutionPolicy Bypass -File clean.ps1
```

## Contribución

Este proyecto sigue estándares elevados de programación:
- Código limpio y bien documentado
- Componentes reutilizables
- Tipado estricto con TypeScript
- Estructura modular y escalable

## Licencia

Proyecto privado para gestión inmobiliaria personal.
