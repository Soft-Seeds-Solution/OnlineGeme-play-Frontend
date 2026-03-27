import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Date from "../../Components/Date";

export default function DMCAainPage() {
    return (
        <>
            <div className="page-content">
                <section>
                    <Container>
                        <Row className="justify-content-center ">
                            <Col md={10} className="py-4">
                                <div className="d-flex justify-content-center">
                                    <h1 className="text-center heading-color mt-3 ">DMCA Policy</h1>
                                </div>
                            </Col>
                            <Date />
                        </Row>
                    </Container>
                </section>
                <section style={{ backgroundColor: "var(--light-bg)" }}>
                    <Container className="py-3">
                        <Row className="align-items-center">
                            <p>Khelogy respects the intellectual property rights of others and expects users, partners, and content providers to do the same.</p>
                            <p>In accordance with the <b>Digital Millennium Copyright Act (DMCA)</b>, Khelogy.com responds promptly to valid copyright infringement notifications and takes appropriate action when necessary.</p>
                            <p>If you believe that your copyrighted work has been used on <b><Link to="/">https://khelogy.com</Link></b> in a way that constitutes copyright infringement, please follow the procedure described below.</p>

                            <h2>Copyright Infringement Notification</h2>
                            <p>If you are a copyright owner or an authorized representative and believe that any content available on Khelogy infringes your copyright, you may submit a written DMCA notice to us.</p>
                            <p>Your notification should include the following information:</p>
                            <ul>
                                <li>Identification of the copyrighted work that you claim has been infringed</li>
                                <li>The exact URL or location of the allegedly infringing material on our website</li>
                                <li>Your name, email address, and contact information</li>
                                <li>A statement that you have a good faith belief that the use of the material is not authorized by the copyright owner, its agent, or the law</li>
                                <li>A statement that the information in the notification is accurate and that you are authorized to act on behalf of the copyright owner</li>
                                <li>Your <b>physical or electronic signature</b></li>
                            </ul>
                            <p>Incomplete notices may delay the processing of your request.</p>

                            <h2>How to Submit a DMCA Complaint</h2>
                            <p>You may submit your DMCA takedown request using the following contact information:</p>
                            <p>Email: <b>softseedssolution@gmail.com</b></p>
                            <p>Subject Line: <b>DMCA Copyright Complaint</b></p>
                            <p>After receiving a valid complaint, we will review the request and may remove or disable access to the allegedly infringing material.</p>

                            <h2>Third-Party Game Content</h2>
                            <p>Khelogy provides access to various online games, some of which may be <b>hosted, embedded, or provided by third-party game developers or platforms</b>.</p>
                            <p>These games may operate on servers that are not controlled by Khelogy.com. All trademarks, logos, and game content belong to their respective owners.</p>
                            <p>Khelogy does not claim ownership of third-party games unless explicitly stated. If any third-party content on our website violates your intellectual property rights, please notify us and we will take appropriate action.</p>

                            <h2>Repeat Infringement Policy</h2>
                            <p>Khelogy may restrict or terminate access to users, partners, or content providers who are found to repeatedly violate copyright laws.</p>

                            <h2>Counter-Notification</h2>
                            <p>If you believe that material removed from Khelogy due to a DMCA complaint was removed by mistake or misidentification, you may submit a counter-notification.</p>
                            <p>Your counter-notification should include:</p>
                            <ul>
                                <li>Identification of the content that was removed and the location where it appeared before removal</li>
                                <li>Your name, address, email address, and contact information</li>
                                <li>A statement under penalty of perjury that you believe the content was removed due to mistake or misidentification</li>
                                <li>Your physical or electronic signature</li>
                            </ul>
                            <p>After receiving a valid counter-notification, we may restore the content unless the original complainant files legal action within the required time period.</p>

                            <h2>Third-Party Links and Content</h2>
                            <p>Khelogy may contain links to third-party websites, services, or game providers. These external platforms operate independently and may have their own copyright policies.</p>
                            <p>We are not responsible for the content or copyright practices of third-party websites.</p>

                            <h2>Policy Updates</h2>
                            <p>Khelogy reserves the right to update or modify this DMCA Policy at any time.</p>
                            <p>Any updates will be posted on this page with an updated <b>Last Updated</b> date.</p>

                            <h2>Contact Information</h2>
                            <p>If you have questions about this DMCA Policy or wish to report copyright infringement, please contact us:</p>
                            <b>Email: softseedssolution@gmail.com</b>
                            <b>Website: <Link to="/">https://khelogy.com</Link></b>
                        </Row>
                    </Container>
                </section>
            </div >
        </>
    )
}
