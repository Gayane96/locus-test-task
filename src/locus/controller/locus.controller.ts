import { Controller, Get, Query, Req } from '@nestjs/common';
import { LocusService } from '../service/locus.service';
import {
  LocusFilterDto,
  PaginationDto,
  SortingDto,
} from '../locus-dto/locus.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/services/auth.services';

@ApiTags('modules.locus')
@Controller({
  version: '1',
  path: '/locus',
})
export class LocusController {
  constructor(
    private readonly locusService: LocusService,
    private readonly authService: AuthService,
  ) {}

  @ApiBearerAuth('accessToken')
  @Get()
  @ApiQuery({ name: 'id', required: false, description: 'Filter by id' })
  @ApiQuery({
    name: 'assemblyId',
    required: false,
    description: 'Filter by assemblyId',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({
    name: 'rows',
    required: false,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'sortField',
    required: false,
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order (asc or desc)',
  })
  async getLocus(
    @Query() filterDto: LocusFilterDto,
    @Query() paginationDto: PaginationDto,
    @Query() sortingDto: SortingDto,
    @Req() req: any,
  ) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    const user = await this.authService.getUserFromAuthenticationToken(token);
    const userRole = user.role;
    return this.locusService.getLocus(
      filterDto,
      paginationDto,
      sortingDto,
      userRole,
    );
  }
}
