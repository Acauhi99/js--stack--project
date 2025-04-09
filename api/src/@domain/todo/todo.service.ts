import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.model';
import { TodoCreateFieldsDto } from './dto/todo-create-fields.dto';
import { TodoUpdateFieldsDto } from './dto/todo-update-fields.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async findAll(): Promise<Todo[]> {
    return this.todoRepository.find();
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return todo;
  }

  async create(createTodoDto: TodoCreateFieldsDto): Promise<Todo> {
    const todo = this.todoRepository.create(createTodoDto);

    return this.todoRepository.save(todo);
  }

  async update(id: string, updateTodoDto: TodoUpdateFieldsDto): Promise<Todo> {
    const todo = await this.findOne(id);
    Object.assign(todo, updateTodoDto);

    return this.todoRepository.save(todo);
  }

  async remove(id: string): Promise<void> {
    const result = await this.todoRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
  }
}
