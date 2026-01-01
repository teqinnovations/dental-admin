import { Menu, Bell, Search, User } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { toggleSidebar } from '@/store/slices/uiSlice';
import { useState } from 'react';

export function Header() {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 w-64 lg:w-80">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search patients, appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm flex-1 placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Mobile search */}
        <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
          <Search className="w-5 h-5 text-foreground" />
        </button>

        {/* Notifications */}
        <button className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
        </button>

        {/* User menu */}
        <div className="flex items-center gap-3 pl-2 border-l border-border ml-2">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-foreground">Dr. Sarah Mitchell</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
          <button className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </button>
        </div>
      </div>
    </header>
  );
}
