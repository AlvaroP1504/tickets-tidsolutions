import { Ticket } from '@/domain/entities/Ticket'
import { Priority } from '@/domain/value-objects/Priority'

export interface TicketDTO {
  id: string
  title: string
  priority: Priority
  updatedAt: string // ISO string o DD/MM/YYYY
  description: string
}

/**
 * Convierte un TicketDTO a una entidad de dominio Ticket.
 * Normaliza la fecha a objeto Date para operaciones de ordenamiento.
 */
export function toDomain(dto: TicketDTO): Ticket {
  return {
    id: dto.id,
    title: dto.title,
    priority: dto.priority,
    description: dto.description,
    updatedAt: parseDate(dto.updatedAt)
  }
}

/**
 * Parsea una fecha en formato ISO o DD/MM/YYYY a Date.
 */
function parseDate(dateString: string): Date {
  // Intentar parsear como ISO primero
  const isoDate = new Date(dateString)
  if (!isNaN(isoDate.getTime())) {
    return isoDate
  }

  // Intentar parsear DD/MM/YYYY
  const parts = dateString.split('/')
  if (parts.length === 3) {
    const [day, month, year] = parts
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  }

  // Fallback: devolver fecha actual
  console.warn(`No se pudo parsear la fecha: ${dateString}`)
  return new Date()
}

/**
 * Formatea una fecha Date a DD/MM/YYYY para mostrar en UI.
 */
export function formatDateForDisplay(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}
