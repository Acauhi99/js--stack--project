import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { TodoCreateFieldsDto } from "../interfaces/todo";
import { TodoService } from "../services/todoService";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const completed = formData.get("completed") === "on";

  if (!title?.trim()) {
    return json({ error: "O título é obrigatório" }, { status: 400 });
  }

  try {
    const createData: TodoCreateFieldsDto = {
      title,
      description,
      completed,
    };
    await TodoService.createTodo(createData);
    return redirect("/todos");
  } catch (error) {
    return json(
      { error: "Erro ao criar tarefa. Tente novamente." },
      { status: 500 }
    );
  }
}

export default function NewTodo() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-10">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Nova Tarefa
        </h2>

        {actionData?.error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            {actionData.error}
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
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="completed"
              className="ml-2 text-gray-700 dark:text-gray-300"
            >
              Tarefa já concluída
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
