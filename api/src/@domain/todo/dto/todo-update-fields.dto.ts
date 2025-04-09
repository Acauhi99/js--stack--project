import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TodoState } from '../todo.model';

export class TodoUpdateFieldsDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TodoState)
  @IsOptional()
  state?: TodoState;
}
