import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  serviceName: string;

  @Column({ nullable: false })
  endpoint: string;

  @Column({ nullable: false, type: 'text' }) // Изменил на 'text' для хранения JSON
  headers: string;

  @Column({ nullable: false })
  status: string;

  @Column({ nullable: true })
  fileUrl?: string;
}