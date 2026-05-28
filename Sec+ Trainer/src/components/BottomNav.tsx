import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Zap, 
  FileEdit, 
  ExternalLink, 
  Settings, 
  Cloud, 
  CloudOff 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { syncState, dueReviewsCount } = useApp();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/objectives', label: 'Objectives', icon: BookOpen },
    { to: '/quiz', label: 'Quiz', icon: Zap },
    { to: '/journal', label: 'Journal', icon: FileEdit },
    { to: '/resources', label: 'Resources', icon: ExternalLink },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar (md and up) */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-800 h-full fixed left-0 top-0 text-slate-300">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-display font-extrabold text-slate-950 text-lg shadow-lg shadow-indigo-500/20">
              S+
            </div>
            <span className="font-display font-bold text-slate-200 tracking-wide">Sec+ Mastery</span>
          </div>
          <div>
            {syncState === 'synced' ? (
              <span title="Cloud Sync Active"><Cloud className="w-4 h-4 text-emerald-500" /></span>
            ) : syncState === 'syncing' ? (
              <span title="Syncing..."><Cloud className="w-4 h-4 text-amber-500 animate-pulse" /></span>
            ) : (
              <span title="Local Only Mode"><CloudOff className="w-4 h-4 text-slate-500" /></span>
            )}
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group font-medium ${
                    isActive
                      ? 'bg-indigo-600 text-slate-950 shadow-lg shadow-indigo-600/20'
                      : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 group-hover:scale-105 transition-transform" />
                  <span>{item.label}</span>
                </div>
                {item.label === 'Quiz' && dueReviewsCount > 0 && (
                  <span className="bg-amber-500 text-slate-950 text-xs px-2 py-0.5 rounded-full font-bold">
                    {dueReviewsCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-800 text-xs text-slate-500 font-medium">
          Exam Version: SY0-701
        </div>
      </aside>

      {/* Mobile Bottom Bar (hidden on md and up) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-t border-slate-800/60 pb-safe-bottom">
        <div className="flex justify-around items-center h-16 px-2 max-w-lg mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all duration-200 relative ${
                    isActive ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="relative">
                      <Icon className={`w-5 h-5 mb-0.5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                      {item.label === 'Quiz' && dueReviewsCount > 0 && (
                        <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                          {dueReviewsCount}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-medium tracking-tight leading-none">{item.label}</span>
                    
                    {/* Active highlight dot */}
                    {isActive && (
                      <span className="absolute bottom-1 w-1 h-1 bg-indigo-400 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
};
export default BottomNav;
