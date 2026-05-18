import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BrandsModule } from './brands/brands.module';


@Module({
  imports: [
    // 1. Load the .env file globally so every module can use it
    ConfigModule.forRoot({
      isGlobal: true, 
    }),

    // 2. Connect to the PostgreSQL database using TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        
        //learnded from stackOverFlow ,Tells TypeORM to look for database table designs (entities) anywhere in our src folder
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        
        // IMPORTANT: Auto-creates tables in our database when we start the app.
        // We set this to true for learning, but in a production app, we turn this off!
        synchronize: true, 
      }),
    }),

    UsersModule,

    AuthModule,

    BrandsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
