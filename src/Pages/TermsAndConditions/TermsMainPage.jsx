import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Date from "../../Components/Date";

export default function TermsMainPage() {
    return (
        <>
            <div className="page-content">
                <section>
                    <Container>
                        <Row className="justify-content-center">
                            <Col md={10} className="py-4">
                                <div className="d-flex justify-content-center">
                                    <h1 className="text-center heading-color mt-3 ">Terms and Conditions</h1>
                                </div>
                                <Date />
                            </Col>
                        </Row>
                    </Container>
                </section>
                <section style={{ backgroundColor: "var(--light-bg)" }}>
                    <Container className="py-3">
                        <Row className="align-items-center">
                            <h2>Welcome to <b>Khelogy</b>.</h2>
                            <p>These Terms and Conditions outline the rules and regulations for using <b>https:/ / khelogy.com</b>. By accessing or using this website, you agree to comply with these terms. If you do not agree with any part of these Terms and Conditions, please discontinue using the website.</p>

                            <h2>Use of the Website</h2>
                            <p><b>Khelogy</b> is an online platform that provides users with access to a variety of browser-based games that can be played free of charge.</p>
                            <p>By using this website, you agree that:</p>
                            <ul>
                                <li>You will use the website only for lawful purposes.</li>
                                <li>You will not attempt to disrupt, damage, or interfere with the website or its services.</li>
                                <li>You will not attempt to gain unauthorized access to the website, servers, or related systems.</li>
                                <li>You will not use the website to distribute harmful software, viruses, or malicious code.</li>
                            </ul>
                            <p>Khelogy reserves the right to restrict or terminate access to the website if these terms are violated.</p>

                            <h2>Intellectual Property Rights</h2>
                            <p>Unless otherwise stated, <b>Khelogy</b> and its licensors own the intellectual property rights for the website and its original content.</p>
                            <p>This includes:</p>
                            <ul>
                                <li>Website design</li>
                                <li>Logo and branding</li>
                                <li>Text content</li>
                                <li>Graphics and layout</li>
                            </ul>
                            <p>Users may access and play games on the website for <b>personal and non-commercial use only</b>.</p>
                            <p>Users must not:</p>
                            <ul>
                                <li>Republish website content without permission</li>
                                <li>Sell or redistribute website materials</li>
                                <li>Copy or reproduce website content for commercial purposes</li>
                            </ul>

                            <h2>Third-Party Games</h2>
                            <p>Some games available on <b>Khelogy</b> are <b>hosted, embedded, or provided by third-party game developers or platforms</b>.</p>
                            <p>These games may operate on servers that are not controlled by Khelogy.com. All trademarks, logos, and game content belong to their respective owners.</p>
                            <p>Khelogy does not claim ownership of third-party games unless explicitly stated.</p>
                            <p>We are not responsible for the functionality, availability, or content of games provided by third-party providers.</p>

                            <h2>User Conduct</h2>
                            <p>By using the website, you agree not to:</p>
                            <ul>
                                <li>Engage in illegal or unauthorized activities</li>
                                <li>Attempt to hack, damage, or disrupt the website</li>
                                <li>Upload malicious software or harmful code</li>
                                <li>Interfere with the normal operation of the platform</li>
                            </ul>
                            <p>Violation of these rules may result in restricted access or permanent suspension from the website.</p>

                            <h2>External Links</h2>
                            <p>Khelogy may contain links to third-party websites or services that are not owned or controlled by us.</p>
                            <p>These links are provided for convenience and informational purposes only. We do not control the content, policies, or practices of external websites.</p>
                            <p>Users are encouraged to review the terms and privacy policies of any third-party websites they visit.</p>

                            <h2>Advertising</h2>
                            <p>Our website may display advertisements provided by <b>third-party advertising networks</b>, including services such as <b>Google AdSense or other advertising partners</b>.</p>
                            <p>These advertisements help support the operation and maintenance of the website so that users can continue to play games for free.</p>
                            <p>Khelogy.com does not control the content of advertisements and is not responsible for the products, services, or claims made by advertisers.</p>
                            <p>Users who interact with advertisements should review the terms and policies of the respective advertisers.</p>

                            <h2>Service Availability</h2>
                            <p>We aim to keep the website accessible and functioning smoothly. However, Khelogy.com does not guarantee that the website or its services will always be available without interruptions.</p>
                            <p>Access to games and website services may be temporarily unavailable due to:</p>
                            <ul>
                                <li>maintenance or updates</li>
                                <li>technical issues</li>
                                <li>third-party provider interruptions</li>
                                <li>server or network problems</li>
                            </ul>
                            <p>Khelogy reserves the right to modify, suspend, or remove any content or games from the website at any time without prior notice.</p>

                            <h2>Limitation of Liability</h2>
                            <p>All content and services provided on <b>Khelogy</b> are offered <b>“as is”</b> without warranties of any kind.</p>
                            <p>We do not guarantee that:</p>
                            <ul>
                                <li>the website will always be available </li>
                                <li>the website will be free from errors or interruptions</li>
                                <li>games will always function properly</li>
                            </ul>
                            <p>Khelogy shall not be held responsible for any loss, damages, or issues arising from the use of this website.</p>

                            <h2>Changes to These Terms</h2>
                            <p>Khelogy reserves the right to update or modify these Terms and Conditions at any time.</p>
                            <p>Any changes will be posted on this page with an updated <b>Last Updated</b> date. Continued use of the website after changes indicates acceptance of the revised terms.</p>

                            <h2>Governing Law</h2>
                            <p>These Terms and Conditions shall be governed and interpreted in accordance with the applicable laws of the relevant jurisdiction.</p>

                            <h2>Contact Us</h2>
                            <p>If you have any questions about these Terms and Conditions, you may contact us:</p>
                            <b>Email: softseedssolution@gmail.com</b>
                            <b>Website: <Link to="/">https://khelogy.com</Link></b>
                        </Row>
                    </Container>
                </section>
            </div >
        </>
    )
}
