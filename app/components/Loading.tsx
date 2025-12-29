const LoadComponent = () => {
    return ( 
        <div className="flex min-h-screen items-center justify-center">
            <div className="flex items-center gap-4">
                <p className="text-2xl font-medium">Loading...</p>
                <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-orange-500"></div>
            </div>
        </div>
     );
}
 
export default LoadComponent;