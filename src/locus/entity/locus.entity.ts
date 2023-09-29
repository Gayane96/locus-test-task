import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RncLocusMembers } from './locus-members.entity';
import { RegionIdEnum } from 'src/auth/enums/enums';

@Entity('rnc_locus')
export class RncLocus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  assemblyId: number;

  @Column({
    type: 'enum',
    enum: RegionIdEnum,
    default: RegionIdEnum.Region1,
  })
  regionId: RegionIdEnum;

  @OneToMany(
    () => RncLocusMembers,
    (locusMember: RncLocusMembers) => locusMember.locus,
  )
  members: RncLocusMembers[];
}
