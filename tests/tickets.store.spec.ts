import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTicketsStore } from '@/ui/stores/useTicketsStore'

describe('useTicketsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

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

  it('abre el primer ticket al cargar', async () => {
    const store = useTicketsStore()
    
    await store.load()
    
    expect(store.openId).not.toBeNull()
    expect(store.openId).toBe(store.sorted[0]?.id)
  })

  it('mantiene un acordeón abierto cuando hay tickets visibles', async () => {
    const store = useTicketsStore()
    
    await store.load()
    store.setQuery('Safari')
    
    expect(store.visibleOpenId).not.toBeNull()
    expect(store.filtered.some(t => t.id === store.visibleOpenId)).toBe(true)
  })

  it('no abre ningún acordeón cuando no hay resultados', async () => {
    const store = useTicketsStore()
    
    await store.load()
    store.setQuery('xyz123noexiste')
    
    expect(store.filtered.length).toBe(0)
    expect(store.visibleOpenId).toBeNull()
  })

  it('abre el primer visible cuando el filtro oculta el abierto', async () => {
    const store = useTicketsStore()
    
    await store.load()
    
    // Abrir un ticket específico
    const firstTicket = store.sorted[0]
    store.toggleOpen(firstTicket.id)
    
    // Filtrar por algo que no incluya ese ticket
    store.setQuery('modo oscuro')
    
    // Debe abrir el primero de los filtrados
    if (store.filtered.length > 0) {
      expect(store.visibleOpenId).toBe(store.filtered[0].id)
    } else {
      expect(store.visibleOpenId).toBeNull()
    }
  })

  it('mantiene el acordeón abierto al limpiar filtro si existe', async () => {
    const store = useTicketsStore()
    
    await store.load()
    
    const firstTicket = store.sorted[0]
    store.toggleOpen(firstTicket.id)
    
    // Aplicar filtro
    store.setQuery('Safari')
    
    // Limpiar filtro
    store.setQuery('')
    
    // Si el ticket original sigue en la lista, debe mantenerse abierto
    if (store.sorted.some(t => t.id === firstTicket.id)) {
      expect(store.openId).toBe(firstTicket.id)
    }
  })
})
