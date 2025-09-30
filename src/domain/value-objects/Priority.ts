export type Priority = 'high' | 'medium' | 'low'

export const PriorityWeight: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1
}

export const PriorityLabel: Record<Priority, string> = {
  high: 'Alta',
  medium: 'Media',
  low: 'Baja'
}

export const PriorityColor: Record<Priority, string> = {
  high: 'error',
  medium: 'warning',
  low: 'success'
}
