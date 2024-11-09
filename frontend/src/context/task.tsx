import { createContext, useEffect } from 'react';
import { useReducer } from "react";
import { intitialState, taskReducer } from "../reducer/task";
import { Task, TaskCreate, TaskContextProps, TaskContextProviderProps, TaskUpdate } from "../types/types.task";
import { initialTasks } from '../constants';
import { createTaskAPI, deleteTaskAPI, readTasksAPI, updateTaskAPI } from '../service/taskAPI';

// Creamos el contexto y lo tipamos SIEMPRE
export const TaskContext = createContext<TaskContextProps>({ // esto es el estado inicial
    tasks: initialTasks,
    createTask: () => {},
    updateTask: () => {},
    deleteTask: () => {}
})

// creamos la funcion que hace el dispatch, no exportamos pq vamos a usar un contexto
function useTaskReducer() {
    const [state, dispatch] = useReducer(taskReducer, intitialState)

    // useEffect(() => {
    //     localStorage.setItem('tasks', JSON.stringify(state));
    //   }, [state]);

    useEffect(() => {
        const fetchInitialTasks = async () => {
            const tasks = await readTasksAPI()
            dispatch({ type: "fetch", payload: tasks })
        }

        fetchInitialTasks()
    }, [])

    console.log(state)

    // el parametro de esta funcion es el resultado del formulario (4 campos)
    const createTask = async (task: TaskCreate) => {
        const newTask = await createTaskAPI(task) // pero newTask es de tipo task ya que en el backend tambien devuelve el id

        if (newTask) {
            dispatch(
                { type: 'create', payload: newTask }
            )
        }
    }

    const updateTask = async (task: Task) => { // recibe un task
        const updateTask: TaskUpdate = {
            title: task.title,
            completed: task.completed,
            deadline: task.deadline,
            subject: task.subject
        }
        const id = task.id

        const updatedTask = await updateTaskAPI(id, updateTask)

        if (updatedTask) {
            dispatch({ type: "update", payload: { id: id, task:updateTask } });
        }
    }

    const deleteTask = async (id: string) => {
        const deleteTask = await deleteTaskAPI(id)

        if (deleteTask) {
            dispatch({ type: 'delete', payload: { id } })
        }
        
    }

    return { state, createTask, updateTask, deleteTask }
}

// obtenemos las funciones de la funcion del dispatch, tipamos la children siempre
export const TaskProvider = ({ children }: TaskContextProviderProps) => { // Binding element 'children' implicitly has an 'any' type
    const { state, createTask, updateTask, deleteTask } = useTaskReducer();

    return (
        <TaskContext.Provider value={{ 
            tasks: state, // el nombre de tasks es bastante mas sugerente pero podriamos haber dejado state, pero debe coincidir con el tipado
            createTask, 
            updateTask, 
            deleteTask, 
        }}
        >
            {children}
        </TaskContext.Provider>
    );
};
