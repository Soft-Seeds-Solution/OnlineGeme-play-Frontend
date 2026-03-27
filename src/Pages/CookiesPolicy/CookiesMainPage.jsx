import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Date from "../../Components/Date";

export default function CookiesMainPage() {
    return (
        <>
            <div className="page-content">
                <section>
                    <Container>
                        <Row className="justify-content-center ">
                            <Col md={10} className="py-4">
                                <div className="d-flex justify-content-center">
                                    <h1 className="text-center heading-color mt-3 ">Cookies Policy</h1>
                                </div>
                            </Col>
                            <Date />
                        </Row>
                    </Container>
                </section>
                <section style={{ backgroundColor: "var(--light-bg)" }}>
                    <Container className="py-3">
                        <Row className="align-items-center">
                            <p>This Cookies Policy explains how <b>Khelogy</b> uses cookies and similar technologies when you visit or use our website.</p>
                            <p>By continuing to use <b><Link to="">https:/ / khelogy.com</Link></b>, you agree to the use of cookies as described in this policy.</p>

                            <h2>What Are Cookies</h2>
                            <p>Cookies are small text files that are stored on your device when you visit a website. They help websites remember user preferences and improve the browsing experience.</p>
                            <p>Cookies may collect certain information such as:</p>
                            <ul>
                                <li>IP address</li>
                                <li>Browser type</li>
                                <li>Device information</li>
                                <li>Pages visited</li>
                                <li>Date and time of visits</li>
                            </ul>
                            <p>Cookies do not usually contain personally identifiable information.</p>

                            <h2>How We Use Cookies</h2>
                            <p>Khelogy uses cookies for several purposes, including:</p>
                            <ul>
                                <li>To improve website functionality</li>
                                <li>To remember user preferences</li>
                                <li>To analyze website traffic and usage patterns</li>
                                <li>To support advertising and marketing services</li>
                                <li>To provide a smoother gaming experience</li>
                            </ul>
                            <p>These cookies help us understand how visitors interact with the website so we can improve our services.</p>

                            <h2>Advertising Cookies</h2>
                            <p>Khelogy.com may display advertisements from <b>third-party advertising partners</b>, including services such as <b>Google AdSense</b>.</p>
                            <p>These advertising partners may use cookies, web beacons, or similar technologies to:</p>
                            <ul>
                                <li>Show personalized advertisements</li>
                                <li>Measure advertising performance</li>
                                <li>Limit how often users see certain ads</li>
                            </ul>
                            <p>Google may use the <b>DoubleClick cookie</b> to serve ads based on users’ visits to this and other websites.</p>
                            <p>Users can control or disable personalized advertising by visiting:</p>
                            <a href="https://adssettings.google.com" target="blank">https://adssettings.google.com</a>

                            <h2>Third-Party Cookies</h2>
                            <p>Some cookies on Khelogy may be placed by third-party services, such as:</p>
                            <p>These third-party services may collect information in accordance with their own privacy policies.</p>
                            <ul>
                                <li>Advertising networks</li>
                                <li>Analytics providers</li>
                                <li>Embedded game providers</li>
                            </ul>
                            <p>Khelogy does not control how third-party cookies are used.</p>

                            <h2>Cookies from Embedded Games</h2>
                            <p>Some games available on Khelogy are <b>hosted or embedded from third-party game developers or platforms</b>.</p>
                            <p>These games may use their own cookies or tracking technologies to support gameplay, performance monitoring, or analytics.</p>
                            <p>Users should review the privacy policies of these third-party game providers for more information.</p>

                            <h2>Managing or Disabling Cookies</h2>
                            <p>Most web browsers allow users to control cookies through browser settings.</p>
                            <p>You can choose to:</p>
                            <ul>
                                <li>Accept cookies</li>
                                <li>Block cookies</li>
                                <li>Delete existing cookies</li>
                            </ul>
                            <p>Disabling cookies may affect the functionality of some parts of the website, including certain games or features.</p>
                            <p>Instructions for managing cookies can usually be found in your browser’s help section.</p>

                            <h2>Updates to This Cookies Policy</h2>
                            <p>Khelogy may update this Cookies Policy from time to time.</p>
                            <p>Any changes will be posted on this page with an updated <b>Last Updated</b> date.</p>

                            <h2>Contact Us</h2>
                            <p>If you have any questions about this Cookies Policy or how cookies are used on our website, please contact us:</p>
                            <b>Email: softseedssolution@gmail.com</b>
                            <b>Website: <Link to="/">https://khelogy.com</Link></b>
                        </Row>
                    </Container>
                </section>
            </div >
        </>
    )
}
