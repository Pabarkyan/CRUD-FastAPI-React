import { Task } from '../types/types.task'
import { useTasks } from '../hooks/useTask'
import { PopUpContext } from '../context/popup'
import { useContext } from 'react'

interface Props {
    task: Task
}

const TaskComponent: React.FC<Props> = ({ task }) => {
    const { deleteTask } = useTasks()
    const { setOpenUpdate, setData } = useContext(PopUpContext)

    const handleUpdate = () => {
        setData(task)
        setOpenUpdate(true)
    }

    const completed = task.completed ? 'Completada' : 'Pendiente' 


  return (
        <tr className='hover:bg-gray-100'>
            <td className='px-4 py-2 text-sm text-gray-900'>{task.id}</td>
            <td className='px-4 py-2 text-sm text-gray-900'>{task.title}</td>
            <td className='px-4 py-2 text-sm text-gray-900'>{task.subject}</td>
            <td className='px-4 py-2 text-sm text-gray-900'>{task.deadline}</td>
            <td className='px-4 py-2 text-sm text-gray-900'>{completed}</td>
            <td className='flex gap-2 px-4 py-2 text-sm text-gray-900'>
                <button className='py-2 px-3 bg-yellow-500 rounded-md text-black hover:bg-yellow-400 transition-all'
                    onClick={handleUpdate}
                >
                    Edit
                </button>
                <button className='py-2 px-3 bg-red-500 rounded-md text-white hover:bg-red-400 transition-all'
                    onClick={() => deleteTask(task.id)}
                >
                    Del
                </button>
            </td>
        </tr>
        
    )
}

export default TaskComponent