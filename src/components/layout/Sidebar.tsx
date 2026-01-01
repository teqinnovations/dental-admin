import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BarChart3, 
  Mail, 
  FileUp, 
  ChevronLeft,
  Stethoscope
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleSidebarCollapsed, setSidebarOpen } from '@/store/slices/uiSlice';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/patients', icon: Users, label: 'Patients' },
  { path: '/appointments', icon: Calendar, label: 'Appointments' },
  { path: '/reports', icon: BarChart3, label: 'Reports' },
  { path: '/gmail', icon: Mail, label: 'Gmail' },
  { path: '/import-export', icon: FileUp, label: 'Import / Export' },
];

export function Sidebar() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { sidebarOpen, sidebarCollapsed } = useAppSelector((state) => state.ui);

  const handleNavClick = () => {
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      dispatch(setSidebarOpen(false));
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-sidebar z-50 transition-all duration-300 flex flex-col",
          sidebarCollapsed ? "w-20" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-3" onClick={handleNavClick}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-primary-foreground" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-sidebar-accent-foreground font-bold text-lg leading-tight">DentaCare</span>
                <span className="text-sidebar-foreground/50 text-xs">Admin Portal</span>
              </div>
            )}
          </Link>
          <button
            onClick={() => dispatch(toggleSidebarCollapsed())}
            className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/70 transition-colors"
          >
            <ChevronLeft className={cn("w-4 h-4 transition-transform", sidebarCollapsed && "rotate-180")} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={cn(
                  "sidebar-item",
                  isActive && "sidebar-item-active"
                )}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-sidebar-primary")} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-sidebar-border">
            <div className="bg-sidebar-accent rounded-xl p-4">
              <p className="text-sidebar-accent-foreground text-sm font-medium mb-1">Need Help?</p>
              <p className="text-sidebar-foreground/60 text-xs mb-3">Contact our support team for assistance.</p>
              <button className="w-full py-2 px-3 bg-sidebar-primary text-sidebar-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                Get Support
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
