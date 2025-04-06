
import { User } from 'src/users/entities/user.entity';

export interface ContextInterface {
  user?: User;
  requestId: string;
  session: Session;
}


interface Session {
  user: User
}