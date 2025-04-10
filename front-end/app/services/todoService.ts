import type {
  Todo,
  TodoCreateFieldsDto,
  TodoUpdateFieldsDto,
} from "../interfaces/todo";

export class TodoService {
  private static API_URL = "/api/todos";

  static async getTodos(): Promise<Todo[]> {
    const response = await fetch(this.API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch todos");
    }

    return response.json();
  }

  static async getTodo(id: string): Promise<Todo> {
    const response = await fetch(`${this.API_URL}/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch todo");
    }

    return response.json();
  }

  static async createTodo(data: TodoCreateFieldsDto): Promise<Todo> {
    const response = await fetch(this.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create todo");
    }

    return response.json();
  }

  static async updateTodo(
    id: string,
    data: TodoUpdateFieldsDto
  ): Promise<Todo> {
    const response = await fetch(`${this.API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update todo");
    }

    return response.json();
  }

  static async deleteTodo(id: string): Promise<void> {
    const response = await fetch(`${this.API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete todo");
    }
  }
}
