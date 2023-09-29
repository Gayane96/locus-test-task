import { IsInt, IsEnum, IsOptional, IsString } from 'class-validator';
import { LocusMembersEnum, RegionIdEnum } from 'src/auth/enums/enums';

export class LocusFilterDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsInt()
  @IsOptional()
  assemblyId?: number;

  @IsEnum(RegionIdEnum)
  @IsOptional()
  regionId?: RegionIdEnum;

  @IsEnum(LocusMembersEnum)
  @IsOptional()
  sideloading?: LocusMembersEnum;

  @IsString()
  @IsOptional()
  membershipStatus?: string;
}

export class PaginationDto {
  @IsInt()
  @IsOptional()
  page: number = 1;

  @IsInt()
  @IsOptional()
  rows: number = 1000;
}

export class SortingDto {
  @IsString()
  @IsOptional()
  sortField?: string;

  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}
