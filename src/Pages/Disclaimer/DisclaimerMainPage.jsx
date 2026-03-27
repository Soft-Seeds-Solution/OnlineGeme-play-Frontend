import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Date from "../../Components/Date";

export default function DisclaimerMainPage() {
    return (
        <>
            <div className="page-content">
                <section>
                    <Container>
                        <Row className="justify-content-center ">
                            <Col md={10} className="py-4">
                                <div className="d-flex justify-content-center">
                                    <h1 className="text-center heading-color mt-3 ">Disclaimer</h1>
                                </div>
                            </Col>
                            <Date />
                        </Row>
                    </Container>
                </section>
                <section style={{ backgroundColor: "var(--light-bg)" }}>
                    <Container className="py-3">
                        <Row className="align-items-center">
                            <h2>Welcome to <b>Khelogy</b>.</h2>
                            <p> The information, games, and content available on this website are provided in good faith for <b>general entertainment and informational purposes only</b>. By accessing and using <b>https:/ / khelogy.com</b>, you agree to the terms described in this Disclaimer.</p>

                            <h2>General Information</h2>
                            <p><b>Khelogy</b> is an online gaming platform that allows users to play a variety of games for free through their web browsers.</p>
                            <p>While we strive to keep the content, games, and information on this website accurate and up to date, we make <b>no warranties or guarantees</b> regarding the completeness, reliability, or accuracy of any information or content available on the website.</p>
                            <p>Any action you take based on the information or content found on this website is <b>strictly at your own risk</b>.</p>
                            <p>Khelogy will not be liable for any losses, damages, or issues arising from the use of our website.</p>

                            <h2>Third-Party Game Content</h2>
                            <p>Some games available on <b>Khelogy</b> are <b>hosted, embedded, or provided by third-party game developers or platforms</b>.</p>
                            <p>These games may operate on servers that are not controlled by Khelogy.com. All trademarks, logos, and game content belong to their respective owners.</p>
                            <p>We do not claim ownership of third-party games unless explicitly stated.</p>
                            <p>If you believe that any game or content on our website violates your copyright or intellectual property rights, please contact us and we will review the request and take appropriate action.</p>

                            <h2>External Links Disclaimer</h2>
                            <p>Our website may contain links to external websites, services, or games provided by third parties.</p>
                            <p>While we aim to provide links to useful and reputable sources, <b>Khelogy has no control over the content, policies, or practices of these external websites</b>.</p>
                            <p>These links do not imply endorsement or recommendation of the content found on those websites. External website owners may change their content at any time without notice.</p>
                            <p>We encourage users to review the privacy policies and terms of any third-party websites they visit.</p>

                            <h2>Advertising Disclaimer</h2>
                            <p>Khelogy.com may display advertisements provided by <b>third-party advertising networks</b>, including services such as <b>Google AdSense or other advertising partners</b>.</p>
                            <p>These advertisements help support the operation and maintenance of our website so that users can continue playing games for free.</p>
                            <p>Khelogy.com does not control the content of advertisements displayed on the website and is <b>not responsible for the products, services, or claims made by advertisers</b>.</p>
                            <p>Users who interact with advertisements should review the terms and policies of the respective advertisers.</p>

                            <h2>Website Availability</h2>
                            <p>We strive to keep the website accessible and functioning smoothly. However, Khelogy.com does not guarantee that the website will always be available without interruptions.</p>
                            <p>Temporary interruptions may occur due to:</p>
                            <ul>
                                <li>technical issues</li>
                                <li>server maintenance</li>
                                <li>third-party service disruptions</li>
                                <li>network problems</li>
                            </ul>
                            <p>We are not responsible for any inconvenience or loss caused by website downtime.</p>

                            <h2>Consent</h2>
                            <p>By using <b>Khelogy</b>, you hereby consent to this Disclaimer and agree to its terms.</p>

                            <h2>Updates to This Disclaimer</h2>
                            <p>We may update, amend, or modify this Disclaimer at any time without prior notice.</p>
                            <p>Any changes will be posted on this page with an updated <b>Last Updated</b> date.</p>

                            <h2>Contact Us</h2>
                            <p>If you have any questions regarding this Disclaimer or the content on our website, you may contact us:</p>
                            <b>Email: softseedssolution@gmail.com</b>
                            <b>Website: <Link to="/">https://khelogy.com</Link></b>
                        </Row>
                    </Container>
                </section>
            </div >
        </>
    )
}
