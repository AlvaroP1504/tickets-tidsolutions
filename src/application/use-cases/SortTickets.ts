import { Ticket } from '@/domain/entities/Ticket'
import { sortTickets } from '@/domain/services/ticketSorter'

export class SortTickets {
  execute(tickets: Ticket[]): Ticket[] {
    return sortTickets(tickets)
  }
}
