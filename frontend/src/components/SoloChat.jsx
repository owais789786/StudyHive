import { useState } from 'react'
import ChatMessage from './ChatMessage';


const SoloChat = () => {
    const name = [
        { n: 'Ali', lastMessage: 'I am A boy and I am a very good boy', lastOnline: '6:26' },
        { n: 'Owais', lastMessage: 'I am A boy and I am a very good boy', lastOnline: '6:26' },
        { n: 'Zeeshan', lastMessage: 'I am A boy and I am a very good boy', lastOnline: '6:26' },
        { n: 'Hamza', lastMessage: 'I am A boy and I am a very good boy', lastOnline: '6:26' }
    ];
    const [activeFellow, setActiveFellow] = useState(null);
    return (
        <div className='w-full grid lg:grid-cols-8 md:grid-cols-1'>
            <div className='border col-span-2 border-r-pink/10'>

                {
                    name.map(na => (
                        <div className='flex gap-2 p-2 border border-b-pink/10'>
                            <span className='text-pink w-12 h-12 flex items-center justify-center border-pink/10 border rounded-full'>{na.n[0]}</span>
                            <div>
                                <div className='flex justify-between text-xs items-center text-primary'><span className='text-pink font-dosis text-lg'>{na.n}</span>
                                    <span>{na.lastOnline}</span>
                                </div>
                                <p className='text-pink/40 text-xs font-sniglet'>{na.lastMessage.substring(0, 30)}...</p>
                            </div>
                        </div>
                    ))
                }

            </div>
            <div className='border col-span-6 overflow-y-scroll custom-scrollbar'>
                <ChatMessage  text={'This is a message'} isSender={true} />
                <ChatMessage senderName={'Owais'} text={'This is a message'} isSender={false} />
                <ChatMessage text={'This is a message Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum id aliquam quis tempore sed similique sapiente odio illo excepturi neque ex totam iste perspiciatis veniam labore, nihil inventore temporibus eos dolores eligendi animi modi mollitia accusantium? Quisquam sapiente dolorum voluptates iusto nihil. Sed ducimus deserunt voluptatum debitis repellendus libero fuga necessitatibus aliquid repudiandae architecto. Sequi tenetur ex dolor qui accusantium fugiat. Dicta vitae eligendi esse odio praesentium necessitatibus minima, quas sit eius commodi, saepe assumenda ab enim dolor reprehenderit! Sed quaerat cupiditate magnam vel, nihil corporis ratione quos, beatae tempora voluptates eos aperiam dolore asperiores rem illum. Vel, explicabo facere?'} isSender={false} />
                <ChatMessage text={'This is a message Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum id aliquam quis tempore sed similique sapiente odio illo excepturi neque ex totam iste perspiciatis veniam labore, nihil inventore temporibus eos dolores eligendi animi modi mollitia accusantium? Quisquam sapiente dolorum voluptates iusto nihil. Sed ducimus deserunt voluptatum debitis repellendus libero fuga necessitatibus aliquid repudiandae architecto. Sequi tenetur ex dolor qui accusantium fugiat. Dicta vitae eligendi esse odio praesentium necessitatibus minima, quas sit eius commodi, saepe assumenda ab enim dolor reprehenderit! Sed quaerat cupiditate magnam vel, nihil corporis ratione quos, beatae tempora voluptates eos aperiam dolore asperiores rem illum. Vel, explicabo facere?'} isSender={true} />
            </div>



        </div>
    )
}

export default SoloChat
