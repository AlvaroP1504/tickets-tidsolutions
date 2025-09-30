import { Ticket } from '@/domain/entities/Ticket'

export class FilterTicketsByTitle {
  execute(tickets: Ticket[], query: string): Ticket[] {
    if (!query.trim()) {
      return tickets
    }

    const normalizedQuery = query.trim().toLowerCase()

    return tickets.filter(ticket =>
      ticket.title.toLowerCase().includes(normalizedQuery)
    )
  }
}
