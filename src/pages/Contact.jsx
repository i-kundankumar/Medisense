import "./Contact.css";

function Contact() {
    return (
        <div className="container mt-4">
            <section className="contact-hero">
                <h1 className="contact-title">Contact Medisense</h1>
                <p className="contact-subtitle">
                    Need help, a demo, or have questions about deploying Medisense in your
                    clinic? Reach out and our team will get back to you.
                </p>
            </section>

            <section className="contact-grid">
                {/* Contact form */}
                <div className="contact-card">
                    <h3>Send us a message</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            alert("Thanks for reaching out. We'll get back to you soon.");
                        }}
                    >
                        <div className="mb-3">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Dr. A. Sharma / Priya Singh"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="you@clinic.com"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Organization / Clinic</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="City Health Clinic"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">How can we help?</label>
                            <select className="form-select" defaultValue="demo">
                                <option value="demo">Request a product demo</option>
                                <option value="pricing">Ask about pricing</option>
                                <option value="support">Support for existing account</option>
                                <option value="other">Something else</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Message</label>
                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="Share a bit more about your needs..."
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100">
                            Send message
                        </button>
                    </form>
                </div>

                {/* Contact info / details */}
                <div className="contact-info">
                    <h3>Clinic & support</h3>
                    <p className="muted">
                        Our team works with clinics, hospitals and digital health teams to
                        roll out Medisense safely and smoothly.
                    </p>

                    <div className="contact-info-block">
                        <div className="contact-label">Email</div>
                        <div className="contact-value">support@medisense.health</div>
                    </div>

                    <div className="contact-info-block">
                        <div className="contact-label">Sales & demos</div>
                        <div className="contact-value">sales@medisense.health</div>
                    </div>

                    <div className="contact-info-block">
                        <div className="contact-label">Phone</div>
                        <div className="contact-value">+91-98765-43210</div>
                    </div>

                    <div className="contact-info-block">
                        <div className="contact-label">Hours</div>
                        <div className="contact-value">
                            Monday–Friday · 9:00–18:00 IST
                        </div>
                    </div>

                    <div className="contact-note">
                        For urgent patient safety concerns, please contact your local care
                        team or emergency services directly. Medisense is not an emergency
                        service.
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Contact;
