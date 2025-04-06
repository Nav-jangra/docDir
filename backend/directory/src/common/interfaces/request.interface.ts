import { Request } from 'express';
import { ContextInterface } from './context.interface';
export interface RequestInterface extends Request {
  req: any;
  context: ContextInterface;
}
