import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RoomService } from './room.service';

@WebSocketGateway({ namespace: 'room-availability' })
export class RoomGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  constructor(private readonly roomService: RoomService) {}

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  @SubscribeMessage('checkAvailability')
  async handleCheckAvailability(client: any) {
    console.log('Evento checkAvailability recibido'); // Esto debería imprimirse cuando se recibe el mensaje

    try {
      console.log('Consultando disponibilidad...');
      const isAvailable = await this.roomService.isAvailable();
      console.log('Disponibilidad obtenida:', isAvailable); // Imprimir el estado de disponibilidad
      client.emit('availabilityUpdate', { available: isAvailable }); // Emitir la respuesta
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      client.emit('availabilityUpdate', { message: 'Error al verificar disponibilidad', error: error.message });
    }
  }
}