import { Ticket } from '../entities/Ticket'
import { PriorityWeight } from '../value-objects/Priority'

/**
 * Compara dos tickets según reglas de negocio:
 * 1. Por prioridad (Alta > Media > Baja)
 * 2. En caso de empate, por fecha de actualización descendente (más reciente primero)
 */
export function compareTickets(a: Ticket, b: Ticket): number {
  const priorityDiff = PriorityWeight[b.priority] - PriorityWeight[a.priority]
  
  if (priorityDiff !== 0) {
    return priorityDiff
  }
  
  // Desempate por fecha descendente (más reciente primero)
  return b.updatedAt.getTime() - a.updatedAt.getTime()
}

export function sortTickets(tickets: Ticket[]): Ticket[] {
  return [...tickets].sort(compareTickets)
}
