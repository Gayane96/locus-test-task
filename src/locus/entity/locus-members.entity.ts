import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { RncLocus } from './locus.entity';

@Entity('rnc_locus_members')
export class RncLocusMembers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  membershipStatus: string;

  @ManyToOne(() => RncLocus, (locus: RncLocus) => locus.members)
  locus: RncLocus;
}
