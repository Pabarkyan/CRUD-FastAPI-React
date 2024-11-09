import { createContext, useState } from "react";
import { PopUpContextType, PopUpProviderProps, Task } from "../types/types.task";

export const PopUpContext = createContext<PopUpContextType>({
    openCreate: false,
    setOpenCreate: () => {},
    openUpdate: false,
    setOpenUpdate: () => {},
    data: {
        id: '',
        title: '',
        subject: '',
        deadline: '',
        completed: false,
    },
    setData: () => {},
})

export function PopUpProvider({ children }: PopUpProviderProps) {
    const [openCreate, setOpenCreate] = useState(false)
    const [openUpdate, setOpenUpdate] = useState(false)
    const [data, setData] = useState<Task>({
        id: '',
        title: '',
        subject: '',
        deadline: '',
        completed: false,
    },);
    
    return (
        <PopUpContext.Provider value={{
            openCreate,
            setOpenCreate,
            openUpdate,
            setOpenUpdate,
            data, 
            setData
        }}>
            {children}
        </PopUpContext.Provider>
    )
}

