import { User } from './user.model';
import { BaseModel } from './base.model';

export class Post extends BaseModel {
  title: string;
  content: string;
  published: boolean;
  author: User;
}
