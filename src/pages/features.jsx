import { Heart, Zap, Cloud, LayoutGrid } from "lucide-react";

function features() {
    const featuresList = [
        {
            icon: <Heart className="w-6 h-6" />,
            title: "Multi-Sensor Health Monitoring",
            description: "Tracks heart rate(AD8232), SpO₂ (MAX30102), body temperature (DS18B20/LM35) and fall detection (MPU6050), with high accuracy."
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "ESP32 Data Acquisition & Processing",
            description: "Collects raw sensor data, performs signal processing, filters noise, and prepares the health metrics for cloud upload."
        },
        {
            icon: <Cloud className="w-6 h-6" />,
            title: "Cloud Connectivity & Storage",
            description: "Uploads real-time vitals to Firebase, MQTT, or ThingSpeak for remote access, analysis, history logs, and long-term patient tracking."
        },
        {
            icon: <LayoutGrid className="w-6 h-6" />,
            title: "Dashboards & Local Alerts",
            description: "Mobile/web dashboards show live data, graphs, and trends. Local OLED display, LED indicators, and buzzer provide instant alerts."
        }
    ];

    return (
        <div className="w-full">
            {/* Header Section */}
            <section className="py-8 bg-gradient-to-br from-blue-50 via-white to-emerald-50 px-8 sm:px-12 lg:px-24">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                            System <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Features</span>
                        </h1>
                        {/* <p className="text-base text-gray-500 max-w-1xl mx-auto">
                            Core components of the Smart IoT-Based Health Care Monitoring System that ensure accurate vital tracking, cloud connectivity, and real-time remote monitoring.
                        </p> */}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-8 px-8 sm:px-12 lg:px-24 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-6">
                        {featuresList.map((feature, idx) => (
                            <div
                                key={idx}
                                className="p-6 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default features;
