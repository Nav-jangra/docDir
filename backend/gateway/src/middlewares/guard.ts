import {
  ForbiddenException,
  HttpException,
  Injectable,
  NestMiddleware,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { NextFunction, Request, Response } from 'express';
import { Apis } from 'src/apis/entity/apis.entity';
import { AccessEnum } from 'src/apis/entity/enums/access';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Session } from '../clients/directoryClient/apis/session';
@Injectable()
export class Guard implements NestMiddleware {
  private readonly urlSplitRegex = /[/.]/;
  constructor(
    @InjectRepository(Apis) private apisRepository: Repository<Apis>,
    private readonly session: Session,
    private readonly configService: ConfigService,
    private jwt: JwtService
  ) { }

  getApiConfigs = async (httpVerb: string, url: string): Promise<Object> => {
    url = url.split('?')[0];
    if (url.endsWith('/')) url = url.substring(0, url.length - 1);

    let tokens = url.split('/');
    let service = tokens[1];
    let entity = tokens[2];

    tokens.shift();
    tokens.shift();
    tokens.shift();

    url = tokens.join('/');

    console.log({ method: httpVerb, service: service, entity: entity });

    let options: Apis[] = await this.apisRepository.find({
      where: {
        method: httpVerb,
        service: service,
        entity: entity,
      },
    });

    let pathCandidates = JSON.parse(JSON.stringify(options));

    let m: number = url ? url.split(this.urlSplitRegex).length : 0;
    pathCandidates = pathCandidates.filter(
      (urll) => (urll.path ? urll.path.split(this.urlSplitRegex).length : 0) == m
    );
    pathCandidates.forEach((element) => {
      element['splited'] = element.path.split(this.urlSplitRegex);
    });

    console.log('pathCandidates after filter and split :\n', pathCandidates);

    let pathToCheck = url.split(this.urlSplitRegex);

    let matches = pathCandidates || [];

    for (let i = 0; i < pathToCheck.length; i++) {
      let partialMatch: Apis[] = [];

      const arr = matches.map((match) => match['splited'][i]);

      for (let j = 0; j < arr.length; j++) {
        const a = arr[j];

        if (a == pathToCheck[i] || a.startsWith(':')) {
          partialMatch.push(matches[j]);
        }
      }

      const exactMatch = partialMatch.filter((obj) => obj['splited'][i] == pathToCheck[i]);
      matches = exactMatch.length > 0 ? [...exactMatch] : [...partialMatch];
    }

    return matches[0];
  };

  async use(req: Request, res: Response, next: NextFunction) {

    let url = req.originalUrl.substring(1);

    console.info(`called url: ${url}`);
    const api: Object = await this.getApiConfigs(req.method, url);
    console.info(`Path: ${JSON.stringify(api)}`);

    if (!api) {
      console.error(`Path doesn't exists`);
      throw new NotFoundException('Path doesn\'t exists');
    }
    req['requestId'] = uuidv4();

    const originalSend = res.send;
    res.send = (body) => {
      if (!!body) {
        const bodyObj = JSON.parse(body);
        res.status(bodyObj['status'] || bodyObj['code']);
        const sendResponse = originalSend.call(
          res,
          JSON.stringify(bodyObj.data || bodyObj)
        );
        res.send = originalSend;
        return sendResponse;
      }
    };

    let session: any;
    //all other than public
    if (api['access'] != AccessEnum.Public) {
      let data: any = this.verifyToken(req);

      session = await this.verifySession(session, data, req['requestId']);

      if (api['access'] != AccessEnum.Authentication)
        this.verifyApiPermissions(api, session);
    }

    req['session'] = session?.data;
    req['spec'] = api;
    next();
  }

  private verifyApiPermissions(api: any, session: any) {
    const path: string = api['path'];
    const method: string = api['method'];
    const entityName: string = api['entity'];
    const apiPermissions: Array<string> = api['permissions'] ? api['permissions'].split(',') : [];

    let action;
    switch (method) {
      case 'GET':
        action = 'view';
        break;
      case 'PUT':
        action = 'update';
        break;
      case 'POST':
        action = 'create';
        if (path.endsWith('/delete')) {
          action = 'delete';
        }
        break;
    }

    if (!session['data']['permissions']) {
      throw new ForbiddenException(
        `You are not allowed to ${action} ${entityName[0].toUpperCase()}${entityName.substring(1).toLocaleLowerCase()}`
      );
    }

    if (apiPermissions.length == 0) return true;

    const userPermissions = session['data']['permissions']

    if (apiPermissions.some(apiPermission => userPermissions.includes(apiPermission))) {
      return true;
    }

    throw new ForbiddenException(
      `You are not allowed to ${action} ${entityName[0].toUpperCase()}${entityName.substring(1).toLocaleLowerCase()}`
    );
  }

  private verifyToken(req) {
    const token = req.query.token || req.headers.token;

    if (!token) {
      console.error(`Token doesn't exists`);
      throw new HttpException('Token Not Found', 499);
    }

    try {
      return this.jwt.verify(token.toString(), {
        secret: this.configService.get('jwt_secret'),
      });
    } catch (error) {
      console.error(`jwt not verified: ${JSON.stringify(error)}`);
      throw new HttpException('INVALID_TOKEN', 498);
    }
  }

  private async verifySession(
    session: any,
    data: any,
    requestId: string
  ) {
    session = await this.session.findOneByCode(data['id'], requestId).catch(err => {
      console.error(err);
    });
    if (!session || !session.isSuccess) {
      console.error(`session doesn't exists for:  ${data.id}`);
      throw new HttpException('INVALID_SESSION', 440);
    }
    return session;
  }
}
