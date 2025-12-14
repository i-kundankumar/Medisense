import "./About.css";

function About() {
    return (
        <div className="container mt-4">
            <section className="about-hero">
                <h1 className="about-hero-title">About Medisense</h1>
                <p className="about-hero-subtitle">
                    Medisense helps patients stay on track with their medications while
                    giving clinicians real-time visibility into adherence, vitals and
                    outcomes — all in one HIPAA-compliant workspace.
                </p>
            </section>

            <section className="about-grid">
                <div className="about-card">
                    <h3>Built with clinicians and patients together</h3>
                    <p>
                        We work closely with clinics, hospitals and caregivers to design
                        tools that fit into existing workflows instead of disrupting them.
                    </p>
                    <p>
                        From AI-driven reminders to telehealth and dashboards, every feature
                        is crafted to reduce friction and increase adherence.
                    </p>

                    <div className="about-list">
                        <div className="about-list-item">
                            <div className="about-bullet">✓</div>
                            <div>Co-designed with doctors, nurses and care coordinators.</div>
                        </div>
                        <div className="about-list-item">
                            <div className="about-bullet">✓</div>
                            <div>Tested with real patients across multiple conditions.</div>
                        </div>
                        <div className="about-list-item">
                            <div className="about-bullet">✓</div>
                            <div>Focused on clarity, safety and data privacy.</div>
                        </div>
                    </div>
                </div>

                <div className="about-metrics">
                    <div className="about-metric">
                        <div className="about-metric-label">Patients supported</div>
                        <div className="about-metric-value">18,000+</div>
                    </div>
                    <div className="about-metric">
                        <div className="about-metric-label">Clinics onboarded</div>
                        <div className="about-metric-value">120+</div>
                    </div>
                    <div className="about-metric">
                        <div className="about-metric-label">Countries</div>
                        <div className="about-metric-value">7</div>
                    </div>
                    <div className="about-metric">
                        <div className="about-metric-label">Average adherence lift</div>
                        <div className="about-metric-value">+89%</div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;
