import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigation,
  useActionData,
} from "@remix-run/react";
import { TodoService } from "../services/todoService";
import type { TodoUpdateFieldsDto } from "../interfaces/todo";

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) return redirect("/todos");

  try {
    const todo = await TodoService.getTodo(id);
    return Response.json({ todo });
  } catch {
    return Response.json(
      { error: "Failed to load todo", todo: null },
      { status: 404 }
    );
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { id } = params;
  if (!id) return Response.json({ error: "ID is required" }, { status: 400 });

  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const completed = formData.get("completed") === "on";

  if (!title?.trim()) {
    return Response.json({ error: "O título é obrigatório" }, { status: 400 });
  }

  try {
    const updateData: TodoUpdateFieldsDto = { title, description, completed };
    await TodoService.updateTodo(id, updateData);

    return redirect("/todos");
  } catch {
    return Response.json(
      { error: "Erro ao atualizar tarefa. Tente novamente." },
      { status: 500 }
    );
  }
}

export default function EditTodo() {
  const { todo, error: loaderError } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";
  const error = actionData?.error || loaderError;

  // Redirect if no todo found
  if (!todo && !isSubmitting) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
          <p className="text-red-600">{error || "Todo not found"}</p>
          <p className="text-center mt-2">Redirecionando...</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (navigation.state === "loading" && !todo) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-2">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-10">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Editar Tarefa
        </h2>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            {error}
          </div>
        )}

        <Form method="post">
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
            >
              Título*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={todo?.title || ""}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
            >
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={todo?.description || ""}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="completed"
              name="completed"
              defaultChecked={todo?.completed}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="completed"
              className="ml-2 text-gray-700 dark:text-gray-300"
            >
              Tarefa concluída
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <a
              href="/todos"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                       text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancelar
            </a>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
