import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';

export class UserCreateSerialization {
  @ApiProperty({
    example: faker.internet.userName(),
    nullable: true,
    required: false,
  })
  readonly username: string;

  @ApiProperty({
    example: '88186467',
  })
  readonly regionId: string;

  @ApiProperty({
    example: faker.internet.email(),
  })
  readonly email: string;

  @ApiProperty({
    example: faker.internet.password(),
  })
  readonly password: string;
}
