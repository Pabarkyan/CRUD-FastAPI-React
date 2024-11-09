// import { Task } from "./types"

import { Task } from "./types/types.task";

// export const initialTasksNoStorage: Task[] = [
//     {
//       id: '1',
//       title: 'Sparring',
//       subject: 'Muay thai',
//       completed: false,
//       deadline: "12-3-4556",
//     },
//     {
//       id: '2',
//       title: 'clinch',
//       subject: 'Muay thai',
//       completed: false,
//       deadline: "12-3-4556",
//     },
//     {
//       id: '3',
//       title: 'pads',
//       subject: 'Muay thai',
//       completed: false,
//       deadline: "12-3-4556",
//     },
//     {
//       id: '4',
//       title: 'cardio',
//       subject: 'Muay thai',
//       completed: true,
//       deadline: "12-3-4556",
//     },
//   ];

  
// export const initialTasks = (): Task[] => {
//   const storedUsers = localStorage.getItem('tasks');
//   return storedUsers ? JSON.parse(storedUsers) : initialTasksNoStorage;
// }


export const initialTasks: Task[] = []