import { Outlet } from "react-router";
import Navbar from "~/components/Navbar";
const HomeLayout = () => {
    return ( 
        <>
            <Navbar />
            <section className="max-w-6xl mx-auto mb-8">
                <Outlet />
            </section>
        </>
        
     );
}
 
export default HomeLayout;