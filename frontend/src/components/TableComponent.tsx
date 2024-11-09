import { useContext } from 'react'
import { useTasks } from '../hooks/useTask'
import TaskComponent from './TaskComponent'
import { PopUpContext } from '../context/popup'
import CreateTask from './CreateTask'

const TableComponent = () => {
    const { tasks } = useTasks()
    const { openUpdate, data } = useContext(PopUpContext)

    

    return (
    <div className='overflow-x-auto'>
        <table className='min-w-full table-auto'>
            <thead className='bg-gray-100'>
                <tr>
                    <th className='px-4 py-2 text-left text-sm font-medium text-gray-700'>ID</th>
                    <th className='px-4 py-2 text-left text-sm font-medium text-gray-700'>Title</th>
                    <th className='px-4 py-2 text-left text-sm font-medium text-gray-700'>Subject</th>
                    <th className='px-4 py-2 text-left text-sm font-medium text-gray-700'>deadline</th>
                    <th className='px-4 py-2 text-left text-sm font-medium text-gray-700'>completed</th>
                    <th className='px-4 py-2 text-left text-sm font-medium text-gray-700'>Actions</th>
                </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
                {tasks.map((task) => (
                    <TaskComponent 
                        task={task}
                        key={task.id}
                    />
                ))}
            </tbody>
        </table>
        {
            openUpdate && <CreateTask task={data} />
        }
    </div>
  )
}

export default TableComponent