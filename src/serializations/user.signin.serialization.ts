import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';

export class UserSigninSerialization {
  @ApiProperty({
    example: faker.internet.email(),
  })
  readonly email: string;

  @ApiProperty({
    example: faker.internet.password(),
  })
  readonly password: string;
}
