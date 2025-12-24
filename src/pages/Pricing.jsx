import { Check } from "lucide-react";

function Pricing() {
    const plans = [
        {
            name: "Basic",
            subtitle: "For individual patients",
            price: "₹799",
            period: "/mo",
            description: "Perfect for personal health tracking",
            features: [
                "Smart reminders",
                "Basic reports",
                "Email support",
                "Mobile app access",
                "7-day data history"
            ],
            featured: false,
            buttonText: "Choose Plan"
        },
        {
            name: "Professional",
            subtitle: "Best for clinicians",
            price: "₹2,499",
            period: "/mo",
            description: "For healthcare providers and clinics",
            features: [
                "All basic features",
                "Telehealth integration",
                "Advanced analytics",
                "Reports & insights",
                "Priority support",
                "30-day data history",
                "Multi-patient dashboard"
            ],
            featured: true,
            buttonText: "Choose Plan"
        },
        {
            name: "Enterprise",
            subtitle: "For hospitals and clinics",
            price: "Custom",
            period: "",
            description: "Enterprise-grade solution",
            features: [
                "Unlimited users",
                "Custom integration",
                "API access",
                "Dedicated support",
                "Advanced security",
                "Unlimited data history",
                "White-label option"
            ],
            featured: false,
            buttonText: "Contact Sales"
        }
    ];

    return (
        <div className="w-full">
            {/* Header Section */}
            <section className="py-8 bg-gradient-to-br from-blue-50 via-white to-emerald-50 px-8 sm:px-12 lg:px-24">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                            Simple, Transparent <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Pricing</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Choose the perfect plan for your healthcare monitoring needs. No hidden fees.
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-8 px-8 sm:px-12 lg:px-24 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-6">
                        {plans.map((plan, idx) => (
                            <div
                                key={idx}
                                className={`rounded-xl border transition-all duration-300 ${
                                    plan.featured
                                        ? "border-blue-600 shadow-2xl scale-105 bg-gradient-to-br from-blue-50 to-emerald-50"
                                        : "border-gray-200 hover:border-blue-400 hover:shadow-lg bg-white"
                                }`}
                            >
                                {plan.featured && (
                                    <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-2 text-center text-sm font-semibold rounded-t-xl">
                                        ★ Most Popular
                                    </div>
                                )}
                                
                                <div className="p-8">
                                    {/* Plan Header */}
                                    <div className="mb-6">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                        <p className="text-sm text-gray-600 mb-4">{plan.subtitle}</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                            <span className="text-gray-600">{plan.period}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                                    </div>

                                    {/* CTA Button */}
                                    <button
                                        className={`w-full py-3 px-4 rounded-lg font-semibold mb-6 transition-all ${
                                            plan.featured
                                                ? "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-lg"
                                                : "border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600"
                                        }`}
                                    >
                                        {plan.buttonText}
                                    </button>

                                    {/* Features List */}
                                    <div className="space-y-3 border-t border-gray-200 pt-6">
                                        {plan.features.map((feature, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-8 px-8 sm:px-12 lg:px-24 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
                        <p className="text-gray-600">Have questions? We're here to help.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                q: "Can I change plans anytime?",
                                a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
                            },
                            {
                                q: "Is there a free trial?",
                                a: "Yes, we offer a 14-day free trial for all plans. No credit card required to get started."
                            },
                            {
                                q: "What payment methods do you accept?",
                                a: "We accept all major credit cards, PayPal, and bank transfers for enterprise customers."
                            },
                            {
                                q: "Is my data secure?",
                                a: "Yes, we use HIPAA-compliant encryption and industry-standard security measures."
                            }
                        ].map((faq, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-lg border border-gray-200">
                                <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
                                <p className="text-gray-600 text-sm">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Pricing;