import { ReactNode } from 'react';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <h1 className="text-3xl">DASHBOARD</h1>
            <main>{children}</main>
        </div>
    );
};

export default DashboardLayout;
