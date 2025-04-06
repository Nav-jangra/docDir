export interface ContextInterface {
  user?: User;
  requestId: string;
  session: Session;
}
interface User {
  id: number;
  status?: string;
  phone?: string;
  email?: string;
  fullname: string;
  pic?: string;
  role?: Object;
  gender?: string;
}

interface Session {
  user: User
}