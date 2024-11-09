import { Actions, Task } from "../types/types.task";

export const intitialState: Task[] = []

export function taskReducer(state: Task[], action: Actions): Task[] {
    
    switch (action.type) {
        case "fetch":
            return action.payload

        case 'create': {
            return [...state, action.payload] // el payload ya es un task
        }
        case 'update': {
            const idTask = action.payload.id

            return state.map((task) => (
                task.id === idTask ? { ...task, ...action.payload.task } : task
            ))
        }
        case 'delete': {
            const idDelete = action.payload.id
            const newState = state.filter(task => task.id !== idDelete)
            // localStorage.setItem('users', JSON.stringify(newState))

            return newState
        } 
        default:
            throw new Error('Operación no ejecutada')
    }
}