import { BadRequestException, Injectable, NestMiddleware, Scope } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { RequestInterface } from 'src/common/interfaces/request.interface';
import { ResponseStructureInterface } from 'src/common/responseStructure.interface';
import { DataSource } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class ContextMiddleware implements NestMiddleware {
  constructor(private readonly dataSource: DataSource) { }
  isParamAvailable = (req: any, key: string) => {
    if (!req.headers[key]) {
      throw new BadRequestException(key + ' not found in headers');
    }
    return req.headers[key];
  };

  async use(req: RequestInterface, res: Response, next: NextFunction) {
    const originalSend = res.send;
    res.send = (body) => {
      console.log(body);
      const bodyObj = JSON.parse(body);
      const response: ResponseStructureInterface = {} as ResponseStructureInterface;
      response.isSuccess = true;
      if (bodyObj.error) {
        console.log(bodyObj.error);
        response.isSuccess = false;
        response.error = {
          message: bodyObj.error.message,
          retry: false,
          invalidAttributes: bodyObj?.error?.cause ?? {},
        };
        if (search(bodyObj, 'sqlState') == '23000') {
          response.error['message'] =
            'Duplicate entry for: ' +
            search(bodyObj, 'sqlMessage')
              .split('key')
              .pop()
              .replace(/('|IDX|tenant)/g, '')
              .trim()
              .replace(/(_)/g, ' ');
        }
      } else if (bodyObj.items) {
        response.items = bodyObj.items;
        response.count = bodyObj.count;
        response.page = bodyObj.page;
        response.pageSize = bodyObj.pageSize;
      } else if (bodyObj.message) {
        response.message = bodyObj.message;
      } else {
        response.data = bodyObj;
      }
      const sendResponse = originalSend.call(res, JSON.stringify(response));
      res.send = originalSend;
      return sendResponse;
    };

    req.context = {
      requestId: this.isParamAvailable(req, 'requestid') as string,
      session: JSON.parse((req.headers?.['session'] as string) ?? '{}'),
    };

    if (req.originalUrl.includes('session')) return next();

    req.context.user = { ...req.context.session.user };
    next();
  }
}

const search = (obj, key) => {
  if (!obj || typeof obj !== 'object') {
    return;
  }

  if (obj.hasOwnProperty(key)) {
    return obj[key];
  }

  for (const k of Object.values(obj)) {
    if (typeof k == 'object') {
      return search(k, key);
    }
  }
};
