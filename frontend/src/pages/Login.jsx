import React from 'react'
import { useActionState, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { UserContext } from '../context/UserContext';
import { showSuccess, showError } from '../utils/toast';

const Login = () => {
    const baseApi = `${import.meta.env.VITE_API_URL}/api/users/login`;
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser, user } = useContext(UserContext);
    const [state, formAction, isPending] = useActionState(
        async (prevState, formData) => {
            const email = formData.get('email')
            const password = formData.get('password')
            let result;
            
            try {
                const res = await fetch(baseApi, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                    credentials: 'include'
                })
                result = await res.json();
                console.log(result)
                if (!result.success) {
                    throw new Error(result.message || 'Login Failed')
                }
                const from = location.state?.from?.pathname || '/';
                console.log('from:', from);
                showSuccess(result.message);
                setUser(result.data);
                navigate(from, { replace: true });
            } catch (error) {
                const msg = result?.errors?.[0]?.msg || result?.message || 'Login failed'
                showError(msg)
            }
        },
        null
    )
    return (

        <div className='w-full h-dvh bg-gray-900 flex justify-center items-center'>
            <form action={formAction} className='bg-linear-to-t from-[#232F72] via-purple-950 to-gray-950  max-w-90 w-full rounded-2xl flex-col flex pt-10 pb-10 gap-10 px-2 items-center'>

                <div className='md:text-3xl text-xl flex'>
                    <span className='text-white font-dosis'>Study<span className='bg-primary rounded-full p-1 font-dancing '>Hive</span></span>
                </div>

                <div className='flex flex-col gap-5'>

                    <div className='flex flex-col gap-2 text-lg'>
                        <label htmlFor="email" className=' text-white font-dosis'>Email :</label>
                        <input type="email" id='email' name='email' placeholder='Enter email' className='bg-pink text-lg p-1 min-w-62.5 rounded text-gray-900 font-sniglet outline-2 outline-primary/0 focus:outline-primary transition-all ' />
                    </div>

                    <div className='flex flex-col gap-2 text-lg'>
                        <label htmlFor="password" className=' text-white font-dosis'>Password :</label>
                        <input type="password" id='password' name='password' placeholder='Enter password' className='bg-pink text-lg p-1 min-w-62.5 rounded text-gray-900 font-sniglet outline-2 outline-primary/0 focus:outline-primary transition-all ' />
                    </div>

                </div>
                <div className='flex justify-between w-full max-w-60 flex-col items-center '>
                    <p className='font-dosis pb-3 text-white'>Don't have an account ? &nbsp; <a href="/signup" className='text-blue-300 '>Sign up</a> </p>
                    <button type='submit' className='font-sniglet bg-[#030714] text-white py-2 px-10 rounded-xl border-2 border-[#030714] hover:bg-transparent hover:border-white transition-colors'  >login</button>

                </div>

            </form>

        </div>

    )
}

export default Login
