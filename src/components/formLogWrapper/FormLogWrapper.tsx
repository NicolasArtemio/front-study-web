import { useState } from "react";
import { FormLog } from "../forms/FormLog";

export default function FormLogWrapper() {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => setShowForm((prev) => !prev);

  return (
    <div className="flex flex-col items-center justify-center mt-12 roboto-mono">
      <button
        onClick={toggleForm}
        className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition"
      >
        {showForm ? "Cerrar formulario" : "Agregar nuevo"}
      </button>

      {showForm && <FormLog />}
    </div>
  );
}
