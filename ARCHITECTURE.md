# Documentación de Arquitectura

## 🏛️ Clean/Hexagonal Architecture

Este proyecto implementa los principios de **Clean Architecture** y **Arquitectura Hexagonal** para lograr:

- ✅ **Separación de responsabilidades**
- ✅ **Independencia de frameworks**
- ✅ **Testabilidad**
- ✅ **Mantenibilidad**

## 📊 Capas de la Aplicación

### 1️⃣ Domain (Dominio)

**Ubicación**: `src/domain/`

**Responsabilidad**: Contiene la lógica de negocio pura, independiente de frameworks.

**Componentes**:
- **Entities** (`Ticket`): Entidades del dominio con sus propiedades
- **Value Objects** (`Priority`): Objetos inmutables que representan conceptos del dominio
- **Domain Services** (`ticketSorter`): Lógica de negocio que no pertenece a una entidad específica

**Reglas**:
- ❌ NO depende de ninguna otra capa
- ❌ NO conoce Vue, Pinia, Vuetify, etc.
- ✅ Solo TypeScript puro
- ✅ Contiene reglas de negocio (prioridades, ordenamiento)

### 2️⃣ Application (Aplicación)

**Ubicación**: `src/application/`

**Responsabilidad**: Orquesta el flujo de datos entre el dominio y la infraestructura.

**Componentes**:
- **Ports** (Interfaces): Contratos que debe cumplir la infraestructura
  - `TicketRepository`: Define cómo obtener tickets
- **Use Cases**: Casos de uso específicos
  - `LoadTickets`: Cargar todos los tickets
  - `FilterTicketsByTitle`: Filtrar tickets por título
  - `SortTickets`: Ordenar tickets
- **Mappers**: Transforman DTOs a entidades de dominio
  - `ticketMapper`: Convierte fechas string a Date, formatea para UI

**Reglas**:
- ✅ Depende del **Domain**
- ❌ NO depende de Infrastructure ni UI
- ✅ Define interfaces (ports) que Infrastructure implementa
- ✅ Independiente de frameworks

### 3️⃣ Infrastructure (Infraestructura)

**Ubicación**: `src/infrastructure/`

**Responsabilidad**: Implementa los detalles técnicos (bases de datos, APIs, etc.)

**Componentes**:
- **Repositories**: Implementaciones concretas de los ports
  - `InMemoryTicketRepository`: Implementa `TicketRepository` con datos en memoria

**Reglas**:
- ✅ Depende de **Application** (implementa ports)
- ✅ Depende de **Domain** (retorna entidades)
- ✅ Puede usar librerías externas (Axios, etc.)
- 🔄 Fácilmente reemplazable (hoy in-memory, mañana API REST)

### 4️⃣ UI (Interfaz de Usuario)

**Ubicación**: `src/ui/`

**Responsabilidad**: Presentación y gestión del estado de la UI.

**Componentes**:
- **Components**: Componentes Vue reutilizables
  - `SearchBar`: Barra de búsqueda
  - `PriorityBadge`: Badge de prioridad
  - `TicketItem`: Acordeón de ticket individual
- **Pages**: Páginas de la aplicación
  - `TicketsPage`: Página principal con lista de tickets
- **Stores**: Estado global con Pinia (actúa como **adapter**)
  - `useTicketsStore`: Gestiona el estado y llama a use cases
- **Styles**: Estilos globales CSS

