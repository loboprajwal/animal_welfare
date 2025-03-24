import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu, Bell, ChevronDown } from "lucide-react";

const Header = () => {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  fill="currentColor"
                >
                  <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z" />
                </svg>
                <span className="font-bold text-xl text-primary">AnimalSOS</span>
              </div>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8" aria-label="Main Navigation">
              <Link href="/">
                <a className={`${location === "/" ? "border-primary text-neutral-dark" : "border-transparent text-neutral-medium hover:border-gray-300 hover:text-gray-700"} border-b-2 px-1 pt-1 text-sm font-medium`}>
                  Home
                </a>
              </Link>
              <Link href="/report">
                <a className={`${location === "/report" ? "border-primary text-neutral-dark" : "border-transparent text-neutral-medium hover:border-gray-300 hover:text-gray-700"} border-b-2 px-1 pt-1 text-sm font-medium`}>
                  Report Animal
                </a>
              </Link>
              <Link href="/veterinarians">
                <a className={`${location === "/veterinarians" ? "border-primary text-neutral-dark" : "border-transparent text-neutral-medium hover:border-gray-300 hover:text-gray-700"} border-b-2 px-1 pt-1 text-sm font-medium`}>
                  Find Vets
                </a>
              </Link>
              <Link href="/adoption">
                <a className={`${location === "/adoption" ? "border-primary text-neutral-dark" : "border-transparent text-neutral-medium hover:border-gray-300 hover:text-gray-700"} border-b-2 px-1 pt-1 text-sm font-medium`}>
                  Adopt
                </a>
              </Link>
              <Link href="/donate">
                <a className={`${location === "/donate" ? "border-primary text-neutral-dark" : "border-transparent text-neutral-medium hover:border-gray-300 hover:text-gray-700"} border-b-2 px-1 pt-1 text-sm font-medium`}>
                  Donate
                </a>
              </Link>
              <Link href="/community">
                <a className={`${location === "/community" ? "border-primary text-neutral-dark" : "border-transparent text-neutral-medium hover:border-gray-300 hover:text-gray-700"} border-b-2 px-1 pt-1 text-sm font-medium`}>
                  Community
                </a>
              </Link>
            </nav>
          </div>

          {user ? (
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-neutral-dark">
                <Bell className="h-5 w-5" />
              </Button>

              <div className="ml-3 relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                        <AvatarFallback>{user.fullName ? getInitials(user.fullName) : 'U'}</AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <a className="cursor-pointer w-full">Your Profile</a>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/reports">
                        <a className="cursor-pointer w-full">Your Reports</a>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <a className="cursor-pointer w-full">Admin Dashboard</a>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ) : (
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link href="/auth">
                <Button variant="ghost" className="text-primary">Login</Button>
              </Link>
              <Link href="/auth">
                <Button variant="default" className="ml-2">Sign Up</Button>
              </Link>
            </div>
          )}

          <div className="-mr-2 flex items-center sm:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? '' : 'hidden'} sm:hidden`} id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1">
          <Link href="/">
            <a className={`${location === "/" ? "bg-gray-50 border-primary text-primary" : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
              Home
            </a>
          </Link>
          <Link href="/report">
            <a className={`${location === "/report" ? "bg-gray-50 border-primary text-primary" : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
              Report Animal
            </a>
          </Link>
          <Link href="/veterinarians">
            <a className={`${location === "/veterinarians" ? "bg-gray-50 border-primary text-primary" : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
              Find Vets
            </a>
          </Link>
          <Link href="/adoption">
            <a className={`${location === "/adoption" ? "bg-gray-50 border-primary text-primary" : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
              Adopt
            </a>
          </Link>
          <Link href="/donate">
            <a className={`${location === "/donate" ? "bg-gray-50 border-primary text-primary" : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
              Donate
            </a>
          </Link>
          <Link href="/community">
            <a className={`${location === "/community" ? "bg-gray-50 border-primary text-primary" : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
              Community
            </a>
          </Link>
        </div>

        {user ? (
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                  <AvatarFallback>{user.fullName ? getInitials(user.fullName) : 'U'}</AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user.fullName}</div>
                <div className="text-sm font-medium text-gray-500">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link href="/profile">
                <a className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                  Your Profile
                </a>
              </Link>
              <Link href="/reports">
                <a className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                  Your Reports
                </a>
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin">
                  <a className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                    Admin Dashboard
                  </a>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex flex-col space-y-2 px-4">
              <Link href="/auth">
                <Button variant="outline" className="w-full justify-center">Login</Button>
              </Link>
              <Link href="/auth">
                <Button variant="default" className="w-full justify-center">Sign Up</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
