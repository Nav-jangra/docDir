import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseProvider = async (configuration: ConfigService): Promise<TypeOrmModuleOptions> => ({
    type: 'postgres',
    host: configuration.get('database.host'),
    port: Number(configuration.get('database.port')),
    username: configuration.get('database.username'),
    password: configuration.get('database.password'),
    database: configuration.get('database.name'),
    autoLoadEntities: true,
    entities: [__dirname + './../**/*.entity{.ts,.js}'],
    migrations: ['src/migrations/*{.ts,.js}'],
    synchronize: configuration.get('database.synchronize'),
    logging: configuration.get('database.logging'),
});
