import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTicketsStore } from '@/ui/stores/useTicketsStore'

describe('useTicketsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Funcionalidad básica', () => {
    it('carga tickets correctamente', async () => {
      const store = useTicketsStore()
      
      await store.load()
      
      expect(store.all.length).toBeGreaterThan(0)
      expect(store.loading).toBe(false)
    })

    it('ordena tickets por prioridad y fecha', async () => {
      const store = useTicketsStore()
      
      await store.load()
      
      const sorted = store.sorted
      
      // El primer ticket debe ser de prioridad high
      expect(['high']).toContain(sorted[0].priority)
      
      // Verificar que están ordenados correctamente
      for (let i = 0; i < sorted.length - 1; i++) {
        const current = sorted[i]
        const next = sorted[i + 1]
        
        const priorityWeights = { high: 3, medium: 2, low: 1 }
        const currentWeight = priorityWeights[current.priority]
        const nextWeight = priorityWeights[next.priority]
        
        expect(currentWeight).toBeGreaterThanOrEqual(nextWeight)
      }
    })

    it('filtra tickets por título', async () => {
      const store = useTicketsStore()
      
      await store.load()
      store.setQuery('Safari')
      
      const filtered = store.filtered
      
      expect(filtered.length).toBeGreaterThan(0)
      expect(filtered.every(t => t.title.toLowerCase().includes('safari'))).toBe(true)
    })
  })

  describe('Modo Single', () => {
    it('inicia en modo single por defecto', () => {
      const store = useTicketsStore()
      expect(store.mode).toBe('single')
    })

    it('abre el primer ticket al cargar', async () => {
      const store = useTicketsStore()
      
      await store.load()
      
      expect(store.openIds.size).toBe(1)
      expect(store.visibleOpenIds.length).toBe(1)
      expect(store.visibleOpenIds[0]).toBe(store.sorted[0]?.id)
    })

    it('mantiene un acordeón abierto cuando hay tickets visibles', async () => {
      const store = useTicketsStore()
      
      await store.load()
      store.setQuery('Safari')
      
      expect(store.visibleOpenIds.length).toBe(1)
      expect(store.filtered.some(t => t.id === store.visibleOpenIds[0])).toBe(true)
    })

    it('no abre ningún acordeón cuando no hay resultados', async () => {
      const store = useTicketsStore()
      
      await store.load()
      store.setQuery('xyz123noexiste')
      
      expect(store.filtered.length).toBe(0)
      expect(store.visibleOpenIds.length).toBe(0)
    })

    it('abre el primer visible cuando el filtro oculta el abierto', async () => {
      const store = useTicketsStore()
      
      await store.load()
      
      // Abrir un ticket específico (el primero)
      const firstTicket = store.sorted[0]
      
      // Filtrar por algo que NO incluya ese ticket
      store.setQuery('modo oscuro')
      
      // Debe abrir el primero de los filtrados
      if (store.filtered.length > 0) {
        expect(store.visibleOpenIds[0]).toBe(store.filtered[0].id)
        expect(store.visibleOpenIds[0]).not.toBe(firstTicket.id)
      } else {
        expect(store.visibleOpenIds.length).toBe(0)
      }
    })

    it('mantiene el acordeón abierto al limpiar filtro si existe', async () => {
      const store = useTicketsStore()
      
      await store.load()
      
      const firstTicket = store.sorted[0]
      store.toggleOpen(firstTicket.id)
      
      // Aplicar filtro que incluya ese ticket
      store.setQuery('Safari')
      
      const openBeforeClear = store.visibleOpenIds[0]
      
      // Limpiar filtro
      store.setQuery('')
      
      // Debe mantener el mismo ticket abierto
      expect(store.openIds.has(openBeforeClear)).toBe(true)
    })

    it('solo permite un acordeón abierto a la vez', async () => {
      const store = useTicketsStore()
      
      await store.load()
      
      const ticket1 = store.sorted[0]
      const ticket2 = store.sorted[1]
      
      store.toggleOpen(ticket1.id)
      expect(store.openIds.size).toBe(1)
      expect(store.openIds.has(ticket1.id)).toBe(true)
      
      store.toggleOpen(ticket2.id)
      expect(store.openIds.size).toBe(1)
      expect(store.openIds.has(ticket2.id)).toBe(true)
      expect(store.openIds.has(ticket1.id)).toBe(false)
    })
  })

  describe('Modo Multiple', () => {
    it('permite cambiar a modo multiple', async () => {
      const store = useTicketsStore()
      
      await store.load()
      store.setMode('multiple')
      
      expect(store.mode).toBe('multiple')
    })

    it('permite abrir múltiples acordeones', async () => {
      const store = useTicketsStore()
      
      await store.load()
      store.setMode('multiple')
      
      const ticket1 = store.sorted[0]
      const ticket2 = store.sorted[1]
      const ticket3 = store.sorted[2]
      
      store.toggleOpen(ticket1.id)
      store.toggleOpen(ticket2.id)
      store.toggleOpen(ticket3.id)
      console.log('store.sorted')
      console.log(store.sorted)
      console.log('store.openIds')
      console.log(store.openIds)
      console.log(store.openIds.size)
      console.log(store.visibleOpenIds)
      
      expect(store.openIds.size).toBe(3)
      expect(store.openIds.has(ticket1.id)).toBe(true)
      expect(store.openIds.has(ticket2.id)).toBe(true)
      expect(store.openIds.has(ticket3.id)).toBe(true)
    })

    it('permite cerrar todos los acordeones', async () => {
      const store = useTicketsStore()
      
      await store.load()
      store.setMode('multiple')
      
      // Abrir varios
      const ticket1 = store.sorted[0]
      const ticket2 = store.sorted[1]
      
      store.toggleOpen(ticket1.id)
      store.toggleOpen(ticket2.id)
      
      expect(store.openIds.size).toBe(2)
      
      // Cerrar uno
      store.toggleOpen(ticket1.id)
      expect(store.openIds.size).toBe(1)
      expect(store.openIds.has(ticket2.id)).toBe(true)
      
      // Cerrar el otro
      store.toggleOpen(ticket2.id)
      expect(store.openIds.size).toBe(0)
    })

    it('cierra todos los acordeones con closeAllVisible', async () => {
      const store = useTicketsStore()
      
      await store.load()
      store.setMode('multiple')
      
      // Abrir varios tickets
      const ticket1 = store.sorted[0]
      const ticket2 = store.sorted[1]
      
      store.toggleOpen(ticket1.id)
      store.toggleOpen(ticket2.id)
      
      expect(store.openIds.size).toBe(2)
      
      // Cerrar todos
      store.closeAllVisible()
      
      // Todos deben estar cerrados
      expect(store.openIds.size).toBe(0)
      expect(store.visibleOpenIds.length).toBe(0)
    })

    it('mantiene acordeones abiertos al filtrar si siguen visibles', async () => {
      const store = useTicketsStore()
      
      await store.load()
      store.setMode('multiple')
      
      // Abrir varios
      const ticket1 = store.sorted[0]
      const ticket2 = store.sorted[1]
      
      store.toggleOpen(ticket1.id)
      store.toggleOpen(ticket2.id)
      
      // Filtrar de forma que ambos sigan visibles
      // (buscar por algo común, o vacío)
      store.setQuery('')
      
      expect(store.openIds.size).toBe(2)
      expect(store.visibleOpenIds.length).toBe(2)
    })

    it('NO preserva acordeones ocultos al filtrar (solo mantiene visibles)', async () => {
      const store = useTicketsStore()
      
      await store.load()
      store.setMode('multiple')
      
      // Abrir dos tickets diferentes
      const safariTicket = store.sorted.find(t => t.title.toLowerCase().includes('safari'))
      const otherTicket = store.sorted.find(t => !t.title.toLowerCase().includes('safari'))
      
      if (safariTicket && otherTicket) {
        store.toggleOpen(safariTicket.id)
        store.toggleOpen(otherTicket.id)
        
        expect(store.openIds.size).toBe(2)
        
        // Filtrar solo por Safari
        store.setQuery('Safari')
        
        // Solo Safari debe estar visible y abierto
        expect(store.visibleOpenIds).toContain(safariTicket.id)
        expect(store.visibleOpenIds).not.toContain(otherTicket.id)
        
        // El ticket no visible debe haberse eliminado de openIds
        expect(store.openIds.has(safariTicket.id)).toBe(true)
        expect(store.openIds.has(otherTicket.id)).toBe(false)
        expect(store.openIds.size).toBe(1)
        
        // Al limpiar filtro, solo Safari sigue abierto (el que estaba visible en el filtro)
        store.setQuery('')
        expect(store.visibleOpenIds.length).toBe(1)
        expect(store.visibleOpenIds).toContain(safariTicket.id)
        expect(store.visibleOpenIds).not.toContain(otherTicket.id)
      }
    })

    it('escenario: A y B abiertos, filtro A, limpio filtro, solo A queda abierto', async () => {
      const store = useTicketsStore()
      
      await store.load()
      store.setMode('multiple')
      
      // Nombrar como A y B para claridad
      const ticketA = store.sorted[0]
      const ticketB = store.sorted[1]
      
      // Paso 1: Abrir A y B
      store.toggleOpen(ticketA.id)
      store.toggleOpen(ticketB.id)
      expect(store.openIds.size).toBe(2)
      expect(store.openIds.has(ticketA.id)).toBe(true)
      expect(store.openIds.has(ticketB.id)).toBe(true)
      
      // Paso 2: Filtrar para que solo aparezca A
      const ticketATitleWord = ticketA.title.split(' ')[0]
      store.setQuery(ticketATitleWord)
      
      // Verificar que solo A es visible
      const isAVisible = store.filtered.some(t => t.id === ticketA.id)
      const isBVisible = store.filtered.some(t => t.id === ticketB.id)
      
      if (isAVisible && !isBVisible) {
        // A está visible, B no
        expect(store.visibleOpenIds).toContain(ticketA.id)
        expect(store.visibleOpenIds).not.toContain(ticketB.id)
        
        // B debe haberse eliminado de openIds
        expect(store.openIds.has(ticketA.id)).toBe(true)
        expect(store.openIds.has(ticketB.id)).toBe(false)
        
        // Paso 3: Limpiar filtro
        store.setQuery('')
        
        // Solo A debe seguir abierto
        expect(store.visibleOpenIds.length).toBe(1)
        expect(store.visibleOpenIds).toContain(ticketA.id)
        expect(store.visibleOpenIds).not.toContain(ticketB.id)
        expect(store.openIds.size).toBe(1)
      }
    })

    it('abre automáticamente el primero si no hay ninguno abierto después de filtrar', async () => {
      const store = useTicketsStore()
      
      await store.load()
      store.setMode('multiple')
      
      // Cerrar todos los acordeones
      store.closeAllVisible()
      expect(store.openIds.size).toBe(0)
      
      // Filtrar
      store.setQuery('Safari')
      
      // Debe abrir automáticamente el primero visible
      if (store.filtered.length > 0) {
        expect(store.visibleOpenIds.length).toBe(1)
        expect(store.visibleOpenIds[0]).toBe(store.filtered[0].id)
      }
    })

    it('abre el primero al cargar en modo multiple sin abiertos', async () => {
      const store = useTicketsStore()
      store.setMode('multiple')
      
      await store.load()
      
      // Debe abrir el primero automáticamente
      expect(store.openIds.size).toBeGreaterThan(0)
      expect(store.visibleOpenIds.length).toBe(1)
      expect(store.visibleOpenIds[0]).toBe(store.sorted[0].id)
    })
  })

  describe('Cambio entre modos', () => {
    it('al cambiar de multiple a single sin abiertos, abre el primero', async () => {
      const store = useTicketsStore()
      
      await store.load()
      store.setMode('multiple')
      
      // Cerrar todos
      store.openIds.clear()
      
      // Cambiar a single
      store.setMode('single')
      
      // Debe abrir el primero
      expect(store.visibleOpenIds.length).toBe(1)
      expect(store.visibleOpenIds[0]).toBe(store.sorted[0].id)
    })

    it('al cambiar de multiple a single con varios abiertos, mantiene solo el primero visible', async () => {
      const store = useTicketsStore()
      
      await store.load()
      store.setMode('multiple')
      
      // Abrir varios
      const ticket1 = store.sorted[0]
      const ticket2 = store.sorted[1]
      
      store.toggleOpen(ticket1.id)
      store.toggleOpen(ticket2.id)
      
      // Cambiar a single
      store.setMode('single')
      
      // Solo debe haber uno visible
      expect(store.visibleOpenIds.length).toBe(1)
    })

    it('al cambiar de single a multiple, mantiene el abierto', async () => {
      const store = useTicketsStore()
      
      await store.load()
      // Ya está en single
      
      const openBefore = store.visibleOpenIds[0]
      
      // Cambiar a multiple
      store.setMode('multiple')
      
      // Debe mantener el mismo abierto
      expect(store.visibleOpenIds).toContain(openBefore)
    })
  })
})