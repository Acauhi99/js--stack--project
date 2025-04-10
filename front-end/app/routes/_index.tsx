import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "To Do App" },
    { name: "description", content: "Um projeto de infraestrutura" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center">
          To Do App um projeto de infraestrutura
        </h1>

        <Link
          to="/todos"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ver tarefas
        </Link>
      </div>
    </div>
  );
}
