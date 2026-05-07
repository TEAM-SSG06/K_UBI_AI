import React from 'react';
import { LayoutDashboard, CheckSquare, Search, Activity, Database, GitMerge, Sun, Moon, History, Table as TableIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Sidebar({ currentPage, setCurrentPage, isDark, setIsDark }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'review', label: 'HITL Review Queue', icon: CheckSquare },
    { id: 'registry', label: 'Canonical Registry', icon: TableIcon },
    { id: 'explorer', label: 'Entity Explorer', icon: Search },
    { id: 'merge', label: 'Merge Visualizer', icon: GitMerge },
    { id: 'audit', label: 'Audit Logs', icon: History },
    { id: 'schema', label: 'Schema Viewer', icon: Database },
  ];

  return (
    <div className="w-64 border-r bg-card flex flex-col h-screen p-4">
      <div className="flex items-center gap-2 mb-8 px-2 font-bold text-2xl text-foreground mt-4">
        <Activity className="text-primary w-8 h-8" />
        K-UBI<span className="text-primary">.</span>AI
      </div>
      
      <div className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={currentPage === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start ${currentPage === item.id ? 'font-semibold' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Button>
          );
        })}
      </div>

      <div className="mt-auto border-t pt-4">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => setIsDark(!isDark)}
        >
          {isDark ? <Sun className="w-5 h-5 mr-3" /> : <Moon className="w-5 h-5 mr-3" />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </div>
    </div>
  );
}
