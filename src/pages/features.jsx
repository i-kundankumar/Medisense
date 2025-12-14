import "./features.css";

function features() {
    return (
        <div className="container mt-5 mb-5">
            <div className="features-header text-center mb-5">
                <h1 className="features-title">System Features</h1>
                <p className="muted features-subtitle">
                    Core components of the Smart IoT-Based Health Care Monitoring System that ensure accurate vital tracking, cloud connectivity, and real-time remote monitoring.
                </p>
            </div>

            <div className="row g-4">
                <div className="col-md-6">
                    <div className="feature-detail">
                        <div className="feature-icon">
                            <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                            </svg>
                        </div>
                        <div className="feature-content">
                            <h4 className="feature-title">Multi-Sensor Health Monitoring</h4>
                            <p className="muted feature-description">
                                Tracks heart rate, SpO₂ (MAX30102), body temperature (DS18B20/LM35), fall detection (MPU6050), and air quality (MQ135) with high accuracy.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="feature-detail">
                        <div className="feature-icon">
                            <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z" />
                            </svg>
                        </div>
                        <div className="feature-content">
                            <h4 className="feature-title">ESP32 Data Acquisition & Processing</h4>
                            <p className="muted feature-description">
                                Collects raw sensor data, performs signal processing, filters noise, and prepares the health metrics for cloud upload.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="feature-detail">
                        <div className="feature-icon">
                            <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 6.23 11.08 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3 0 1.13-.64 2.11-1.56 2.62l1.45 1.45C23.16 18.16 24 16.68 24 15c0-2.64-2.05-4.78-4.65-4.96zM3 5.27l2.75 2.74C2.56 8.15 0 10.77 0 14c0 3.31 2.69 6 6 6h11.73l2 2L21 20.73 4.27 4 3 5.27zM7.73 10l8 8H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h1.73z" />
                            </svg>
                        </div>
                        <div className="feature-content">
                            <h4 className="feature-title">Cloud Connectivity & Storage</h4>
                            <p className="muted feature-description">
                                Uploads real-time vitals to Firebase, MQTT, or ThingSpeak for remote access, analysis, history logs, and long-term patient tracking.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="feature-detail">
                        <div className="feature-icon">
                            <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                            </svg>
                        </div>
                        <div className="feature-content">
                            <h4 className="feature-title">Dashboards & Local Alerts</h4>
                            <p className="muted feature-description">
                                Mobile/web dashboards show live data, graphs, and trends. Local OLED display, LED indicators, and buzzer provide instant alerts for abnormal readings.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default features;
