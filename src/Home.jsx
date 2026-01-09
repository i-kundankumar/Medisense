import banner from "./assets/banner.jpg";
import { Activity, Zap, Cloud, Heart, TrendingUp, Shield, Smartphone, CheckCircle } from "lucide-react";

function Home() {
  const features = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Multi-Sensor Monitoring",
      description: "MAX30102, DS18B20, AD8232, for comprehensive health tracking"
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Cloud Connectivity",
      description: "Real-time data upload via Firebase, MQTT, or ThingSpeak"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Smart Dashboards",
      description: "Web/mobile dashboards with alerts and historical data"
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "24/7 Monitoring",
      description: "Continuous tracking with instant notifications"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Storage",
      description: "HIPAA-compliant encryption with role-based access"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Analytics",
      description: "AI insights and predictive health recommendations"
    }
  ];

  const stats = [
    { label: "Continuous", value: "24/7", icon: <Activity className="w-5 h-5" /> },
    { label: "Connected", value: "ESP32", icon: <Zap className="w-5 h-5" /> },
    { label: "Firebase", value: "Cloud", icon: <Cloud className="w-5 h-5" /> }
  ];

  return (
    <>
      <main className="w-full">
        {/* Hero Section */}
        <section className="py-8 bg-gradient-to-br from-blue-50 via-white to-emerald-50 px-8 sm:px-12 lg:px-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-600">Next-Gen IoT Healthcare</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                    Smart Health Monitoring <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">System</span>
                  </h1>
                  
                  <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                    Real-time IoT-based monitoring with ESP32, cloud storage, and intelligent dashboards for patients and clinicians
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <a
                    href="/Login"
                    className="px-7 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center"
                  >
                    Get Started
                  </a>
                  <a
                    href="#features"
                    className="px-7 py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300 text-center"
                  >
                    Learn More
                  </a>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  {stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 text-center"
                    >
                      <div className="flex justify-center text-blue-600 mb-2">{stat.icon}</div>
                      <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Image */}
              <div className="relative hidden md:block">
                <div className="absolute -inset-6 bg-gradient-to-r from-blue-200 to-emerald-200 rounded-3xl blur-3xl opacity-25"></div>
                <img
                  src={banner}
                  alt="Healthcare Monitoring"
                  className="relative rounded-3xl shadow-2xl w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-8 px-8 sm:px-12 lg:px-24 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Powerful Features</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything needed for comprehensive real-time health monitoring
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-8 px-8 sm:px-12 lg:px-24 bg-gradient-to-br from-blue-50 to-emerald-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">How It Works</h2>
              <p className="text-lg text-gray-600">Transform healthcare monitoring in 3 simple steps</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "Collect",
                  description: "ESP32 sensors gather real-time health data including heart rate, oxygen, temperature",
                  icon: <Activity className="w-6 h-6" />
                },
                {
                  step: "2",
                  title: "Process",
                  description: "Advanced algorithms analyze data for anomalies and generate actionable insights",
                  icon: <Zap className="w-6 h-6" />
                },
                {
                  step: "3",
                  title: "Monitor",
                  description: "View dashboards, receive alerts, and share data securely with clinicians",
                  icon: <CheckCircle className="w-6 h-6" />
                }
              ].map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-white p-7 rounded-xl shadow-lg border border-gray-100 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                        {item.step}
                      </div>
                      <div className="text-blue-600">{item.icon}</div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                  {idx < 2 && (
                    <div className="hidden lg:flex absolute top-1/4 -right-3 justify-center items-center">
                      <div className="text-blue-400 text-2xl font-bold">→</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  );
}

export default Home;
