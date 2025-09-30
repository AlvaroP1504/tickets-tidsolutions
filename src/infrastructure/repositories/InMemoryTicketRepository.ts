import { Ticket } from '@/domain/entities/Ticket'
import { TicketRepository } from '@/application/ports/TicketRepository'
import { TicketDTO, toDomain } from '@/application/mappers/ticketMapper'

const SEED_DATA: TicketDTO[] = [
  {
    id: '1',
    title: 'Safari: botón de pago no responde',
    priority: 'high',
    updatedAt: '2025-01-19',
    description:
      'El botón de pago en Safari (macOS e iOS) no responde al hacer clic. Los usuarios tienen que refrescar la página múltiples veces para poder completar la compra.'
  },
  {
    id: '2',
    title: 'Agregar modo oscuro',
    priority: 'medium',
    updatedAt: '2025-02-10',
    description:
      'Implementar tema oscuro en toda la aplicación. Incluir toggle en configuración de usuario y recordar preferencia en localStorage.'
  },
  {
    id: '3',
    title: 'Tooltip se superpone al header',
    priority: 'low',
    updatedAt: '2025-02-01',
    description:
      'Los tooltips de información en la sección de productos aparecen por encima del header sticky, generando un problema visual menor.'
  },
  {
    id: '4',
    title: 'Navegación móvil falla al rotar',
    priority: 'high',
    updatedAt: '2025-02-15',
    description:
      'Al rotar el dispositivo de vertical a horizontal, el menú de navegación no se ajusta correctamente y algunos enlaces quedan inaccesibles.'
  },
  {
    id: '5',
    title: 'Migas de pan en detalle de producto',
    priority: 'medium',
    updatedAt: '2025-02-12',
    description:
      'Añadir breadcrumbs en la página de detalle de producto para facilitar la navegación del usuario y mejorar la UX.'
  },
  {
    id: '6',
    title: 'Optimizar imágenes del carrusel',
    priority: 'low',
    updatedAt: '2025-01-25',
    description:
      'Las imágenes del carrusel principal son muy pesadas y afectan el rendimiento en conexiones lentas. Implementar lazy loading y formatos modernos (WebP).'
  }
]

export class InMemoryTicketRepository implements TicketRepository {
  private tickets: Ticket[]

  constructor() {
    this.tickets = SEED_DATA.map(toDomain)
  }

  async findAll(): Promise<Ticket[]> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 100))
    return [...this.tickets]
  }
}
