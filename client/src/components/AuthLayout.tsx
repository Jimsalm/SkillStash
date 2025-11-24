import { Outlet } from 'react-router-dom';


const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>

    </div>
  );
};

export default AuthLayout;