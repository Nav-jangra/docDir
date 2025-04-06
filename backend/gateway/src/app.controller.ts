import { All, Controller, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseType } from 'axios';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import { extname, parse } from 'path';
import { HttpHelper } from 'src/utilities/http.service';
import { DELETE, DOWNLOAD, STREAMS, UPDATE } from './constants';

const storage = diskStorage({
  destination: './temp',
  filename: (req, file, callback) => {
    const uniqueSuffix = `${Math.round(
      Math.random() * 1e9,
    )}`;
    const ext = extname(file.originalname);
    const name = parse(file.originalname).name;
    callback(null, `${name}-${uniqueSuffix}${ext}`);
  }
})

@Controller('/')
export class GuardController {
  constructor(
    private readonly httpHelper: HttpHelper,
    private configService: ConfigService,
  ) { }

  @All('/*')
  @UseInterceptors(FileInterceptor('file', { storage: storage, limits: { fileSize: 20 * 1024 * 1024 } }))
  async guard(@Req() req: Request, @UploadedFile() file: Express.Multer.File, @Res({ passthrough: true }) res: Response): Promise<any> {
    const headers_: Object = {
      requestId: req['requestId'],
      session: JSON.stringify(req['session'])
    };

    console.debug(`Headers: ${JSON.stringify(headers_)}`);

    // Construct the target URL
    const service = req['spec']['service'];
    let url = this.configService.get(`provider[${service}]`).url;
    url = req.url.replace(
      `/api/${req['spec']['service']}`,
      `${url}/api`,
    );

    const lastToken = url.substring(url.lastIndexOf('/') + 1).split('?')[0];
    console.debug(`lastToken : ${lastToken}`);

    // Determine HTTP method and adjust the URL if needed
    let method: string = req.method;
    switch (lastToken) {
      case DELETE:
        url = url.replace(`/${DELETE}`, '');
        method = 'DELETE';
        break;
      case UPDATE:
        url = url.replace(`/${UPDATE}`, '');
        method = 'PUT';
        break;
      case DOWNLOAD:
      case STREAMS:
        method = 'DOWNLOAD';
        break;
    }

    // Check if file exist then set the method to upload
    if (file && file.path) {
      method = 'UPLOAD';
    }

    console.debug(`Service: ${service}, Method: ${method}, URL: ${url}`);

    let serviceResponse: any;
    // Execute the appropriate method
    try {
      switch (method) {
        case 'POST':
          serviceResponse = await this.httpHelper.post(url, { ...req.body, file }, headers_);
          break;

        case 'GET':
          serviceResponse = await this.httpHelper.get(url, headers_);
          break;

        case 'PUT':
          serviceResponse = await this.httpHelper.put(url, req.body, headers_);
          break;

        case 'DELETE':
          serviceResponse = await this.httpHelper.delete(url, headers_);
          break;

        case 'UPLOAD':
          serviceResponse = await this.httpHelper.upload(url, file, req.body, headers_);
          break;

        case 'DOWNLOAD': {
          const responseType: ResponseType = (req.query.responseType as ResponseType) || 'stream';
          return this.httpHelper.download(url, headers_, responseType as ResponseType, res);
        }

        default:
          throw new Error(`API call not supported`);
      }

      console.debug(`Service response status: ${serviceResponse?.status}`);
      return {
        status: serviceResponse?.status ?? 503,
        data: serviceResponse?.data ?? { message: 'Service Unavailable' }
      };
    } catch (err) {
      console.error(`Error during API call: ${err.message}`);
      return {
        status: 503,
        data: { message: 'Service Unavailable' }
      };
    }
  }
}
