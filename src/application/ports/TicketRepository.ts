import { Ticket } from '@/domain/entities/Ticket'

export interface TicketRepository {
  findAll(): Promise<Ticket[]>
}
