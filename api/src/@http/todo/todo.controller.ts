import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TodoService } from '../../@domain';
import { TodoCreateFieldsDto } from '../../@domain';
import { TodoUpdateFieldsDto } from '../../@domain';
import { Todo } from '../../@domain';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('todos')
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @ApiOperation({ summary: 'List all Todos' })
  @ApiResponse({
    status: 200,
    description: 'Todos list returned successfully',
    type: [Todo],
  })
  async listTodos(): Promise<Todo[]> {
    return this.todoService.listTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Todo by ID' })
  @ApiResponse({
    status: 200,
    description: 'Todo found successfully',
    type: Todo,
  })
  @ApiResponse({
    status: 404,
    description: 'Todo not found',
  })
  async getTodo(@Param('id') id: string): Promise<Todo> {
    return this.todoService.getTodo(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new Todo' })
  @ApiResponse({
    status: 201,
    description: 'Todo created successfully',
    type: Todo,
  })
  async createTodo(@Body() createTodoDto: TodoCreateFieldsDto): Promise<Todo> {
    return this.todoService.createTodo(createTodoDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing Todo' })
  @ApiResponse({
    status: 200,
    description: 'Todo updated successfully',
    type: Todo,
  })
  @ApiResponse({
    status: 404,
    description: 'Todo not found',
  })
  async updateTodo(
    @Param('id') id: string,
    @Body() updateTodoDto: TodoUpdateFieldsDto,
  ): Promise<Todo> {
    return this.todoService.updateTodo(id, updateTodoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a Todo' })
  @ApiResponse({
    status: 204,
    description: 'Todo deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Todo not found',
  })
  async deleteTodo(@Param('id') id: string): Promise<void> {
    await this.todoService.deleteTodo(id);
  }
}
