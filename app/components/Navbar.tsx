import { NavLink } from "react-router";
import { FaLaptopCode } from "react-icons/fa";

const Navbar = () => {
    return ( 
        <nav className="bg-orange-500 border-b border-orange-400 shadow-md sticky top-0 z-50 mt-0 mb-2">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                <NavLink to='/' className='flex item-center gap-2 text-lg font-bold text-blue-300'>
                    <FaLaptopCode className='text-yellow-400 text-xl pt-2' />
                    <span className='text-white'>Diary App</span>
                </NavLink>
            </div>
        </nav>
     );
}
 
export default Navbar;