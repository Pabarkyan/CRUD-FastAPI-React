import { ReactNode } from "react"

export interface TaskBase {
    title: string
    deadline: string
    completed: boolean
}

export interface Task extends TaskBase { // esto funciona como taskPublic en el backend
    readonly id: string
    subject: string
}

export interface TaskCreate extends TaskBase {
    subject: string
}

// export interface TaskPublic extends TaskBase {
//     readonly id: string
//     subject: string
// }

export interface TaskUpdate extends Partial<TaskBase> {
    subject?: string;
}

export type Actions = 
    | { type: 'fetch', payload: Task[]}
    | { type: 'create', payload: Task}
    | { type: 'update', payload: {id:string, task: TaskUpdate}}
    | { type: 'delete', payload: {id: string} }


export interface TaskContextProviderProps {
    children: ReactNode
}

export interface TaskContextProps {
    tasks: Task[]
    createTask: (task: TaskCreate) => void,
    updateTask: (task: Task) => void, // recibe un task y lgo separa el contenido del id
    deleteTask: (id: string) => void
}

export interface PopUpContextType {
    openCreate: boolean,
    setOpenCreate: React.Dispatch<React.SetStateAction<boolean>>,
    openUpdate: boolean,
    setOpenUpdate: React.Dispatch<React.SetStateAction<boolean>>,
    data: Task, // aunque no usemos el id 
    setData: React.Dispatch<React.SetStateAction<Task>>
}

export interface PopUpProviderProps {
    children: ReactNode
}