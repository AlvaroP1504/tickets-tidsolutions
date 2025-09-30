import { Ticket } from '@/domain/entities/Ticket'
import { TicketRepository } from '../ports/TicketRepository'

export class LoadTickets {
  constructor(private repository: TicketRepository) {}

  async execute(): Promise<Ticket[]> {
    return await this.repository.findAll()
  }
}
