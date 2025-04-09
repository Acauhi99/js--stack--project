import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TodoState } from '../todo.model';

export class TodoCreateFieldsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TodoState)
  @IsOptional()
  state?: TodoState;
}
