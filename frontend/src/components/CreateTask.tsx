import React, { useContext, useEffect, useState } from "react";
import { Task, TaskCreate } from "../types/types.task";
import { PopUpContext } from "../context/popup";
import { useTasks } from "../hooks/useTask";

interface Props {
    task?: Task | null;
}

const CreateTask: React.FC<Props> = ({ task }) => {
    const { createTask, updateTask } = useTasks();
    const { setOpenCreate, setOpenUpdate } = useContext(PopUpContext);

    const title = task ? 'Actualizar' : 'Crear';

    const handleClosePopUp = () => {
      setOpenUpdate(false);
      setOpenCreate(false);
    };
    
    // Definir `newTask` sin `id`, ya que el backend lo genera si es una creación
    const [newTask, setNewTask] = useState<TaskCreate>({
      title: task?.title || "",
      subject: task?.subject || "",
      deadline: task?.deadline || "",
      completed: task?.completed || false,
  });

    // Cargar datos de la tarea al editar
    useEffect(() => {
      if (task) {
          setNewTask({
              title: task.title,
              subject: task.subject,
              deadline: task.deadline,
              completed: task.completed,
          });
      }
    }, [task]);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        if (task) {
          // Si es actualización, llama a `updateUser` con `id`
          updateTask({ ...newTask, id: task.id } as Task);
      } else {
          // Si es creación, llama a `createUser` sin `id`
          createTask(newTask);
      }
        
        handleClosePopUp();
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, type, checked } = event.target;
        const newValue = type === "checkbox" ? checked : value;

        setNewTask({
            ...newTask,
            [name]: newValue
        });
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                onClick={handleClosePopUp}
            >
              &times;
            </button>
      
            <h2 className="text-2xl font-bold mb-4">{title} Tarea</h2>
            
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
                <input
                  value={newTask.title}
                  onChange={handleChange}
                  type="text"
                  id="title"
                  name="title"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Título de la tarea"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Materia</label>
                <input
                  value={newTask.subject}
                  onChange={handleChange}
                  type="text"
                  id="subject"
                  name="subject"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Materia relacionada con la tarea"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Fecha límite</label>
                <input
                  value={newTask.deadline}
                  onChange={handleChange}
                  type="date"
                  id="deadline"
                  name="deadline"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-4 flex items-center">
                <input
                  checked={newTask.completed}
                  onChange={handleChange}
                  type="checkbox"
                  id="completed"
                  name="completed"
                  className="mr-2"
                />
                <label htmlFor="completed" className="text-sm font-medium text-gray-700">Completado</label>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600">
                  {title}
                </button>
              </div>
            </form>
          </div>
        </div>
      );
};

export default CreateTask;
