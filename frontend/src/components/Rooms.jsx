import React from 'react'
import {motion} from 'motion/react'

const RoomCard = () => {
  const room = {
    name: "Owais's Room",
    tags: ["Study", "Coding", "Physics"],
    currentMembers: 8,
    maxMembers: 15,
    isPublic: true,
    isActive: true,
    recentMembers: [{}, {}, {}] // 3 avatars
  };
  const tagColors = [
    { text: '#7eb8f7', border: '#7eb8f7' },   // blue outline
    { text: '#ffffff', border: '#22c55e', bg: '#22c55e' }, // green filled
    { text: '#f59e0b', border: '#f59e0b' },   // amber outline
    { text: '#00F5D4', border: '#00F5D4' },   // cyan outline
    { text: '#9D4EDD', border: '#9D4EDD' },   // purple outline
  ];

  const getTagStyle = (index) => {
    const c = tagColors[index % tagColors.length];
    return {
      color: c.text,
      border: `1.5px solid ${c.border}`,
      backgroundColor: c.bg || 'transparent',
    };
  };
  return (
    <div className='bg-[#110e1f]  border border-violet-500/30 rounded-2xl p-6  hover:border-violet-500/60 transition-colors duration-200 col-span-6 xs:col-span-3 sm:col-span-2 flex flex-col gap-3'>

      {/* Room Name */}
      <h3 className='font-dosis text-[#8b9dc8] text-2xl font-extrabold m-0'>
        {room.name}
      </h3>

      {/* Tags */}
      <div className='flex items-center gap-2 flex-wrap'>
        <span className='font-dosis text-white/40 text-sm'>tags:</span>
        {room.tags?.map((tag, i) => (
          <span
            key={tag}
            className='font-dosis text-sm font-semibold px-4 py-1 rounded-full'
            style={getTagStyle(i)}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Stats Row */}
      <div className='flex items-center gap-4 flex-wrap'>
        <span className='font-dosis text-white/50 text-sm flex items-center gap-1.5'>
          <i className="fa-solid fa-user"></i>
          {room.currentMembers} / {room.maxMembers} members
        </span>
        <span className='font-dosis text-green-400 text-sm flex items-center gap-1.5'>
          <i className="fa-solid fa-globe"></i>
          {room.isPublic ? 'Public' : 'Private'}
        </span>
        <span className={`font-dosis text-sm font-bold flex items-center gap-1.5
                                ${room.isActive ? 'text-white' : 'text-white/30'}`}>
          <i className="fa-regular fa-clock"></i>
          {room.isActive ? 'Active' : 'Idle'}
        </span>
      </div>

      {/* Divider */}
      <div className='border-t border-white/10' />

      {/* Footer */}
      <div className='flex items-center justify-between'>

        {/* Avatar Stack */}
        <div className='flex'>
          {room.recentMembers?.slice(0, 3).map((member, i) => (
            <div
              key={i}
              className='w-9 h-9 rounded-full bg-[#1e1535] border-2 border-[#110e1f]
                                       flex items-center justify-center text-white/40 -ml-2.5 first:ml-0'
            >
              <i className='fa-solid fa-user'></i>
            </div>
          ))}
        </div>

        {/* Join Button */}
        <button className='font-sniglet  text-sm text-white bg-violet-600 
                                    hover:bg-violet-700 px-6 py-2 rounded-full transition-colors'>
          JOIN ROOM
        </button>

      </div>
    </div>
  );
};

const Rooms = () => {
  return (
    <motion.div
     initial= {{
      opacity: 0
    }}
    transition={{
      type: 'tween',
      duration: 0.2
    }}
    animate={{
      opacity: 1
    }} 
    exit={{
      opacity:0
    }}
    className='text-pink grid grid-cols-6 gap-2 p-2 overflow-y-scroll custom-scrollbar flex-wrap justify-between items-center'>
<RoomCard />
<RoomCard />
<RoomCard />
<RoomCard />
    </motion.div>
  )
}

export default Rooms