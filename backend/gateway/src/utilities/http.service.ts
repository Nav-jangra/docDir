import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ResponseType } from 'axios';
import { Response } from 'express';
import * as FormData from 'form-data';
import { createReadStream, unlink } from 'fs';


// Default request configuration
const _config = {
  timeout: 10000,
  timeoutErrorMessage: "Service took too much time to respond"
}

@Injectable()
export class HttpHelper {

  constructor(private readonly httpService: HttpService) { }

  get = async (url: string, headers: object): Promise<any> => {
    return new Promise((resolve) => {
      this.httpService.get(url, { headers: { ...headers }, ..._config }).subscribe({
        next: result => resolve(result),
        error: error => resolve(error.response)
      })
    })
  }

  put = async (url: string, body: object, header: object): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.httpService.put(url, body, { headers: { ...header } }).subscribe({
        next: result => resolve(result),
        error: error => resolve(error.response)
      })
    })
  }

  post = async (url: string, body: object, header: object): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.httpService.post(url, body, { headers: { ...header } }).subscribe({
        next: result => resolve(result),
        error: error => resolve(error.response)
      })
    })
  }

  delete = async (url: string, headers: object): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.httpService.delete(url, { headers: { ...headers }, ..._config }).subscribe({
        next: result => resolve(result),
        error: error => resolve(error.response)
      })
    })
  }

  download = async (url: string, headers: object, responseType: ResponseType, target: Response): Promise<any> => {
    const response = await this.httpService.axiosRef.get(url, { headers: { ...headers }, ..._config, responseType });

    // set forward headers
    target.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
    target.setHeader('Content-Disposition', response.headers['content-disposition']);

    // Pipe the response stream to the client
    response.data
      .on('error', (err) => {
        console.error('Error in streaming data:', err.message);
        if (!target.headersSent) {
          target.status(500).send('Error streaming file');
        }
      })
      .pipe(target)
      .on('error', (err) => {
        console.error('Error in response piping:', err.message);
      });
  }

  upload = (url: string, file: Express.Multer.File, body: any, headers: object): Promise<any> => {
    const form: FormData = new FormData();
    form.append('file', createReadStream(file.path));
    form.append('body', JSON.stringify(body))
    return new Promise((resolve, reject) => {
      this.httpService.post(url, form, { headers: { ...headers, ...form.getHeaders() } }).subscribe({
        next: result => resolve(result),
        error: error => resolve(error.response),
        complete: () => {
          unlink(file.path, (err) => {
            if (err) console.error('Error deleting file:', err);
            else console.log('File successfully deleted');
          });
        }
      })
    })
  }
}
