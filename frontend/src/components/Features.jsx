import React from 'react'

const Features = () => {
    const cardList = [
        { icon: 'fa-regular fa-message', title: 'Real-time Chat', desc: 'Study groups & collaboration' },
        { icon: 'fa-solid fa-brain', title: 'AI Assistance', desc: 'Smart answers instantly' },
        { icon: 'fa-solid fa-users', title: 'Group Study', desc: 'Learn together, grow faster' },
        { icon: 'fa-solid fa-book', title: 'AI Notes', desc: 'Auto summaries & MCQs' },
        { icon: 'fa-solid fa-list', title: 'Smart To-Do', desc: 'AI task planning' },
        {icon: 'fa-brands fa-readme', title: 'LMS(Coming)', desc: 'Courses & grades'}
    ]
    return (
        <div id='features' className='min-h-100vh w-full pb-10 pt-30 flex cursor-default justify-center flex-col bg-linear-to-t from-[#232F72] via-purple-950 to-gray-950 items-center '>

            <p className='bg-pink text-sm mt-3 sm:mt-0 md:text-lg font-bold font-dosis px-2 py-1 rounded-full  text-primary'>AI-Powered Learning Platform</p>
            <p className='pt-4 sm:pt-6 text-3xl md:text-5xl mt-4 text-white text-center font-sniglet'>Study Smarter, <br /> Together </p>
            <p className='text-sm sm:text-md  text-center mt-3 text-grey2'>Real-time collaboration + Ai assistance <br /> for university students</p>

            <div className='cards max-w-300 w-full min-h-20 py-7 px-2 gap-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
                {cardList.map(card => (
                    <div key={card.title} className='  border-cyan-500/30 shadow-lg shadow-white/20 hover:shadow-xl cursor-default transition-all duration-500  flex-col flex items-center px-2 py-5 rounded-xl bg-gray-900'>
                        <i className={`${card.icon} text-primary text-2xl`}></i>
                        <p className='text-white text-lg font-dosis font-bold pt-4'>{card.title}</p>
                        <p className='text-sm text-grey2'>{card.desc}</p>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Features
