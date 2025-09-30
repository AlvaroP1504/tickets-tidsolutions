# 🚀 Inicio Rápido

## En 3 pasos

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Ejecutar en desarrollo

```bash
pnpm dev
```

### 3. Abrir en el navegador

Navega a `http://localhost:5173`

---

## ✨ ¿Qué verás?

- 📋 **6 tickets** ordenados por prioridad (Alta → Media → Baja)
- 🔍 **Barra de búsqueda** funcional en tiempo real
- 🎨 **Badges de colores** según prioridad (🔴 Alta, 🟡 Media, 🟢 Baja)
- 📂 **Acordeones** que se expanden/colapsan automáticamente
- 📱 **Diseño responsive** que se adapta a tu pantalla

---

## 🧪 Probar funcionalidades

### 1. Búsqueda
- Escribe **"Safari"** en la barra de búsqueda
- Verás solo el ticket relacionado con Safari
- Limpia la búsqueda y volverán todos los tickets

### 2. Acordeones inteligentes
- Haz clic en diferentes tickets
- Observa cómo solo uno permanece abierto a la vez
- El abierto muestra: fecha de actualización + descripción

### 3. Filtrado dinámico
- Busca **"modo oscuro"**
- El acordeón se ajusta automáticamente al primer resultado
- Busca algo que no existe: **"xyz123"**
- Verás el mensaje "No hay coincidencias"

### 4. Prioridades visuales
- **Rojo** (Alta): Problemas críticos que bloquean usuarios
- **Amarillo** (Media): Mejoras importantes de UX
- **Verde** (Baja): Optimizaciones menores

---

## 📂 Estructura del Proyecto

```
src/
├── domain/          → Lógica de negocio pura
├── application/     → Casos de uso y puertos
├── infrastructure/  → Repositorios y datos
└── ui/              → Componentes Vue + Pinia
```

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
pnpm dev

# Build de producción
pnpm build

# Previsualizar build
pnpm preview

# Linting
pnpm lint

# Tests (opcional)
pnpm test
```

---

## 📖 Más Información

- **README.md**: Documentación completa
- **ARCHITECTURE.md**: Detalles de la arquitectura

---

**¡Listo para desarrollar! 🎉**
