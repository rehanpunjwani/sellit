import { IsNotEmpty } from 'class-validator';

export class UserIdArgs {
  @IsNotEmpty()
  userId: string;
}
