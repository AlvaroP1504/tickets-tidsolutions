import { defineStore } from 'pinia'
import { Ticket } from '@/domain/entities/Ticket'
import { LoadTickets } from '@/application/use-cases/LoadTickets'
import { SortTickets } from '@/application/use-cases/SortTickets'
import { FilterTicketsByTitle } from '@/application/use-cases/FilterTicketsByTitle'
import { InMemoryTicketRepository } from '@/infrastructure/repositories/InMemoryTicketRepository'

// Instancias de casos de uso
const repository = new InMemoryTicketRepository()
const loadTicketsUseCase = new LoadTickets(repository)
const sortTicketsUseCase = new SortTickets()
const filterTicketsUseCase = new FilterTicketsByTitle()

interface TicketsState {
  all: Ticket[]
  query: string
  openId: string | null
  loading: boolean
}

export const useTicketsStore = defineStore('tickets', {
  state: (): TicketsState => ({
    all: [],
    query: '',
    openId: null,
    loading: false
  }),

  getters: {
    /**
     * Tickets ordenados por prioridad y fecha
     */
    sorted(): Ticket[] {
      return sortTicketsUseCase.execute(this.all)
    },

    /**
     * Tickets filtrados por query y ordenados
     */
    filtered(): Ticket[] {
      const sorted = this.sorted
      return filterTicketsUseCase.execute(sorted, this.query)
    },

    /**
     * ID del ticket que debe estar abierto, ajustado según visibilidad
     * - Si openId existe en filtered, devuelve openId
     * - Si no existe o es null, devuelve el primer ticket de filtered
     * - Si no hay tickets, devuelve null
     */
    visibleOpenId(): string | null {
      const filtered = this.filtered

      if (filtered.length === 0) {
        return null
      }

      // Si el ticket abierto actual está en la lista filtrada, mantenerlo
      if (this.openId && filtered.some(t => t.id === this.openId)) {
        return this.openId
      }

      // Si no, abrir el primero de la lista filtrada
      return filtered[0]?.id || null
    }
  },

  actions: {
    /**
     * Carga los tickets desde el repositorio
     */
    async load() {
      this.loading = true
      try {
        this.all = await loadTicketsUseCase.execute()
        this.ensureOpenWhenListChanges()
      } finally {
        this.loading = false
      }
    },

    /**
     * Actualiza la query de búsqueda y gestiona el acordeón abierto
     */
    setQuery(query: string) {
      this.query = query
      this.ensureOpenWhenListChanges()
    },

    /**
     * Cambia el ticket abierto (garantiza solo uno abierto a la vez)
     */
    toggleOpen(id: string) {
      // Verificar que el ticket existe en la lista filtrada
      const exists = this.filtered.some(t => t.id === id)
      
      if (exists) {
        this.openId = id
      }
    },

    /**
     * Asegura que siempre haya un acordeón abierto cuando hay tickets visibles.
     * Llamar después de load() o setQuery().
     */
    ensureOpenWhenListChanges() {
      const filtered = this.filtered

      if (filtered.length === 0) {
        // No hay tickets visibles: ningún acordeón abierto
        this.openId = null
        return
      }

      // Si el ticket abierto actual está en la lista, mantenerlo
      if (this.openId && filtered.some(t => t.id === this.openId)) {
        return
      }

      // Si no hay uno abierto o el abierto ya no es visible, abrir el primero
      this.openId = filtered[0]?.id || null
    }
  }
})
