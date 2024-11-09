import { Task, TaskCreate, TaskUpdate } from "../types/types.task";
import api from "./api";


// Función para crear una tarea
export const createTaskAPI = async (task: TaskCreate): Promise<Task | undefined> => {
    try {
        const response = await api.post<Task>("/task/", task);
        return response.data;
    } catch (error) {
        console.error("Error creating task:", error);
    }
};

// Función para obtener todas las tareas
export const readTasksAPI = async (): Promise<Task[]> => {
    try {
        const response = await api.get<Task[]>("/task/");
        return response.data;
    } catch (error) {
        console.error("Error reading tasks:", error);
        return [];
    }
};

// Función para obtener una tarea por ID
export const readTaskAPI = async (id: number): Promise<Task | undefined> => {
    try {
        const response = await api.get<Task>(`/task/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error reading task with id ${id}:`, error);
    }
};

// Función para eliminar una tarea por ID
export const deleteTaskAPI = async (id: string): Promise<string | undefined> => {
    try {
        const response = await api.delete<{ Response: string }>(`/task/${id}`);
        return response.data.Response;
    } catch (error) {
        console.error(`Error deleting task with id ${id}:`, error);
    }
};

// Función para actualizar una tarea por ID
export const updateTaskAPI = async (id: string, taskData: TaskUpdate): Promise<Task | undefined> => {
    // taskUpdate no tiene id
    
    try {
        const response = await api.patch<Task>(`/task/${id}`, taskData); // <Task> es lo que recibe de la solicitud
        return response.data;
    } catch (error) {
        console.error(`Error updating task with id ${id}:`, error);
    }
};


export default api