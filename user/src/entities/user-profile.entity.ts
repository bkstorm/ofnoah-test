import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('user_profile')
export class UserProfile {
  @PrimaryColumn({ type: 'text' })
  uid: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ name: 'birthdate', type: 'date' })
  birthdate: Date;
}
