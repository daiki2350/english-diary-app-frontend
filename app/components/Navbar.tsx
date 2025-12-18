import { NavLink } from "react-router";
import { FaLaptopCode, FaTimes, FaBars } from "react-icons/fa";
import { useState } from "react";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const base = 'transition hover:text-gray-400'
    const active = 'text-gray-200 font-semibold'
    return ( 
        <nav className="bg-orange-500 border-b border-orange-400 shadow-md sticky top-0 z-50 mt-0 mb-2">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                <NavLink to='/' className='flex item-center gap-2 text-lg font-bold text-blue-300'>
                    <FaLaptopCode className='text-yellow-400 text-xl pt-2' />
                    <span className='text-white'>Diary App</span>
                </NavLink>
            {/*Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    <div className="space-x-4 text-sm text-gray-300">
                        <NavLink to='/' className={({isActive}) => isActive ? active : base}>ホーム</NavLink>
                        <NavLink to='/prevdiaries' className={({isActive}) => isActive ? active : base}>過去の日記</NavLink>
                    </div>
                </div>

                <div className="md:hidden flex items-center gap-4">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-xl" title='Menu'>
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {
                menuOpen && (
                    <div className="bg-orange-400 border-t border-orange-300 text-white px-6 py-4 space-y-2 space-x-4 text-center">
                        <NavLink to='/' className={({isActive}) => isActive ? active : base} onClick={() => setMenuOpen(false)}>Home</NavLink>
                        <NavLink to='/prevdiaries' className={({isActive}) => isActive ? active : base} onClick={() => setMenuOpen(false)}>過去の日記</NavLink>
                    </div>
                )
            }

        </nav>
     );
}
 
export default Navbar;