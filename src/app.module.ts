import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurante } from './restaurante/restaurante.entity';
import { Plato } from './plato/plato.entity';
import { RestauranteModule } from './restaurante/restaurante.module';
import { RestaurantePlatoModule } from './restaurante-plato/restaurante-plato.module';
import { PlatoModule } from './plato/plato.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, RestauranteModule, PlatoModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT') ?? '5432', 10),
        username: config.get<string>('DB_USERNAME') ?? '',
        password: config.get<string>('DB_PASSWORD') ?? '',
        database: config.get<string>('DB_DATABASE') ?? '',
        entities: [Restaurante, Plato],
        synchronize: true, // Solo para desarrollo
      }),
    }),
    TypeOrmModule.forFeature([Restaurante, Plato]),
    RestaurantePlatoModule,
  ],
  providers: [AppService],
})
export class AppModule {}

