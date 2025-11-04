# Arquitectura del Sistema

## Visión General

Este proyecto sigue una arquitectura modular basada en Next.js 15 con App Router, TypeScript y un store centralizado en memoria.

## Estructura de Carpetas

```
src/
├── app/                    # Páginas y rutas (Next.js App Router)
├── components/             # Componentes React
│   ├── ui/                # Componentes base reutilizables
│   ├── apartments/        # Componentes específicos de dominio
│   ├── forms/             # Formularios especializados
│   └── layout/            # Componentes de layout
├── data/                  # Capa de datos
│   └── store.ts          # Store centralizado (singleton)
├── hooks/                 # Hooks personalizados
├── lib/                   # Utilidades y configuraciones
│   ├── config/           # Configuraciones (opciones, constantes)
│   ├── helpers/          # Funciones helper específicas del dominio
│   ├── validations/      # Schemas de validación (Zod)
│   ├── constants.ts      # Constantes globales
│   └── utils.ts          # Utilidades generales
└── types/                 # Definiciones de TypeScript
    └── index.ts          # Tipos centralizados
```

## Capas de la Aplicación

### 1. Presentación (Components)
- **UI Components**: Componentes base sin lógica de negocio
- **Domain Components**: Componentes con lógica específica del dominio
- **Forms**: Formularios con validación integrada

### 2. Lógica de Negocio (Hooks & Helpers)
- **Hooks**: Encapsulan lógica reutilizable con estado
- **Helpers**: Funciones puras para transformaciones y cálculos

### 3. Datos (Store)
- **Store Centralizado**: Singleton que maneja todo el estado
- **CRUD Operations**: Métodos para crear, leer, actualizar y eliminar
- **Relaciones**: Manejo automático de relaciones entre entidades

### 4. Validación (Validations)
- **Schemas Zod**: Validaciones tipadas y reutilizables
- **Centralización**: Un schema por entidad del dominio

## Flujo de Datos

```
User Action → Component → Hook (opcional) → Store → Component Update
                ↓
            Validation (Zod)
```

## Principios de Diseño

### 1. Separación de Responsabilidades
- Cada módulo tiene una responsabilidad única
- Los componentes no acceden directamente al store (usan hooks)
- Las validaciones están separadas de los componentes

### 2. Reutilización
- Componentes UI genéricos y configurables
- Hooks para lógica compartida
- Helpers para transformaciones comunes

### 3. Type Safety
- TypeScript estricto en todo el proyecto
- Tipos centralizados en `/types`
- Validación en runtime con Zod

### 4. Escalabilidad
- Estructura modular fácil de extender
- Patrones consistentes en todo el código
- Documentación inline en funciones complejas

## Patrones Utilizados

### Singleton Pattern
```typescript
// store.ts
class PropertyStore { /* ... */ }
export const propertyStore = new PropertyStore()
```

### Custom Hooks Pattern
```typescript
// useStore.ts
export function useStore() {
  const getBuildings = useCallback(() => {
    return propertyStore.getBuildings()
  }, [])
  // ...
}
```

### Validation Schema Pattern
```typescript
// validations/building.ts
export const buildingSchema = z.object({
  name: z.string().min(1, 'Required'),
  // ...
})
```

### Helper Functions Pattern
```typescript
// helpers/contract.ts
export function generateUpdatePeriods(/* ... */) {
  // Pure function logic
}
```

## Convenciones de Código

### Nomenclatura
- **Componentes**: PascalCase (`ApartmentCard`)
- **Hooks**: camelCase con prefijo `use` (`useStore`)
- **Funciones**: camelCase (`formatCurrency`)
- **Constantes**: UPPER_SNAKE_CASE (`APARTMENT_STATUS_CONFIG`)
- **Tipos**: PascalCase (`Building`, `Apartment`)

### Imports
Orden de imports:
1. React y librerías externas
2. Componentes UI
3. Componentes de dominio
4. Hooks
5. Utilidades y helpers
6. Tipos
7. Estilos (si aplica)

### Comentarios
- JSDoc para funciones públicas
- Comentarios inline para lógica compleja
- TODO para mejoras futuras

## Testing (Futuro)

Estructura recomendada:
```
__tests__/
├── components/
├── hooks/
├── helpers/
└── store/
```

## Performance

### Optimizaciones Implementadas
- `useCallback` en hooks para memoización
- `useMemo` para cálculos costosos
- Componentes pequeños y enfocados
- Lazy loading de rutas (Next.js automático)

### Mejoras Futuras
- React Query para cache de datos
- Virtualization para listas largas
- Code splitting manual si es necesario

## Seguridad

### Validación
- Validación en cliente (Zod)
- Validación en servidor (futuro con API)
- Sanitización de inputs

### Datos Sensibles
- No hay API keys hardcodeadas
- Variables de entorno para configuración
- Datos en memoria (no persistidos por ahora)

## Deployment

### Build
```bash
npm run build
```

### Producción
```bash
npm start
```

### Desarrollo
```bash
npm run dev
```

## Mantenimiento

### Agregar Nueva Entidad
1. Definir tipo en `/types/index.ts`
2. Crear schema en `/lib/validations/`
3. Agregar métodos CRUD al store
4. Crear hook en `/hooks/` si es necesario
5. Crear componentes en `/components/`

### Agregar Nueva Funcionalidad
1. Identificar la capa apropiada
2. Seguir patrones existentes
3. Documentar funciones complejas
4. Actualizar CONTRIBUTING.md si es necesario

## Referencias

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Documentation](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)
