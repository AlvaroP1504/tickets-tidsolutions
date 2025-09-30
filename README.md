# Sistema de Tickets - Vue 3 + TypeScript

SPA moderna para gestión de tickets construida con **Vue 3**, **TypeScript**, **Vuetify** y **Pinia**, siguiendo los principios de **Clean Architecture** y **Arquitectura Hexagonal**.

## ✨ Características

- 🎯 **Acordeones inteligentes**: Un solo acordeón abierto a la vez, con gestión automática de visibilidad
- 🔍 **Búsqueda en tiempo real**: Filtrado por título (case-insensitive)
- 🎨 **Sistema de prioridades visual**: Badges semáforo (Alta=rojo, Media=amarillo, Baja=verde)
- 📊 **Ordenamiento automático**: Por prioridad y fecha de actualización
- ♿ **Accesible**: Navegación por teclado, ARIA labels
- 📱 **Responsive**: Diseño adaptable a todos los dispositivos

## 🏗️ Arquitectura

El proyecto sigue **Clean/Hexagonal Architecture** con separación clara de responsabilidades:

```
src/
├── domain/              # Lógica de negocio pura
│   ├── entities/        # Entidades (Ticket)
│   ├── value-objects/   # Objetos de valor (Priority)
│   └── services/        # Servicios de dominio (ticketSorter)
├── application/         # Casos de uso y puertos
│   ├── ports/           # Interfaces (TicketRepository)
│   ├── use-cases/       # Casos de uso (LoadTickets, FilterTickets, SortTickets)
│   └── mappers/         # Transformadores de datos
├── infrastructure/      # Implementaciones concretas
│   └── repositories/    # Repositorio in-memory con dataset semilla
├── ui/                  # Capa de presentación
│   ├── components/      # Componentes Vue reutilizables
│   ├── pages/           # Páginas de la aplicación
│   ├── stores/          # Estado global con Pinia
│   └── styles/          # Estilos globales
└── plugins/             # Configuración de Pinia y Vuetify
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- pnpm, npm o yarn

### Instalación

```bash
# Con pnpm (recomendado)
pnpm install

# Con npm
npm install

# Con yarn
yarn install
```

### Desarrollo

```bash
# Con pnpm
pnpm dev

# Con npm
npm run dev

# Con yarn
yarn dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build de producción

```bash
# Con pnpm
pnpm build

# Con npm
npm run build
```

### Previsualizar build

```bash
# Con pnpm
pnpm preview

# Con npm
npm run preview
```

### Linting

```bash
# Con pnpm
pnpm lint

# Con npm
npm run lint
```

### Testing (opcional)

```bash
# Con pnpm
pnpm test

# Con npm
npm run test
```

## 📋 Reglas de Negocio

### Acordeones

- **Solo uno abierto a la vez**: Al hacer clic en un ticket, se cierra el anterior
- **Siempre uno abierto**: Si hay tickets visibles, siempre debe haber uno expandido
- **Header cerrado**: Muestra solo título y badge de prioridad
- **Header abierto**: Muestra además fecha de actualización y descripción
- **Gestión automática**: Si el filtro oculta el ticket abierto, se abre automáticamente el primero visible

### Ordenamiento

1. **Por prioridad**: Alta > Media > Baja
2. **Por fecha**: En caso de empate, se ordena por fecha de actualización descendente (más reciente primero)

### Búsqueda

- Filtrado en tiempo real por título
- Case-insensitive
- Mantiene el acordeón abierto si sigue visible tras filtrar
- Si no hay resultados, muestra mensaje informativo

## 🎨 Stack Tecnológico

- **Vue 3** - Framework progresivo
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultra-rápido
- **Vuetify 3** - Framework UI Material Design
- **Pinia** - Estado global
- **ESLint + Prettier** - Calidad de código
- **Vitest** - Testing (opcional)

## 📦 Dataset Inicial

La aplicación incluye 6 tickets de ejemplo con diferentes prioridades y fechas:

- Tickets de **Alta prioridad**: Problemas críticos de navegación y pago
- Tickets de **Media prioridad**: Mejoras de UX
- Tickets de **Baja prioridad**: Optimizaciones menores

## 🧪 Casos de Prueba Implementados

- ✅ Render inicial con primer acordeón abierto
- ✅ Filtro elimina ticket abierto → se abre el primero visible
- ✅ Limpiar filtro mantiene acordeón si existe
- ✅ Orden correcto por prioridad y fecha
- ✅ Header muestra/oculta información según estado

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

**Desarrollado con ❤️ siguiendo Clean Architecture**
