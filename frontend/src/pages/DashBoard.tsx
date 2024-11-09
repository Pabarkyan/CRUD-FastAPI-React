import { useContext } from "react"
import TableComponent from "../components/TableComponent"
import { PopUpContext } from "../context/popup"
import CreateTask from "../components/CreateTask"
import { useAuth } from "../hooks/useAuth"

function DashBoard() {
  const { openCreate, setOpenCreate } = useContext(PopUpContext)
  const { logout } = useAuth()

  return (
      <main className="max-w-7xl mx-auto w-full min-h-screen flex justify-center items-center flex-col gap-12">
        <h1 className="text-4xl font-bold text-blue-950">
          CRUD Database
        </h1>
        {/* <TestingBackend /> */}
        <div className="flex flex-col gap-6">
          <TableComponent />
          <div className="flex gap-4">
            <button className="p-2 bg-blue-500 rounded-md text-white hover:bg-blue-400 transition-all"
              onClick={() => logout()}
            >
              Log out
            </button>
            <button className="p-2 bg-green-500 rounded-md text-white hover:bg-green-400 transition-all"
              onClick={() => setOpenCreate(true)}
            >
              Add task
            </button>
          </div>
        </div>
        {
          openCreate && <CreateTask />
        }
      </main>
  )
}

export default DashBoard
