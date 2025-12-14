import "./Home.css";
import banner from "./assets/banner.jpg"

function Home() {

    return (
        <>
            <main className="container mt-4">
                <section className="hero d-flex gap-4 align-items-center">
                    <div className="hero-left">
                        {/* <span className="badge pill-stats">18K users</span> */}
                        <h1 className="hero-title">Smart IoT-Based Health Care Monitoring System</h1>
                        <p className="hero-desc">Real-time IoT-based health monitoring with ESP32, cloud storage, and smart dashboards for patients and clinicians</p>
                        <div className="d-flex gap-3 align-items-center mt-3">
                            <a href="Login" className="btn cta-btn btn-lg">Get Started</a>
                            <a href="features" className="text-features">See features</a>
                        </div>
                        <div className="mt-4 quick-stats d-flex gap-3">
                            <div className="stat-card p-3">
                                <div className="stat-num">24/7</div>
                                <div className="stat-label">Continuous<br/> Monitoring</div>
                            </div>
                            <div className="stat-card p-3">
                                <div className="stat-num">ESP32</div>
                                <div className="stat-label">Wi-Fi Enabled</div>
                            </div>
                            <div className="stat-card p-3">
                                <div className="stat-num">Cloud</div>
                                <div className="stat-label">Firebase / MQTT</div>
                            </div>
                        </div>
                    </div>
                    <div className="hero-right">
                        <img className="patient-photo" src={banner} alt="patient and doctor"/>
                    </div>
                </section>

                <section className="features mt-5" id="features">
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="feature-box p-4">
                                <h5>Multi-Sensor Health Monitoring</h5>
                                <p className="muted">Smart monitoring using MAX30102, DS18B20/LM35, MPU6050 fall detection, and MQ135 air quality.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-box p-4">
                                <h5>ESP32 + Cloud Connectivity</h5>
                                <p className="muted">Data acquisition, signal processing, and real-time cloud upload via Firebase, MQTT or ThingSpeak.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-box p-4">
                                <h5>Dashboards & Local Alerts</h5>
                                <p className="muted">Mobile/web dashboards with history, plus OLED display, LED and buzzer for abnormal readings.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* <section className="testimonials mt-5">
                    <h3>What customers say</h3>
                    <div className="row g-3 mt-3">
                        <div className="col-md-4">
                            <blockquote className="testimonial p-3">
                                "Medisense helped my mother take meds on time. Life changing."
                                <footer>- Priya</footer>
                            </blockquote>
                        </div>
                        <div className="col-md-4">
                            <blockquote className="testimonial p-3">
                                "Clinician dashboard saved hours of follow up."
                                <footer>- Dr. Singh</footer>
                            </blockquote>
                        </div>
                        <div className="col-md-4">
                            <blockquote className="testimonial p-3">
                                "Secure and easy to use."
                                <footer>- Health Clinic</footer>
                            </blockquote>
                        </div>
                    </div>
                </section> */}
            </main>
        </>
    );
}

export default Home;