import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Home, User, Lock, Mail } from 'lucide-react';
import logo from "../assets/logo.png";
import authBg from "../assets/Auth_bg.webp";

// Firebase Imports
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    role: 'doctor',
    fullName: '',
    username: '',
    password: '',
    registrationId: '',
    age: '',
    gender: 'Male',
    agreeToTerms: false,
    communicationPreference: {}
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'agreeToTerms') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        communicationPreference: { ...prev.communicationPreference, [name]: checked }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    // --- 1. VALIDATION CHECKS (Make Everything Required) ---

    // Check Common Fields
    if (!formData.fullName.trim()) { alert("Please enter your Full Name."); return; }
    if (!formData.username.trim()) { alert("Please enter a Username."); return; }
    if (!formData.password) { alert("Please enter a Password."); return; }

    // Check Doctor Specifics
    if (formData.role === 'doctor') {
      if (!formData.registrationId.trim()) { alert("Doctors must provide a Registration ID / License Number."); return; }
    }

    // Check Patient Specifics
    if (formData.role === 'patient') {
      if (!formData.age) { alert("Please enter your Age."); return; }
    }

    // Check Terms
    if (!formData.agreeToTerms) {
      alert('Please agree to the terms and privacy policy.');
      return;
    }

    setLoading(true);

    // --- 2. FIREBASE LOGIC (Only runs if checks pass) ---
    const emailForFirebase = `${formData.username}@medisense.com`;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailForFirebase,
        formData.password
      );

      const user = userCredential.user;
      console.log("Firebase Auth Success:", user.uid);

      await setDoc(doc(db, "users", user.uid), {
        fullName: formData.fullName,
        username: formData.username,
        role: formData.role,
        gender: formData.gender,
        ...(formData.role === 'doctor'
          ? { registrationId: formData.registrationId }
          : { age: formData.age }
        ),
        createdAt: new Date()
      });

      alert("Account Created Successfully!");
      navigate('/dashboard');

    } catch (error) {
      console.error("Signup Error:", error);
      if (error.code === 'auth/email-already-in-use') {
        alert("This username is already taken. Please choose another.");
      } else if (error.code === 'auth/weak-password') {
        alert("Password should be at least 6 characters.");
      } else {
        alert("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center px-4 sm:px-8 lg:px-24 py-6 sm:py-8 relative overflow-y-auto"
      style={{
        backgroundImage: `url('${authBg}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="w-full max-w-sm sm:max-w-md relative z-10">
        {/* Signup Card */}
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">Create Account</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2 text-center">Join us today</p>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Select Role <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-all" style={{ borderColor: formData.role === 'doctor' ? '#2563eb' : '#d1d5db' }}>
                  <input
                    type="radio" name="role" value="doctor"
                    checked={formData.role === 'doctor'} onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Doctor</span>
                </label>
                <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-emerald-50 transition-all" style={{ borderColor: formData.role === 'patient' ? '#10b981' : '#d1d5db' }}>
                  <input
                    type="radio" name="role" value="patient"
                    checked={formData.role === 'patient'} onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Patient</span>
                </label>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                <input
                  type="text" name="fullName"
                  value={formData.fullName} onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                <input
                  type="text" name="username"
                  value={formData.username} onChange={handleInputChange}
                  placeholder="Choose a username"
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                <input
                  type="password" name="password"
                  value={formData.password} onChange={handleInputChange}
                  placeholder="Create a password"
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Doctor Specific */}
            {formData.role === 'doctor' && (
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Registration ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" name="registrationId"
                  value={formData.registrationId} onChange={handleInputChange}
                  placeholder="Medical license number"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            )}

            {/* Patient Specific */}
            {formData.role === 'patient' && (
              <>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number" name="age"
                    value={formData.age} onChange={handleInputChange}
                    placeholder="Enter your age"
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </>
            )}

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox" name="agreeToTerms"
                checked={formData.agreeToTerms} onChange={handleInputChange}
                className="w-4 h-4 mt-1 rounded border-gray-300"
                required
              />
              <label className="text-xs sm:text-sm text-gray-600">
                I agree to the <span className="font-medium">terms and privacy policy</span>
              </label>
            </div>

            {/* Create Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-medium py-2.5 sm:py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Creating...</span>
                  <span className="sm:hidden">Creating</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 sm:w-5 h-4 sm:h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-2 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2.5 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base"
          >
            Login Here
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