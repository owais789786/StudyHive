import { useState } from 'react'


const SoloChat = () => {
    const name = [
        { n: 'Ali', lastMessage: 'I am A boy and I am a very good boy', lastOnline:'6:26' },
        { n: 'Owais', lastMessage: 'I am A boy and I am a very good boy', lastOnline:'6:26' },
        { n: 'Zeeshan', lastMessage: 'I am A boy and I am a very good boy', lastOnline:'6:26' },
        { n: 'Hamza', lastMessage: 'I am A boy and I am a very good boy', lastOnline:'6:26' }
    ];
    const [activeFellow, setActiveFellow] = useState(null);
    return (
        <div className='w-full grid lg:grid-cols-8 md:grid-cols-1'>
            <div className='border col-span-2'>

                {
                    name.map(na => (
                        <div className='flex gap-2 p-3 border'>
                            <span className='text-pink w-12 h-12 flex items-center justify-center border-pink/10 border rounded-full'>{na.n[0]}</span>
                            <div>
                                <div className='flex border'><span className='text-pink font-dosis text-xl'>{na.n}</span></div>
                                <p className='text-pink/40 text-sm font-sniglet'>{na.lastMessage.substring(0, 30)}...</p>
                            </div>
                        </div>
                    ))
                }

            </div>
            <div className='border col-span-6'>

            </div>



        </div>
    )
}

export default SoloChat
