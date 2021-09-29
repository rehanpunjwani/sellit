import { User } from './user.model';
import { Token } from './token.model';

export class Auth extends Token {
  user: User;
}
