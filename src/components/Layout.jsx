import { useState } from "react";
import { Outlet } from "react-router-dom";
import logo from "../assets/logo.png"
import { Menu, X } from "lucide-react";

function Layout() {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" },
        { label: "About", href: "/about" },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    return (
        <>
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-24">
                    <div className="flex items-center justify-between py-3">
                        {/* Logo */}
                        <a href="/" className="flex items-center gap-2 group">
                            <img
                                src={logo}
                                alt="Smart Healthcare logo"
                                className="h-10 w-auto transition-transform group-hover:scale-105"
                            />
                        </a>

                        {/* Desktop Navigation & Buttons */}
                        <div className="hidden md:flex items-center gap-4">
                            {/* Navigation */}
                            <nav className="flex items-center gap-2" role="navigation">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className="px-4 py-2 text-gray-700 text-sm font-semibold tracking-wide rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-all"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </nav>

                            {/* Buttons */}
                            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                <a
                                    href="/contact"
                                    className="px-5 py-2 text-gray-700 font-semibold border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300 text-sm"
                                >
                                    Contact
                                </a>
                                <a
                                    href="/Login"
                                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 text-sm"
                                >
                                    Login
                            </a>
                            </div>
                            </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
                            onClick={toggleMobileMenu}
                            aria-label="Toggle mobile menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isMobileMenuOpen && (
                        <nav className="md:hidden pb-4 border-t border-gray-100">
                            <div className="flex flex-col gap-3 pt-4">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className="px-4 py-2 text-gray-600 text-sm font-light rounded-lg hover:bg-blue-50 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                                <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                                    <a
                                        href="/contact"
                                        className="px-4 py-2.5 text-center text-gray-700 font-semibold border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Contact
                                    </a>
                                    <a
                                        href="/Login"
                                        className="px-4 py-2.5 text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Login
                                    </a>
                                </div>
                            </div>
                        </nav>
                    )}
                </div>
            </header>

            {/* Dynamic Page Content */}
            <main>
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-24">
                    <div className="py-8">
                        <div className="flex md:flex-row flex-col justify-between items-center gap-8">
                            {/* Copyright */}
                            <p className="text-sm">© {new Date().getFullYear()} Medisense. All rights reserved.</p>

                            {/* Links */}
                            <nav className="flex items-center gap-6">
                                <a href="/features" className="text-gray-400 text-sm hover:text-blue-400 transition-colors">Features</a>
                                <a href="/pricing" className="text-gray-400 text-sm hover:text-blue-400 transition-colors">Pricing</a>
                                <a href="/about" className="text-gray-400 text-sm hover:text-blue-400 transition-colors">About</a>
                                <a href="/privacy" className="text-gray-400 text-sm hover:text-blue-400 transition-colors">Privacy</a>
                                <a href="/terms" className="text-gray-400 text-sm hover:text-blue-400 transition-colors">Terms</a>
                            </nav>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Layout;
