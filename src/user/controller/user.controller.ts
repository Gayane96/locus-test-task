import { Controller, Get, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UserService } from '../services/user.services';

@ApiTags('modules.user')
@Controller({
  version: '1',
  path: '/user',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth('accessToken')
  @Get('me')
  async getCurentUser(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    return await this.userService.findUserByToken(token);
  }
}
