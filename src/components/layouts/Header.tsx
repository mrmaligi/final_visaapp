'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@/types';

interface HeaderProps {
  user?: User | null;
  onSignOut?: () => void;
}

interface NavLink {
  label: string;
  href: string;
}

const publicNavLinks: NavLink[] = [
  { label: 'Visas', href: '/visas' },
  { label: 'Tracker', href: '/tracker' },
  { label: 'News', href: '/news' },
  { label: 'Lawyers', href: '/lawyers' },
];

const userNavLinks: NavLink[] = [
  { label: 'Dashboard', href: '/user/dashboard' },
  { label: 'My Visas', href: '/user/visas' },
  { label: 'Consultations', href: '/user/consultations' },
  { label: 'Documents', href: '/user/documents' },
];

const lawyerNavLinks: NavLink[] = [
  { label: 'Dashboard', href: '/lawyer/dashboard' },
  { label: 'Clients', href: '/lawyer/clients' },
  { label: 'Consultations', href: '/lawyer/consultations' },
  { label: 'Reviews', href: '/lawyer/reviews' },
];

const adminNavLinks: NavLink[] = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Lawyers', href: '/admin/lawyers' },
  { label: 'Visas', href: '/admin/visas' },
];

export default function Header({ user, onSignOut }: HeaderProps): React.ReactElement {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = (): void => {
    setIsMobileMenuOpen(false);
  };

  const toggleUserMenu = (): void => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeUserMenu = (): void => {
    setIsUserMenuOpen(false);
  };

  const getNavLinks = (): NavLink[] => {
    if (!user) return publicNavLinks;
    if (user.role === 'admin') return adminNavLinks;
    if (user.role === 'lawyer') return lawyerNavLinks;
    return userNavLinks;
  };

  const navLinks = getNavLinks();
  const isActive = (href: string): boolean => pathname?.startsWith(href) ?? false;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href={user ? (user.role === 'admin' ? '/admin/dashboard' : user.role === 'lawyer' ? '/lawyer/dashboard' : '/user/dashboard') : '/'} className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-600"
          >
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            VisaHelper
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-blue-600'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons or User Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {user.profile_picture_url ? (
                  <img
                    src={user.profile_picture_url}
                    alt={user.display_name || user.email}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-700">
                      {(user.display_name || user.email)?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium text-slate-700">
                  {user.display_name || user.email}
                </span>
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  <Link
                    href={user.role === 'admin' ? '/admin/settings' : user.role === 'lawyer' ? '/lawyer/pricing' : '/user/dashboard'}
                    onClick={closeUserMenu}
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-gray-50"
                  >
                    {user.role === 'lawyer' ? 'Pricing & Settings' : 'Settings'}
                  </Link>
                  <button
                    onClick={() => {
                      closeUserMenu();
                      onSignOut?.();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="px-5 py-2.5 rounded-full text-sm font-semibold border border-gray-200 text-slate-700 hover:bg-gray-50 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-3">
            {user && (
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                {user.profile_picture_url ? (
                  <img
                    src={user.profile_picture_url}
                    alt={user.display_name || user.email}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-700">
                      {(user.display_name || user.email)?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-slate-900">{user.display_name || user.email}</p>
                  <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                </div>
              </div>
            )}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={`block px-3 py-2 text-base font-medium rounded-lg transition-colors ${
                  isActive(link.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 space-y-2 border-t border-gray-100">
              {user ? (
                <button
                  onClick={() => {
                    closeMobileMenu();
                    onSignOut?.();
                  }}
                  className="block w-full text-center px-5 py-2.5 rounded-full text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-all"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    onClick={closeMobileMenu}
                    className="block w-full text-center px-5 py-2.5 rounded-full text-sm font-semibold border border-gray-200 text-slate-700 hover:bg-gray-50 transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={closeMobileMenu}
                    className="block w-full text-center px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
