import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class MiddlewareExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let status = exception?.status
      ? exception.status
      : HttpStatus.INTERNAL_SERVER_ERROR;
    console.log("exception:\n" + JSON.stringify(exception));
    let message = search(exception, 'message') ||
      'Internal Server Error';
    response.status(status ?? 500).json({
      code: status ?? 500,
      isSuccess: false,
      message: message,
      error: search(exception, 'name') || exception?.response?.error,
    });
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