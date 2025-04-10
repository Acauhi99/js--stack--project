export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TodoViewModel = Todo;

export interface TodoUpdateFieldsDto {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface TodoCreateFieldsDto {
  title: string;
  description?: string;
  completed?: boolean;
}
