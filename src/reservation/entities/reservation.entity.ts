
import { Room } from "src/room/entities/room.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reservations, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @ManyToOne(() => Room, (room) => room.reservations, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'room_id' })
  room: Room;
}
