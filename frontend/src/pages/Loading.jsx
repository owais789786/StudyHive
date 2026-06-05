import React from 'react'
import { motion } from 'motion/react'

const Loading = () => {
    return (
        <motion.div className='min-h-dvh w-full bg-linear-to-b from-secondary via-[#3B0466] to-secondary flex items-center justify-center fixed inset-0 z-50'
            initial={{
                opacity: 1
            }}
            exit={{
                opacity: 0
            }}
            transition={{
                duration: 0.5
            }}
        >
            <div >
                <div className="relative">
                    {/* Outer ring */}
                    <motion.div
                        className="w-16 h-16 border-4 border-b-[#ffffff] border-t-[#ffffff] border-l-transparent border-r-transparent rounded-2xl absolute"
                        animate={{
                            rotate: 360,


                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Middle ring */}
                    <motion.div
                        className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full absolute top-2 left-2"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Inner dot */}
                    <motion.div
                        className="w-2 h-2 bg-pink-500 rounded-full absolute top-5.5 left-5.5"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>

            </div>

        </motion.div>
    )
}

export default Loading
