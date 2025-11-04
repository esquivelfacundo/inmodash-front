# 🔧 Build Workaround para Windows

## Problema
Error `EISDIR: illegal operation on a directory` en Windows con Next.js 15.5.4

## Solución Temporal

### Opción 1: Usar WSL (Recomendado)
```bash
# Instalar WSL si no lo tienes
wsl --install

# Navegar al proyecto en WSL
cd /mnt/e/business/dev/inmobiliaria/proyecto-inmobiliaria

# Ejecutar build en WSL
npm run build
```

### Opción 2: Desactivar Turbopack
```bash
# En package.json, cambiar el script de build:
"build": "next build --no-turbo"
```

### Opción 3: Variables de Entorno
```powershell
# Ejecutar con estas variables
$env:NEXT_TELEMETRY_DISABLED=1
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Opción 4: Limpiar completamente
```powershell
# Eliminar todo y reinstalar
Remove-Item -Recurse -Force node_modules, .next, package-lock.json
npm install
npm run build
```

## Causa
Este es un bug conocido de Next.js 15 en Windows relacionado con:
- Sistema de archivos de Windows
- Webpack file watching
- Symlinks y junction points

## Solución Permanente
Esperar actualización de Next.js o migrar desarrollo a WSL/Linux.

## Estado Actual
- ✅ TypeScript: Sin errores
- ✅ ESLint: Sin errores críticos  
- ❌ Build: Error EISDIR en Windows
- ✅ Build en WSL/Linux: Debería funcionar

## Alternativa para Desarrollo
```bash
# Usar modo desarrollo (funciona correctamente)
npm run dev
```

El modo desarrollo funciona perfectamente, solo el build de producción tiene este problema en Windows.
