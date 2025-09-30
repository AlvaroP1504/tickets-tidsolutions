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

export type AccordionMode = 'single' | 'multiple'

interface TicketsState {
  all: Ticket[]
  query: string
  openIds: Set<string>
  mode: AccordionMode
  loading: boolean
}

export const useTicketsStore = defineStore('tickets', {
  state: (): TicketsState => ({
    all: [],
    query: '',
    openIds: new Set<string>(),
    mode: 'single',
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
     * IDs de los tickets que deben estar abiertos, ajustados según visibilidad y modo
     */
    visibleOpenIds(): string[] {
      const filtered = this.filtered

      if (this.mode === 'multiple') {
        // En modo multiple, solo devolver los abiertos que están visibles
        return filtered.filter(t => this.openIds.has(t.id)).map(t => t.id)
      }

      // Modo single
      if (filtered.length === 0) {
        return []
      }

      // Buscar el primero de openIds que esté visible
      for (const id of this.openIds) {
        if (filtered.some(t => t.id === id)) {
          return [id]
        }
      }

      // Si ninguno abierto está visible, abrir el primero
      return filtered[0] ? [filtered[0].id] : []
    },

    /**
     * Índices de los paneles abiertos para Vuetify
     */
    openPanelIndices(): number[] {
      const visibleIds = this.visibleOpenIds
      return visibleIds
        .map(id => this.filtered.findIndex(t => t.id === id))
        .filter(index => index >= 0)
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
     * Actualiza la query de búsqueda y gestiona acordeones abiertos
     */
    setQuery(query: string) {
      this.query = query
      this.ensureOpenWhenListChanges()
    },

    /**
     * Cambia el modo de acordeones (single/multiple)
     */
    setMode(mode: AccordionMode) {
      this.mode = mode
      this.ensureOpenWhenListChanges()
    },

    /**
     * Toggle de un ticket específico
     */
    toggleOpen(id: string) {
      const exists = this.filtered.some(t => t.id === id)
      if (!exists) return

      if (this.mode === 'single') {
        // En modo single, reemplazar el abierto
        this.openIds.clear()
        this.openIds.add(id)
      } else {
        // En modo multiple, toggle on/off
        if (this.openIds.has(id)) {
          this.openIds.delete(id)
        } else {
          this.openIds.add(id)
        }
      }
    },

    /**
     * Actualiza los acordeones abiertos desde un array de índices (para v-model)
     */
    setOpenIndices(indices: number | number[] | undefined) {
      if (indices === undefined) {
        // No hay ninguno abierto
        if (this.mode === 'single') {
          // En modo single, mantener al menos uno abierto
          this.ensureOpenWhenListChanges()
        } else {
          // En modo multiple, permitir cerrar todos
          this.openIds.clear()
        }
        return
      }

      const indexArray = Array.isArray(indices) ? indices : [indices]
      const newOpenIds = new Set<string>()

      indexArray.forEach(index => {
        const ticket = this.filtered[index]
        if (ticket) {
          newOpenIds.add(ticket.id)
        }
      })

      this.openIds = newOpenIds

      if (this.mode === 'single' && this.openIds.size === 0) {
        this.ensureOpenWhenListChanges()
      }
    },

    /**
     * Cierra todos los acordeones visibles (solo modo multiple)
     */
    closeAllVisible() {
      if (this.mode !== 'multiple') return

      const visibleIds = new Set(this.filtered.map(t => t.id))
      
      // Remover solo los IDs que están visibles
      for (const id of this.openIds) {
        if (visibleIds.has(id)) {
          this.openIds.delete(id)
        }
      }
    },

    /**
     * Asegura que haya acordeones abiertos según el modo.
     * - Single: siempre uno abierto si hay tickets visibles
     * - Multiple: mantiene los abiertos que siguen visibles
     */
    ensureOpenWhenListChanges() {
      const filtered = this.filtered

      if (this.mode === 'multiple') {
        // En modo multiple, no forzar apertura
        // Solo mantener los que están visibles
        return
      }

      // Modo single
      if (filtered.length === 0) {
        this.openIds.clear()
        return
      }

      // Verificar si alguno de los abiertos está visible
      const hasVisibleOpen = Array.from(this.openIds).some(id =>
        filtered.some(t => t.id === id)
      )

      if (hasVisibleOpen) {
        // Ya hay uno visible abierto, mantenerlo
        return
      }

      // No hay ninguno visible abierto, abrir el primero
      this.openIds.clear()
      if (filtered[0]) {
        this.openIds.add(filtered[0].id)
      }
    }
  }
})
