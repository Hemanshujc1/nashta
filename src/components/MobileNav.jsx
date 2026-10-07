import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Grid, PlaySquare, User } from 'lucide-react';
import { cn } from '../lib/utils';

export default function MobileNav() {
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Shop', path: '/shop', icon: <ShoppingBag size={20} /> },
    { name: 'Flavours', path: '/flavours', icon: <Grid size={20} /> },
    { name: 'Contact', path: '/contact', icon: <User size={20} /> }, // Using User icon or maybe a Message icon instead
    { name: 'Account', path: '/account', icon: <User size={20} /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg border-t border-text/10 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <ul className="flex items-center justify-around h-16">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <li key={link.name} className="flex-1">
              <Link 
                to={link.path} 
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                  isActive ? "text-primary" : "text-text-muted hover:text-text"
                )}
              >
                {link.icon}
                <span className="text-[10px] font-medium tracking-wide">{link.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
