import { Users, Shield, Lightbulb, CheckCircle } from "lucide-react";

function About() {
    const values = [
        {
            title: "Patient-First Design",
            description: "Every feature is built with patients and clinicians in mind, reducing friction and increasing adherence."
        },
        {
            title: "Security & Privacy",
            description: "HIPAA-compliant infrastructure with enterprise-grade encryption to protect sensitive health data."
        },
        {
            title: "Real-Time Insights",
            description: "Live dashboards and analytics help clinicians make informed decisions quickly."
        }
    ];

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="py-8 bg-gradient-to-br from-blue-50 via-white to-emerald-50 px-8 sm:px-12 lg:px-24">
                <div className="max-w-6xl mx-auto">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                            About Our <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Project</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl">
                            We're building the next generation of health monitoring systems using IoT sensors, cloud connectivity, and intelligent dashboards. This is an early-stage prototype designed to revolutionize how we track and manage health.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-8 px-8 sm:px-12 lg:px-24 bg-white" style="padding-top:0px;">
                <div className="max-w-6xl mx-auto">
                    <div className="max-w-3xl">
                        {/* Left Content */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-gray-900">
                                Building the future of health monitoring
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                This is an early-stage prototype project focused on creating innovative solutions for real-time health monitoring. We're combining IoT sensors, cloud connectivity, and intelligent dashboards to solve real healthcare challenges.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                We're designing with the vision that healthcare monitoring should be accessible, accurate, and actionable for both patients and healthcare providers.
                            </p>

                            {/* Features List */}
                            <div className="space-y-3 pt-4">
                                {[
                                    "Designed with innovative IoT sensor technology",
                                    "Built for scalability and future healthcare needs",
                                    "Focused on user experience and accessibility"
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-8 px-8 sm:px-12 lg:px-24 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Core Values</h2>
                        <p className="text-gray-600">What drives us to build better healthcare solutions</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {values.map((value, idx) => (
                            <div key={idx} className="p-8 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-8 px-8 sm:px-12 lg:px-24 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl p-12 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Help Shape the Future</h2>
                        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                            Be part of this innovative prototype. Test our features, share feedback, and help us build the next generation of health monitoring.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/Login"
                                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Try Prototype
                            </a>
                            <a
                                href="/contact"
                                className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all"
                            >
                                Send Feedback
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;
