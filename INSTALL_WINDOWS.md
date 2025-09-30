# 🪟 Instalación en Windows

## Prerequisitos

1. **Node.js 18+**
   - Descarga desde: https://nodejs.org/
   - Verifica la instalación:
     ```powershell
     node --version
     npm --version
     ```

2. **pnpm (Recomendado)** o npm
   - Para instalar pnpm:
     ```powershell
     npm install -g pnpm
     ```
   - Verifica:
     ```powershell
     pnpm --version
     ```

## Instalación

### Opción 1: Con pnpm (Recomendado - Más rápido)

```powershell
# 1. Instalar dependencias
pnpm install

# 2. Ejecutar en desarrollo
pnpm dev

# 3. Abrir navegador en http://localhost:5173
```

### Opción 2: Con npm

```powershell
# 1. Instalar dependencias
npm install

# 2. Ejecutar en desarrollo
npm run dev

# 3. Abrir navegador en http://localhost:5173
```

## Solución de Problemas

### Error: "pnpm no se reconoce como comando"

**Solución**:
```powershell
npm install -g pnpm
```

Luego cierra y vuelve a abrir PowerShell.

### Error: "Execution Policy"

Si obtienes un error sobre políticas de ejecución:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Puerto 5173 en uso

Si el puerto está ocupado, Vite automáticamente usará el siguiente disponible (5174, 5175, etc.)

### Errores de instalación de dependencias

1. Limpia caché:
   ```powershell
   # Con pnpm
   pnpm store prune
   
   # Con npm
   npm cache clean --force
   ```

2. Elimina node_modules y reinstala:
   ```powershell
   # Eliminar carpeta
   Remove-Item -Recurse -Force node_modules
   
   # Reinstalar
   pnpm install
   # o
   npm install
   ```

## Scripts Disponibles

```powershell
# Desarrollo (hot reload)
pnpm dev

# Build de producción
pnpm build

# Previsualizar build
pnpm preview

# Ejecutar linter
pnpm lint

# Formatear código
pnpm format

# Ejecutar tests
pnpm test
```

## Editores Recomendados

### Visual Studio Code

Extensiones recomendadas:
- **Volar** (Vue Language Features)
- **TypeScript Vue Plugin (Volar)**
- **ESLint**
- **Prettier**

Instalar:
1. Abre VS Code
2. Ve a Extensiones (Ctrl+Shift+X)
3. Busca e instala cada una

### Configuración de VS Code

Crea `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Verificar Instalación

Después de `pnpm install`, verifica que todo funcione:

```powershell
# Debe mostrar la versión de TypeScript
npx tsc --version

# Debe mostrar la versión de Vite
npx vite --version

# Debe mostrar la versión de Vue
npm list vue
```

## URLs Importantes

- **Desarrollo**: http://localhost:5173
- **Documentación Vue 3**: https://vuejs.org/
- **Documentación Vuetify**: https://vuetifyjs.com/
- **Documentación Pinia**: https://pinia.vuejs.org/

## Siguientes Pasos

1. ✅ Instala las dependencias
2. ✅ Ejecuta `pnpm dev`
3. ✅ Abre http://localhost:5173
4. 🎉 ¡Comienza a desarrollar!

---

**¿Problemas?** Revisa:
- README.md (documentación general)
- QUICKSTART.md (inicio rápido)
- ARCHITECTURE.md (arquitectura del proyecto)
