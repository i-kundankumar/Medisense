import "./Pricing.css";

function Pricing() {
    return (
        <div className="container mt-4">
            <h1>Pricing</h1>
            <p className="muted">Simple, transparent plans for clinics and patients.</p>

            <div className="row g-4 mt-3">
                <div className="col-md-4">
                    <div className="pricing-card p-4">
                        <h4>Basic</h4>
                        <p className="muted">For individual patients</p>
                        <div className="price">$9/mo</div>
                        <ul>
                            <li>Smart reminders</li>
                            <li>Basic reports</li>
                            <li>Email support</li>
                        </ul>
                        <button className="btn btn-primary w-100 mt-2">Choose Plan</button>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="pricing-card featured p-4">
                        <h4>Professional</h4>
                        <p className="muted">Best for clinicians</p>
                        <div className="price">$29/mo</div>
                        <ul>
                            <li>All basic features</li>
                            <li>Telehealth</li>
                            <li>Reports & analytics</li>
                            <li>Priority support</li>
                        </ul>
                        <button className="btn btn-primary w-100 mt-2">Choose Plan</button>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="pricing-card p-4">
                        <h4>Enterprise</h4>
                        <p className="muted">For hospitals and clinics</p>
                        <div className="price">Custom</div>
                        <ul>
                            <li>Unlimited users</li>
                            <li>Custom integration</li>
                            <li>Dedicated support</li>
                            <li>Advanced security</li>
                        </ul>
                        <button className="btn btn-primary w-100 mt-2">Contact Sales</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pricing;