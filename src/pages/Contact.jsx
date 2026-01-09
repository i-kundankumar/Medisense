import { Mail, Phone, Clock, AlertCircle, MessageSquare, Lightbulb, Users } from "lucide-react";

function Contact() {
    const quickLinks = [
        {
            title: "Share Feedback",
            description: "Tell us what you think about our prototype and how we can improve",
            icon: MessageSquare,
            color: "text-blue-600"
        },
        {
            title: "Report a Bug",
            description: "Found an issue? Help us fix it by reporting technical problems",
            icon: AlertCircle,
            color: "text-red-600"
        },
        {
            title: "Feature Request",
            description: "Suggest new features or improvements you'd like to see",
            icon: Lightbulb,
            color: "text-yellow-600"
        },
        {
            title: "Collaborate",
            description: "Interested in contributing to our open-source prototype project",
            icon: Users,
            color: "text-emerald-600"
        }
    ];

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="py-8 bg-gradient-to-br from-blue-50 via-white to-emerald-50 px-8 sm:px-12 lg:px-24">
                <div className="max-w-6xl mx-auto">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                            Get in <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Touch</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl">
                            Have feedback, questions, or want to contribute to our prototype? We'd love to hear from you. This is an early-stage project, and your input helps shape the future.
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick Contact Options */}
            <section className="py-8 px-8 sm:px-12 lg:px-24 bg-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">How Can We Help?</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickLinks.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div key={index} className="p-6 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md">
                                    <Icon className={`w-6 h-6 ${item.color} mb-3`} />
                                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Contact Form and Info */}
            <section className="py-8 px-8 sm:px-12 lg:px-24 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-white p-8 rounded-xl border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Help Us Improve</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    alert("Thanks for your feedback! Your input helps us build better.");
                                }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Your name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        defaultValue="feedback"
                                    >
                                        <option value="feedback">General Feedback</option>
                                        <option value="bug">Report a Bug</option>
                                        <option value="feature">Feature Request</option>
                                        <option value="collaborate">Collaboration</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows="5"
                                        placeholder="Tell us what's on your mind..."
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 rounded-lg transition-all duration-200"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-6">
                            <div className="bg-white p-8 rounded-xl border border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Early-Stage Project</h2>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    We're actively building this prototype and value feedback from potential users, healthcare professionals, and tech enthusiasts.
                                </p>

                                {/* Contact Cards */}
                                <div className="space-y-4">
                                    {/* Email */}
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="flex items-start gap-3">
                                            <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-sm">Email</h3>
                                                <p className="text-gray-600 text-sm">support@medisense.health</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sales */}
                                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                                        <div className="flex items-start gap-3">
                                            <Mail className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-sm">Feedback & Demo</h3>
                                                <p className="text-gray-600 text-sm">feedback@medisense.health</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="flex items-start gap-3">
                                            <Phone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-sm">Phone</h3>
                                                <p className="text-gray-600 text-sm">+91-98765-43210</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hours */}
                                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                                        <div className="flex items-start gap-3">
                                            <Clock className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-sm">Response Time</h3>
                                                <p className="text-gray-600 text-sm">Within 24-48 hours</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Important Note */}
                            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                                <div className="flex gap-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-yellow-800 font-medium mb-1">⚠️ Not for Emergency Use</p>
                                        <p className="text-xs text-yellow-700">
                                            For urgent patient safety concerns, contact your local care team or emergency services directly.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-8 px-8 sm:px-12 lg:px-24 bg-gradient-to-r from-blue-600 to-emerald-600">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Help Shape Our Prototype
                    </h2>
                    <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                        Your feedback is valuable. Whether it's a bug report, feature request, or general comment, we want to hear from you as we build this project.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick="/" className="px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-200">
                             <a href="https://github.com/i-kundankumar/Medisense" target="_blank" rel="noopener noreferrer">View GitHub</a>
                        </button>
                        <a 
                            href="https://github.com/i-kundankumar/Medisense" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-200 inline-block"
                        >
                            View GitHub
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Contact;
