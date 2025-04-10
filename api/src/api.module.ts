import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TodoController } from './@http';
import { TodoService } from './@domain';
import { Todo } from './@domain/todo/todo.model';
import { dataSourceOptions } from './@infra';
import { HealthController } from './@http';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([Todo]),
  ],
  controllers: [TodoController, HealthController],
  providers: [TodoService],
})
export class ApiModule {}
