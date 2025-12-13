import { Outlet } from "react-router";
const HomeLayout = () => {
    return ( 
        <section className="max-w-6xl mx-auto mb-8">
            <Outlet />
        </section>
     );
}
 
export default HomeLayout;