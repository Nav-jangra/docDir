import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

const config = {
  timeout: 10000,
  timeoutErrorMessage: "Directory took too much time to respond"
}

@Injectable()
export class HttpHelper {

  constructor(private readonly httpService: HttpService) { }

  get = async (url: string, headers: object): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.httpService.get(url, { headers: { ...headers }, ...config }).subscribe({
        next: result => {
          resolve(result);
        },
        error: error => {
          resolve(error.response)
        }
      })
    })
  }
  put = async (url: string, body: object, header: object): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.httpService.put(url, body, { headers: { ...header } }).subscribe({
        next: result => {
          resolve(result);
        },
        error: error => {
          resolve(error.response)
        }
      })
    })
  }

  post = async (url: string, body: object, header: object): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.httpService.post(url, body, { headers: { ...header } }).subscribe({
        next: result => {
          resolve(result);
        },
        error: error => {
          resolve(error.response)
        }
      })
    })

  }
}
