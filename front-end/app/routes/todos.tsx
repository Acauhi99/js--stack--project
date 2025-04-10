import { ActionFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useFetcher } from "@remix-run/react";
import { TodoService } from "../services/todoService";
import type { Todo } from "../interfaces/todo";

// Add type definition for fetcher response data
type FetcherResponse = {
  success?: boolean;
  error?: string;
};

export async function loader() {
  try {
    const todos = await TodoService.getTodos();
    return Response.json({ todos, error: null });
  } catch {
    return Response.json({
      todos: [],
      error: "Falha ao carregar as tarefas. Tente novamente.",
    });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const id = formData.get("id") as string;

  if (intent === "delete") {
    try {
      await TodoService.deleteTodo(id);
      return Response.json({ success: true });
    } catch {
      return Response.json(
        { error: "Erro ao excluir tarefa." },
        { status: 500 }
      );
    }
  } else if (intent === "toggle") {
    const completed = formData.get("completed") === "true";
    try {
      await TodoService.updateTodo(id, { completed: !completed });
      return Response.json({ success: true });
    } catch {
      return Response.json(
        { error: "Erro ao atualizar status da tarefa." },
        { status: 500 }
      );
    }
  }

  return Response.json({ error: "Operação não suportada" }, { status: 400 });
}

export const meta = () => {
  return [
    { title: "To Do App - Tarefas" },
    { name: "description", content: "Gerenciamento de tarefas" },
  ];
};

export default function Todos() {
  const { todos, error } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<FetcherResponse>();

  const handleDelete = (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      return;
    }

    const formData = new FormData();
    formData.append("intent", "delete");
    formData.append("id", id);
    fetcher.submit(formData, { method: "post" });
  };

  const handleToggle = (todo: Todo) => {
    const formData = new FormData();
    formData.append("intent", "toggle");
    formData.append("id", todo.id);
    formData.append("completed", String(todo.completed));
    fetcher.submit(formData, { method: "post" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <Link to="/" className="text-blue-600 hover:underline mb-4 block">
            ← Voltar
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Lista de Tarefas
          </h1>
        </div>

        <Link
          to="/todos/new"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Nova Tarefa
        </Link>
      </header>

      {(error || fetcher.data?.error) && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p>{fetcher.data?.error || error}</p>
        </div>
      )}

      {fetcher.state === "loading" || fetcher.state === "submitting" ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : todos.length === 0 ? (
        <div className="text-center py-8 text-gray-600 dark:text-gray-300">
          <p>Nenhuma tarefa encontrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todos.map((todo: Todo) => (
            <div
              key={todo.id}
              className={`border rounded-lg shadow-sm p-4 ${
                todo.completed
                  ? "bg-gray-50 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-900"
              }`}
            >
              <div className="flex justify-between items-start">
                <h3
                  className={`font-medium ${
                    todo.completed
                      ? "line-through text-gray-500"
                      : "text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {todo.title}
                </h3>
                <div className="flex space-x-2">
                  <Link
                    to={`/todos/${todo.id}/edit`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ✏️
                  </Link>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <p
                className={`mt-2 text-sm ${
                  todo.completed
                    ? "text-gray-500"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {todo.description}
              </p>

              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => handleToggle(todo)}
                  className={`px-3 py-1 rounded text-sm ${
                    todo.completed
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  }`}
                >
                  {todo.completed ? "Reabrir" : "Concluir"}
                </button>
                <span className="text-xs text-gray-500">
                  {new Date(todo.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Outlet />
    </div>
  );
}
