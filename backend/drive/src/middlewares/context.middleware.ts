/* eslint-disable @typescript-eslint/no-var-requires */
import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { ResponseStructureInterface } from 'src/common/interfaces/responseStructure.interface';

function isParamAvailable(req: any, key: string) {
  if (!req.headers[key]) {
    throw new BadRequestException(key + ' not found in headers');
  }
  return req.headers[key];
}

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    const originalSend = res.send.bind(res);
    res.send = (body) => {
      let bodyObj;
      try {
        bodyObj = JSON.parse(body);
      } catch (e) {
        bodyObj = body;
      }

      const response: ResponseStructureInterface = {
        isSuccess: true,
        statusCode: res.statusCode,
      } as ResponseStructureInterface;

      if (bodyObj.statusCode > 399) {
        response.isSuccess = false;
        response.message = bodyObj.message;
        response.statusCode = bodyObj.statusCode;
        response.error = bodyObj.error;
      } else if (bodyObj.items) {
        response.items = bodyObj.items;
        response.count = bodyObj.count;
        response.offset = bodyObj.offset;
        response.limit = bodyObj.limit;
        response.page = Math.floor(bodyObj.offset / bodyObj.limit) + 1;
      } else if (bodyObj.message) {
        response.message = bodyObj.message;
      } else {
        response.data = bodyObj;
      }

      return originalSend(JSON.stringify(response));
    };

    console.log(req.headers);
    req['session'] = JSON.parse(req.headers['session'] as string);
    return next();
  }
}
