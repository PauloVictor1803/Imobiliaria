import React from 'react';
import { Bell, LogOut, LogIn, User } from 'lucide-react';

interface TopActionsProps {
  onLogout?: () => void;
  onLoginClick?: () => void;
  session?: any;
}

export const TopActions: React.FC<TopActionsProps> = ({ onLogout, onLoginClick, session }) => {
  const avatarUrl = session?.user?.user_metadata?.avatar_url;
  const initial = session?.user?.email?.charAt(0).toUpperCase() || 'A';

  return (
    <div className="absolute top-4 right-4 z-30 flex gap-3">
      {session ? (
        <>
          <button className="bg-white px-3 py-2.5 rounded-lg shadow-md border border-gray-200 flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <div className="bg-white p-1 rounded-lg shadow-md border border-gray-200 flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-8 h-8 rounded-md object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-8 h-8 rounded-md bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">
                {initial}
              </div>
            )}
          </div>
          <button 
            onClick={onLogout}
            className="bg-white p-2.5 px-3 rounded-lg shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            title="Sair"
          >
            <LogOut className="w-5 h-5 text-gray-600" />
          </button>
        </>
      ) : (
        <button 
          onClick={onLoginClick}
          className="bg-blue-900 text-white px-5 py-2.5 rounded-lg shadow-lg border border-blue-800 flex items-center gap-2 hover:bg-blue-800 hover:shadow-xl transition-all font-semibold"
          title="Login"
        >
          <LogIn className="w-5 h-5" />
          <span>Login</span>
        </button>
      )}
    </div>
  );
};
