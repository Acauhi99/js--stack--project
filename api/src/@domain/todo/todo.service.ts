import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.model';
import { TodoCreateFieldsDto, TodoUpdateFieldsDto } from './dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async listTodos(): Promise<Todo[]> {
    return await this.todoRepository.find();
  }

  async getTodo(id: string): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return todo;
  }

  async createTodo(createTodoDto: TodoCreateFieldsDto): Promise<Todo> {
    const todo = this.todoRepository.create(createTodoDto);
    return await this.todoRepository.save(todo);
  }

  async updateTodo(
    id: string,
    updateTodoDto: TodoUpdateFieldsDto,
  ): Promise<Todo> {
    const todo = await this.getTodo(id);

    Object.assign(todo, updateTodoDto);

    return await this.todoRepository.save(todo);
  }

  async deleteTodo(id: string): Promise<void> {
    const result = await this.todoRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
  }
}
