"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Store", href: "/store" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Checkout", href: "/checkout" },
    { name: "Sign In", href: "/sign-in" },
  ];

  return (
    <header className="w-full font-sans sticky top-0 z-50 shadow-sm bg-[#FAF7F2]">
      {/* Announcement Bar */}
      <div className="w-full bg-[#3E2A24] py-2 px-4 text-center">
        <p className="text-[10px] md:text-xs font-semibold tracking-widest text-[#FDFBF7] uppercase">
          Free shipping on all orders over $150 | Code: NESTRO10
        </p>
      </div>

      {/* Main Navigation Bar */}
      <nav className="w-full bg-[#FAF7F2] border-b border-[#EFE8DF] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-0.5 group">
                <span className="text-xl md:text-2xl font-bold tracking-[0.2em] text-[#1A1A1A] transition-colors duration-300 group-hover:text-[#8C6239]">
                  NESTRO
                </span>
                <span className="text-xl md:text-2xl font-extrabold text-[#8C6239] animate-pulse">.</span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 ${
                      isActive
                        ? "bg-[#F3ECE4] text-[#8C6239] shadow-sm"
                        : "text-[#5C5C5C] hover:text-[#8C6239] hover:bg-[#F3ECE4]/40"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Right-side Icons */}
            <div className="flex items-center gap-4 md:gap-5">
              
              {/* Search Toggle */}
              <div className="relative flex items-center">
                {searchOpen && (
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="absolute right-8 top-1/2 -translate-y-1/2 w-40 md:w-56 bg-white border border-[#EFE8DF] rounded-full px-3 py-1 text-xs text-[#1A1A1A] placeholder-[#9C9C9C] focus:outline-none focus:border-[#8C6239] transition-all duration-300"
                  />
                )}
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="text-neutral-700 hover:text-[#8C6239] hover:scale-110 active:scale-95 transition-all duration-200 p-1 cursor-pointer"
                  aria-label="Search"
                >
                  <svg className="w-5 h-5 md:w-[22px] md:h-[22px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              {/* Cart Button */}
              <Link href="/cart" className="relative p-1 text-neutral-700 hover:text-[#8C6239] hover:scale-110 active:scale-95 transition-all duration-200" aria-label="Cart">
                <svg className="w-[22px] h-[22px] md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-[#8C6239] text-[#FAF7F2] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#FAF7F2]">
                  3
                </span>
              </Link>

              {/* Profile Button */}
              <Link href="/profile" className="hidden sm:block hover:scale-110 active:scale-95 transition-all duration-200">
                <div className="w-8 h-8 rounded-full border border-[#8C6239] flex items-center justify-center hover:bg-[#F3ECE4] transition-colors duration-300">
                  <svg className="w-4 h-4 text-[#8C6239]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-neutral-700 hover:text-[#8C6239] transition-colors p-1"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-[#EFE8DF]/60 bg-[#FAF7F2] ${
            mobileMenuOpen ? "max-h-72 opacity-100 py-3" : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="px-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#F3ECE4] text-[#8C6239]"
                      : "text-[#5C5C5C] hover:text-[#8C6239] hover:bg-[#F3ECE4]/30"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            {/* Mobile Profile Link */}
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#5C5C5C] hover:text-[#8C6239] hover:bg-[#F3ECE4]/30 border-t border-[#EFE8DF]/40 mt-2 pt-2 sm:hidden"
            >
              <div className="w-6 h-6 rounded-full border border-[#8C6239] flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#8C6239]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span>My Profile</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
