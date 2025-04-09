import { TodoState } from '../todo.model';

export class TodoResponseDto {
  id: string;
  title: string;
  description?: string;
  state: TodoState;
  createdAt: Date;
  updatedAt: Date;
}
