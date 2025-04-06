import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpHelper } from '../helpers/http.service';

@Injectable()
export class Session {
    constructor(
        private readonly httpHelper: HttpHelper,
        private readonly configService: ConfigService
    ) {
    }
    async findOneByCode(code: string, requestId: string): Promise<Object> {
        let providers = this.configService.get('provider')
        let url = `${providers.directory.url}/api/session/${code}`;
        let response = await this.httpHelper.get(url, { requestId });
        return response.data;
    }
}
