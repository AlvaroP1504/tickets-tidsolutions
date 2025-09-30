import { Priority } from '../value-objects/Priority'

export interface Ticket {
  id: string
  title: string
  priority: Priority
  updatedAt: Date
  description: string
}
