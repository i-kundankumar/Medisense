import { useState } from "react";
import { Outlet } from "react-router-dom";
import "../Home.css";
import "./Layout.css";
import logo from "../assets/logo.png"

function Layout() {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { label: "Home", href: "/" },
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
            <header className="site-header header-with-bg">
                <div className="container d-flex align-items-center justify-content-between py-3">
                    <a href="/" className="brand d-flex align-items-center gap-2">
                        <img
                            src={logo}
                            alt="Medisense logo"
                            width="120"
                            height="40"
                        />
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="d-none d-md-flex gap-3 align-items-center" role="navigation">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="nav-link"
                            >
                                {link.label}
                            </a>
                        ))}
                        <a
                            href="/contact"
                            className="btn btn-outline-primary btn-sm"
                        >
                            Contact
                        </a>
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="btn btn-primary d-md-none"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle mobile menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <span className="navbar-toggler-icon">☰</span>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="mobile-menu d-md-none">
                        <div className="container py-3">
                            <nav className="d-flex flex-column gap-2">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className="mobile-nav-link"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                                <a
                                    href="/contact"
                                    className="btn btn-outline-primary btn-sm mt-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Contact
                                </a>
                            </nav>
                        </div>
                    </div>
                )}
            </header>

            {/* Dynamic Page Content */}
            <main>
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="site-footer">
                <div className="footer-content">
                    <div className="footer-left">
                        <p className="footer-copyright">© {new Date().getFullYear()} Medisense. All rights reserved.</p>
                    </div>

                    <div className="footer-right">
                        <div className="footer-links">
                            <a href="/privacy" className="footer-link">Privacy Policy</a>
                            <a href="/terms" className="footer-link">Terms of Service</a>
                            <a href="/contact" className="footer-link">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Layout;
