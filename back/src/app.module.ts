import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, load: [typeorm] }),
    // dentro de app, yo voy a configurar un modulo de NestJS que trabaje de forma global y que contenga la informacion del servicio de TypeORM, para que pueda ser accedido desde cualquier modulo de mi aplicacion.
    TypeOrmModule.forRootAsync({
      inject: [ConfigService], // configservice, va a tener todos los modulos que yo haya creado de configuracion, en este caso el de typeorm.
      useFactory: (config: ConfigService) => config.get('typeorm')!,
    }),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '60m' },
      secret: process.env.JWT_SECRET,
    }),
    CategoriesModule,
    OrdersModule,
    FileUploadModule,
    // aca es for Root Async porque la configuracion de TypeORM depende de la carga de las variables de entorno, y esto puede demorar un poco, entonces lo hago de forma asincronica.
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
