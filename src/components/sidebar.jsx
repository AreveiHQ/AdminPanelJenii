
import {  ChevronLast, ChevronFirst } from "lucide-react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useContext, createContext, useState, useEffect } from "react"

const SidebarContext = createContext()

export default function Sidebar({expanded ,children }) {
  
 
  return (
    <aside className="h-screen sticky top-0">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center ">
          <Image
           width={400}
           height={150}
            src="/jenii-logo.png"
            className={`overflow-hidden transition-all mx-auto ${
              expanded ? "w-32" : "w-0"
            }`}
            alt=""
          />
          {/* <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button> */}
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        {/* {data && <div className="border-t flex p-3">
          <div
            className="w-10 h-10 rounded-md bg-[rgba(196,30,86,1)] text-white  font-extrabold flex justify-center items-center text-xl"

          >{data.user?.username.charAt(0)}</div>
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <p><span className="font-semibold py-1.5">{data.user?.username}</span> <span className=" bg-[#C41E5633] capitalize text-xs px-2 py-1 rounded-md text-[rgba(196,30,86,1)] mb-2">{data.user?.role}</span></p>
              <span className="text-xs text-gray-600">{data.user?.email}</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>} */}
      </nav>
    </aside>
  )
}

export function SidebarItem({ icon, text, alert, path}) {
  const { expanded } = useContext(SidebarContext)
 const router =  useRouter();
 const pathname =  usePathname();
  
  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          pathname === path
            ? "bg-[rgba(196,30,86,0.2)] text-[rgba(196,30,86,1)] "
            : "hover:bg-[rgba(196,30,86,0.2)] text-gray-600"
        }
    `}
    onClick={()=>router.push(path)}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-indigo-100 text-indigo-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </li>
  )
}


