import { IsNotEmpty } from 'class-validator';

export class PostIdArgs {
  @IsNotEmpty()
  postId: string;
}
