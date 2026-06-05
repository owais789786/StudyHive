import { useState, useEffect, useRef, useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { showSuccess, showError } from '../utils/toast';

const Navbar = ({ activeSection, navList = [] }) => {

  const { user, setUser, setLoading } = useContext(UserContext);
  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/logout`, {
        method: 'get',
        credentials: 'include'
      }
      )
      const result = await res.json();
     
      showSuccess(result.message);
      setUser(null);
      
showSuccess
      navigate('/');
      setLoading(false);

    } catch (error) {
      showError(result.message);
    }

  }

  const capitalizeName = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
    return words[0].charAt(0).toUpperCase();
  };

  const [showNavbar, setShowNavbar] = useState(true);

  const lastScrollY = useRef(0)

  const [isOpen, setIsOpen] = useState(false);

  const handleHamberger = () => {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current + 0.1) {

        setShowNavbar(false);
      } else if (currentScrollY < lastScrollY.current - 0.1) {

        setShowNavbar(true);
      }

      lastScrollY.current = currentScrollY;
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll)
  }, []);



  const navigate = useNavigate()

  return (
    <>
      <nav className={`w-full flex  justify-center md:pt-4 md:px-4 fixed  z-40 transition-all duration-500 ${showNavbar ? 'translate-y-0' : '-translate-y-full'} `} >
        <div className=' h-20 w-300 shadow-white/40 shadow-lg  bg-gray-900 md:rounded-full flex justify-between items-center sm:p-4 p-2'>

          <div className='md:text-3xl text-xl flex'>
            <span className='text-white font-dosis'>Study<span className='bg-primary rounded-full p-1 font-dancing '>Hive</span></span>
          </div>

          <ul className=' sm:flex gap-4 text-lg hidden '>
            {navList.map(i => (
              <li key={i.item} ><a href={`#${i.id}`} className={` hover:text-white font-sniglet ${activeSection == i.id ? 'text-primary' : 'text-grey2'} `}>{i.item}</a></li>
            ))}
          </ul>

          <div className='flex gap-2 sm:text-lg text-white font-sniglet text-sm  '>
            {!user ? (
              <>
                <button className='border-white/30 border transition-colors py-1 px-2 rounded-xl hover:bg-primary cursor-pointer' onClick={() => navigate('/login')}>Login</button>
                <button className='border-white/30 border transition-colors py-1 px-2 rounded-xl bg-primary hover:border hover:bg-transparent cursor-pointer' onClick={() => navigate('/signup')}>Sign Up</button>

              </>
            ) : (
              /* BONUS: Agar user logged in hai, to uska naam ya avatar dikha sakte hain */
              <span className='text-pink font-dosis relative flex justify-center  bg-[#8C30E5] px-3 py-1 rounded-full cursor-pointer group'>
                {capitalizeName(user.name) || 'User'}
                <div className='absolute cursor-auto right-0 z-100 group-hover:opacity-100 group-hover:pointer-events-auto opacity-0 pointer-events-none transition-opacity bg-pink rounded-xl top-full min-w-3xs h-52 p-2 flex flex-col items-center'>
                  <span className=' flex h-14 border text-[#02A0EB] text-xl justify-center items-center  border-[#101828] rounded-full w-full bg-[#101828] cursor-default '> {`${user.name} `}</span>
                  <button className=' border-2 border-transparent hover:text-[#02A0EB] font-semibold mt-1 transition-colors py-1 px-3 rounded-xl bg-[#101828] hover:border-secondary hover:bg-transparent cursor-pointer' onClick={handleLogout}>Logout</button>

                </div>
              </span>
            )}

            <button className='flex sm:hidden cursor-pointer items-center p-1' onClick={handleHamberger}  ><i className="fa-solid fa-bars"></i></button>

          </div>

        </div>

        <div className={`top-20 md:top-24 bg-gray-900 flex transition-all duration-500 overflow-hidden left-0 ${isOpen ? 'max-h-50' : 'max-h-0'} sm:hidden w-full justify-center items-center absolute bg-gray-900 shadow-xl shadow-white/20 `} >
          <ul className=' gap-4 text-sm w-full '>
            {navList.map(i => (
              <li key={i.item} className='w-full border-b border-white/20 ' ><a href={`#${i.id}`} className={` hover:text-white font-sniglet w-full flex justify-center py-2  ${activeSection == i.id ? 'text-primary' : 'text-grey2'}`}>{i.item}</a></li>
            ))}
          </ul>

        </div>

      </nav>
    </>
  )
}

export default Navbar
