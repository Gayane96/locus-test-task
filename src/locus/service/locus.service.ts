import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RncLocus } from '../entity/locus.entity';
import {
  LocusFilterDto,
  PaginationDto,
  SortingDto,
} from '../locus-dto/locus.dto';
import { LocusMembersEnum, RegionIdEnum } from 'src/auth/enums/enums';

@Injectable()
export class LocusService {
  constructor(
    @InjectRepository(RncLocus)
    private readonly locusRepository: Repository<RncLocus>,
  ) {}

  async getLocus(
    filterDto: LocusFilterDto,
    paginationDto: PaginationDto,
    sortingDto: SortingDto,
    userRole: string,
  ): Promise<RncLocus[]> {
    const query = this.locusRepository.createQueryBuilder('locus');

    query.leftJoinAndSelect('locus.members', 'locusMembers');

    // Apply filtering conditions
    if (filterDto.id) {
      query.andWhere('locus.id = :id', { id: filterDto.id });
    }
    if (filterDto.assemblyId) {
      query.andWhere('locus.assemblyId = :assemblyId', {
        assemblyId: filterDto.assemblyId,
      });
    }
    if (filterDto.membershipStatus) {
      query.andWhere('locusMembers.membershipStatus = :membershipStatus', {
        membershipStatus: filterDto.membershipStatus,
      });
    }

    // Apply pagination
    const { page, rows } = paginationDto;

    if (Number(page) <= 0 || Number(rows) <= 0) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    // Calculate skip and take values
    const skip = (Number(page) - 1) * Number(rows);
    const take = Number(rows);
    query.skip(skip).take(take);

    // Apply sorting
    if (sortingDto.sortField && sortingDto.sortOrder) {
      query.orderBy(`locus.${sortingDto.sortField}`, sortingDto.sortOrder);
    }

    // Apply permissions based on user role
    if (userRole === 'normal') {
      query.select(['locus.id', 'locus.assemblyId']);
    } else if (userRole === 'limited') {
      query.andWhere('locus.regionId IN (:...regionIds)', {
        regionIds: [
          RegionIdEnum.Region1,
          RegionIdEnum.Region2,
          RegionIdEnum.Region3,
        ],
      });
      if (filterDto.sideloading === LocusMembersEnum.LocusMembers) {
        throw new ForbiddenException('Limited user cannot use sideloading.');
      }
    }

    return query.getMany();
  }
}
