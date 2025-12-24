import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { LogIn, User, Lock, Eye, EyeOff, Home } from 'lucide-react';
import logo from "../assets/logo.png";
import authBg from "../assets/Auth_bg.webp";

// Firebase Imports
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; 

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const emailForFirebase = `${username}@medisense.com`;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, emailForFirebase, password);
            const user = userCredential.user;

            console.log("Logged in User ID:", user.uid);

            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                const userRole = userData.role;

                alert(`Login Successful! Welcome, ${userData.fullName}`);

                navigate('/dashboard'); 
            } else {
                alert("Error: User data not found in database!");
            }

        } catch (error) {
            console.error("Login Error:", error);
            alert("Invalid Username or Password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="w-full min-h-screen flex items-center justify-center px-4 sm:px-8 lg:px-24 py-6 sm:py-8 relative"
            style={{
                backgroundImage: `url('${authBg}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="w-full max-w-sm sm:max-w-md relative z-10">
                    {/* Login Card */}
                    <div className="bg-white/95 backdrop-blur-md rounded-xl border border-gray-200 shadow-2xl p-6 sm:p-8 space-y-6">
                        {/* Logo/Header Inside Card */}
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                                <img src={logo} alt="MediSense Logo" className="h-14 sm:h-16 w-auto" />
                                <button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className="flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 text-xs sm:text-sm font-medium whitespace-nowrap"
                                    title="Back to Home"
                                >
                                    <Home className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                                    <span className="hidden sm:inline">Home</span>
                                    <span className="sm:hidden">H</span>
                                </button>
                            </div>
                            <div className='justify-center items-center flex flex-col'>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">Welcome Back</h1>
                                <p className="text-sm sm:text-base text-gray-600 mt-2 text-center">Login to continue</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Username */}
                            <div>
                                <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                                    <input 
                                        id="username" 
                                        type="text" 
                                        value={username} 
                                        onChange={(e) => setUsername(e.target.value)} 
                                        placeholder="Enter your username" 
                                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required 
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                                    <input 
                                        id="password" 
                                        type={showPassword ? "text" : "password"} 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        placeholder="Enter your password" 
                                        className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required 
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 sm:w-5 h-4 sm:h-5" /> : <Eye className="w-4 sm:w-5 h-4 sm:h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember & Forgot */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 text-xs sm:text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                                    <span className="text-gray-600">Remember me</span>
                                </label>
                                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Forgot password?
                                </a>
                            </div>

                            {/* Login Button */}
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-medium py-2.5 sm:py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span className="hidden sm:inline">Logging in...</span>
                                        <span className="sm:hidden">Login...</span>
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-4 sm:w-5 h-4 sm:h-5" />
                                        Login
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">New to MediSense?</span>
                            </div>
                        </div>

                        {/* Sign Up Link */}
                        <button 
                            type="button" 
                            onClick={() => navigate('/signup')}
                            className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 rounded-lg transition-all duration-200"
                        >
                            Create an Account
                        </button>
                    </div>

                    {/* Footer Text */}
                    <p className="text-center text-gray-300 text-sm mt-6">
                        This is an early-stage prototype. For questions, please visit our <a href="/contact" className="text-blue-300 hover:text-blue-200 font-medium">Contact</a> page.
                    </p>
                </div>
            </div>

    );
}