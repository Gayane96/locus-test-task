import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/services/auth.services';

@Injectable({})
export class UserService {
  constructor(private readonly authService: AuthService) {}

  async findUserByToken(token: string): Promise<object> {
    const user = await this.authService.getUserFromAuthenticationToken(token);
    delete user.password;
    return user;
  }
}