**Reglas**:
- ✅ Depende de **Application** (usa casos de uso)
- ✅ Puede depender de **Infrastructure** (instancia repositorios)
- ✅ Usa frameworks (Vue, Vuetify, Pinia)
- ✅ El store actúa como **Adapter** entre Vue y Application

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────────────┐
│                     USER INTERACTION                     │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│  UI LAYER (Vue Components + Pinia Store)                │
│  - TicketsPage.vue                                       │
│  - useTicketsStore (Adapter)                            │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│  APPLICATION LAYER (Use Cases)                          │
│  - LoadTickets                                           │
│  - FilterTicketsByTitle                                  │
│  - SortTickets                                           │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│  DOMAIN LAYER (Business Logic)                          │
│  - Ticket entity                                         │
│  - Priority value object                                 │
│  - ticketSorter service                                  │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│  INFRASTRUCTURE LAYER (Data Access)                     │
│  - InMemoryTicketRepository                             │
│  - (Future: APITicketRepository, DBTicketRepository)    │
└─────────────────────────────────────────────────────────┘
```

## 🎯 Ejemplo de Flujo: Cargar Tickets

1. **Usuario** abre la aplicación
2. **TicketsPage.vue** (UI) llama a `store.load()`
3. **useTicketsStore** (Store/Adapter) ejecuta `loadTicketsUseCase.execute()`
4. **LoadTickets** (Use Case) llama a `repository.findAll()`
5. **InMemoryTicketRepository** (Infrastructure) devuelve tickets
6. **ticketMapper** (Application) convierte DTOs a entidades Domain
7. **useTicketsStore** guarda en estado y aplica `SortTickets`
8. **ticketSorter** (Domain Service) ordena según reglas de negocio
9. **TicketsPage.vue** renderiza los tickets ordenados

## 📐 Principios Aplicados

### Dependency Inversion Principle (DIP)

Las capas superiores no dependen de las inferiores directamente, sino de abstracciones (ports):

```typescript
// ❌ INCORRECTO: UI depende directamente de Infrastructure
import { InMemoryTicketRepository } from '@/infrastructure/...'

// ✅ CORRECTO: Application define un port (interface)
export interface TicketRepository {
  findAll(): Promise<Ticket[]>
}

// Infrastructure implementa el port
export class InMemoryTicketRepository implements TicketRepository {
  async findAll(): Promise<Ticket[]> { ... }
}
```

### Single Responsibility Principle (SRP)

Cada clase/módulo tiene una única razón para cambiar:

- `Ticket`: Representa un ticket
- `LoadTickets`: Carga tickets
- `FilterTicketsByTitle`: Filtra tickets
- `InMemoryTicketRepository`: Provee datos desde memoria

### Open/Closed Principle (OCP)

Abierto a extensión, cerrado a modificación:

```typescript
// Fácil agregar nuevas implementaciones sin modificar código existente
class APITicketRepository implements TicketRepository {
  async findAll(): Promise<Ticket[]> {
    return fetch('/api/tickets').then(...)
  }
}
```

## 🧪 Ventajas de esta Arquitectura

### ✅ Testabilidad

```typescript
// Fácil testear use cases con mocks
const mockRepository = {
  findAll: vi.fn().mockResolvedValue([...mockTickets])
}
const useCase = new LoadTickets(mockRepository)
```

### ✅ Mantenibilidad

Cambios aislados:
- Cambiar UI (Vue → React): Solo reescribir UI layer
- Cambiar estado (Pinia → Vuex): Solo modificar stores
- Cambiar fuente de datos (Memory → API): Solo crear nuevo Repository

### ✅ Escalabilidad

Fácil agregar nuevas funcionalidades:
- Nuevo use case: `DeleteTicket`
- Nueva entidad: `Comment`
- Nuevo repository: `LocalStorageTicketRepository`

## 🔍 Detalles de Implementación

### Store como Adapter

El store de Pinia actúa como **Adapter Pattern**, conectando Vue con Application:

```typescript
export const useTicketsStore = defineStore('tickets', {
  actions: {
    async load() {
      // Llama a Use Case
      this.all = await loadTicketsUseCase.execute()
      
      // Aplica reglas de dominio
      this.ensureOpenWhenListChanges()
    }
  }
})
```

### Value Objects para Conceptos del Dominio

```typescript
export type Priority = 'high' | 'medium' | 'low'

export const PriorityWeight: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1
}
```

Esto encapsula el conocimiento de negocio sobre prioridades.

### Mappers para Transformación

```typescript
// DTO (de API/storage)
interface TicketDTO {
  updatedAt: string // "2025-01-19"
}

// Domain Entity
interface Ticket {
  updatedAt: Date // objeto Date
}

// Mapper transforma
function toDomain(dto: TicketDTO): Ticket {
  return {
    ...dto,
    updatedAt: new Date(dto.updatedAt)
  }
}
```

## 📚 Referencias

- [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture (Alistair Cockburn)](https://alistair.cockburn.us/hexagonal-architecture/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
