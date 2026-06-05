import React from 'react'
import { useState } from 'react'
import ChatRoom from '../components/ChatRoom';

const Dashboard = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarItems = [

    { name: 'Chatrooms', desc: 'Create rooms or chat live with friends', icon: 'fa-regular fa-message' },

    { name: 'Hivey', desc: 'Your AI learning assistant', icon: 'fa-solid fa-brain' },

    { name: 'Study Groups', desc: 'Make groups to share study material', icon: 'fa-solid fa-users' },

    { name: 'LMS', desc: 'Study at your home by making live meetings', icon: 'fa-brands fa-readme' },

    { name: 'AI Notes', desc: 'Summarize your notes with perfection', icon: 'fa-solid fa-book' },

    { name: 'To-Do', desc: 'Track your progress with making to-dos', icon: 'fa-solid fa-list' }

  ]
  return (
    <div className='w-full min-h-dvh md:pl-14 bg-[#140B2D] relative'>
      <div className={`fixed z-40 transition-all duration-500 bg-[rgb(44,19,82)] w-full sm:w-1/2 h-full top-0 md:w-80 py-2 left-0 ${showSidebar ? 'translate-x-0' : 'md:translate-x-[-83%] -translate-x-full'}`}>

        <div className='flex justify-between px-2 items-center '>
          <div className='md:text-3xl text-xl flex  mt-4 pointer-events-none'>
            <span className='text-white font-dosis'>Study<span className='bg-primary rounded-full p-1 font-dancing '>Hive</span></span>
          </div>

          <button className={`text-pink transition-all duration-500 bg-[#8C30E5] w-10 absolute right-2 top-4  rounded-2xl h-10 cursor-pointer ${showSidebar ? 'rotate-180 ' : 'rotate-0 translate-x-15 md:translate-x-0 '} `} onClick={() => setShowSidebar(!showSidebar)}><i className="fa-solid fa-arrow-right "></i></button>
        </div>
        <p className='text-pink/30 px-2 font-dancing text-xl mt-5 pointer-events-none'>Code it. Break it. Fix it. Ship it.</p>

        <ul className='divide-pink/10 divide-y border-y border-pink/10  mt-8 '>
          {sidebarItems.map(item => (
            <li className='text-primary px-2 transition-colors hover:bg-pink/10 font-sniglet py-2 flex  items-center'>
              <span className='pr-2'>
                <i className={item.icon}></i>
              </span>
              {item.name}
              <span className={`absolute right-5 transition-opacity duration-700 ${showSidebar ? 'opacity-0' : 'opacity-0  md:opacity-100'}`}><i className={item.icon}></i></span>
            </li>
          ))}

        </ul>

      </div>
      <ChatRoom />



    </div>
  )
}

export default Dashboard
