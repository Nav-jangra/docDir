import { User } from "src/users/entities/user.entity";

export class CreateSessionDto {
  expiry: Date;
  user: Partial<User>;
  device?: string;
  // attempts: number;
  metadata?: JSON;
}
