import React, { useEffect } from 'react'
import { useActionState, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import { showSuccess, showError } from '../utils/toast'


const Signup = () => {
    const { loading, setLoading, user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        console.log(user)
    }, [user])
    const baseApi = `${import.meta.env.VITE_API_URL}/api/users/signup`;

    const [state, formAction, isPending] = useActionState(
        async (prevState, formData) => {
            const name = formData.get('name')
            const email = formData.get('email')
            const password = formData.get('password')
            let result;
            // API call ya koi bhi logic
            try {
                setLoading(true)
                const res = await fetch(baseApi, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password }),
                    credentials: 'include'
                })

                result = await res.json();
                if (!result.success) {
                    throw new Error(result.message || 'Sign up failed')
                }

                setUser(result.data);
                const from = location.state?.from?.pathname || '/';
                navigate(from, { replace: true })

            } catch (error) {

                showError(result.message)
            } finally {
                setLoading(false)
            }
        },
        null
    )
    return (

        <div className='w-full h-dvh px-2 bg-gray-900 flex justify-center items-center'>
            <form action={formAction} className='bg-linear-to-t from-[#232F72] via-purple-950 to-gray-950 pb-8 max-w-90 w-full rounded-2xl flex-col flex pt-10 gap-10 px-2 items-center'>

                <div className='md:text-3xl text-xl flex'>
                    <span className='text-white font-dosis'>Study<span className='bg-primary rounded-full p-1 font-dancing '>Hive</span></span>
                </div>

                <div className='flex flex-col gap-5'>

                    <div className='flex flex-col gap-2 text-lg'>
                        <label htmlFor="name" className=' text-white font-dosis'>Name :</label>
                        <input type="text" id='name' placeholder='Enter name' name='name' className='bg-pink text-lg p-1 min-w-62.5 rounded text-gray-900 font-sniglet outline-2 outline-primary/0 focus:outline-primary transition-all  ' required />
                    </div>

                    <div className='flex flex-col gap-2 text-lg'>
                        <label htmlFor="email" className=' text-white font-dosis'>Email :</label>
                        <input type="email" id='email' placeholder='Enter email' name='email' className='bg-pink text-lg p-1 min-w-62.5 rounded text-gray-900 font-sniglet outline-2 outline-primary/0 focus:outline-primary transition-all ' required />
                    </div>

                    <div className='flex flex-col gap-2 text-lg'>
                        <label htmlFor="password" className=' text-white font-dosis'>Password :</label>
                        <input type="password" id='password' placeholder='Enter password' name='password' className='bg-pink text-lg p-1 min-w-62.5 rounded text-gray-900 font-sniglet outline-2 outline-primary/0 focus:outline-primary transition-all ' required />
                    </div>

                </div>
                <div className='flex flex-col  w-full max-w-60 items-center'>
                    <p className='font-dosis pb-3 text-white'>Already have an account ? &nbsp; <a href="/login" className='text-blue-300 '>Login</a> </p>
                    <button type='submit' className='font-sniglet bg-[#030714] text-white py-2 px-10 rounded-xl border-2 border-[#030714] hover:bg-transparent hover:border-white transition-colors'>Sign up</button>

                </div>

            </form>

        </div>
    )
}

export default Signup
