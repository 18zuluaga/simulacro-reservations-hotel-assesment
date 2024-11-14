import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  roomNumber: string; 

  @Column({ nullable: true })
  description: string; 

  @Column()
  name: string; 

  @OneToMany(() => Reservation, (reservation) => reservation.room)
  reservations: Reservation[];
}

