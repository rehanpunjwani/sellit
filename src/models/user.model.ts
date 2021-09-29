import { Post } from './post.model';
import { BaseModel } from './base.model';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
export class User extends BaseModel {
  email: string;
  firstname?: string;
  lastname?: string;
  role: Role;
  posts: Post[];
  password: string;
}
