import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="h-screen w-screen bg-dark-900 text-white overflow-hidden relative font-sans flex text-white">
            {/* Sidebar (Visual Only - mimicking reference) */}


            {/* Main Content */}
            <main className="flex-1 relative">
                {children}
            </main>
        </div>
    );
};

export default Layout;
