import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Date from "../../Components/Date";

export default function MainPage() {
    return (
        <>
            <div className="page-content">
                <section>
                    <Container>
                        <Row className="justify-content-center ">
                            <Col md={10} className="py-4">
                                <div className="d-flex justify-content-center">
                                    <h1 className="text-center heading-color mt-3 ">Privacy Policy</h1>
                                </div>
                                    <Date />
                                <p className="text-center m-0">Welcome to <b>Khelogy</b>. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect information when you visit and use our website.</p>
                            </Col>
                        </Row>
                    </Container>
                </section>
                <section style={{ backgroundColor: "var(--light-bg)" }}>
                    <Container className="py-3">
                        <Row className="align-items-center">
                            <p>  <b>Note</b>: By accessing or using <Link to="/"><b>https:/ / khelogy.com</b></Link>, you agree to the practices described in this Privacy Policy.</p>
                            <h2 className="mt-2">Information We Collect</h2>
                            <p>When you visit Khelogy.com, we may collect certain information to improve our website and provide a better gaming experience.</p>
                            <h4>Personal Information</h4>
                            <p>We may collect personal information only when you voluntarily provide it, such as when you contact us through email.</p>
                            <p>This may include:</p>
                            <ul>
                                <li>Name</li>
                                <li>Email address</li>
                                <li>Messages, feedback, or inquiries you send us</li>
                            </ul>
                            <p>We only collect personal information that you choose to provide.</p>
                            <h4>Non-Personal Information</h4>
                            <p>We may automatically collect certain non-personal information when you visit our website, such as:</p>
                            <ul>
                                <li>IP address</li>
                                <li>Browser type</li>
                                <li>Device type</li>
                                <li>Operating system</li>
                                <li>Pages visited on our website</li>
                                <li>Date and time of visits</li>
                                <li>Referring website addresses</li>
                            </ul>
                            <p>This information helps us understand how visitors use our platform and improve website performance.</p>
                            <h2>Log Files</h2>
                            <p>Khelogy follows a standard procedure of using <b>log files</b>. These files log visitors when they visit websites. The information collected by log files may include:</p>
                            <ul>
                                <li>IP addresses</li>
                                <li>Internet service provider (ISP)</li>
                                <li>Browser type</li>
                                <li>Date and time stamp</li>
                                <li>Referring/exit pages</li>
                                <li>Number of clicks</li>
                            </ul>
                            <p>This information is used for analyzing trends, managing the website, tracking user movement, and gathering demographic information.</p>
                            <h2>Cookies and Web Technologies</h2>
                            <p>Khelogy uses <b>cookies and similar technologies</b> to enhance the user experience.</p>
                            <p>Cookies may be used to:</p>
                            <ul>
                                <li>Remember user preferences</li>
                                <li>Analyze website traffic</li>
                                <li>Improve website functionality</li>
                                <li>Deliver relevant advertisements</li>
                            </ul>
                            <p>Users can choose to disable cookies through their browser settings. However, some parts of the website may not function properly if cookies are disabled.</p>
                            <h2>Google AdSense and Advertising Partners</h2>
                            <p>We may display advertisements from <b>Google AdSense and other advertising partners</b>.</p>
                            <p>Google is a third-party vendor that uses cookies to serve ads on our website. Google&apos;s use of the <b>DoubleClick cookie</b> enables it and its partners to serve ads to users based on their visit to this website and other websites on the internet.</p>
                            <p>Users may choose to disable personalized advertising by visiting:</p>
                            <a href="https://adssettings.google.com" target="blank">https://adssettings.google.com</a>
                            <p>Advertising partners may use technologies such as:</p>
                            <ul>
                                <li>Cookies</li>
                                <li>JavaScript</li>
                                <li>Web beacons</li>
                            </ul>
                            <p>These technologies are used to measure the effectiveness of advertising campaigns and personalize the advertising content you see.</p>
                            <p>Khelogy has no control over the cookies used by third-party advertisers.</p>
                            <h2>Third-Party Game Providers</h2>
                            <p>Khelogy provides access to online games, some of which are <b>hosted or embedded from third-party game providers</b>.</p>
                            <p>These third-party providers may collect certain information through their games, including device information, cookies, or usage data.</p>
                            <p>We do not control how these providers collect or use information. Users should review the privacy policies of the respective game providers for more information.</p>
                            <h2>Third-Party Privacy Policies</h2>
                            <p>Khelogy’s Privacy Policy does not apply to other advertisers or websites. We advise you to consult the respective Privacy Policies of third-party services for more detailed information about their practices.</p>
                            <h2>External Links</h2>
                            <p>Our website may contain links to third-party websites or services that are not operated by us.</p>
                            <p>If you click on a third-party link, you will be directed to that website. We strongly advise you to review the Privacy Policy of every website you visit.</p>
                            <p>We have no control over and assume no responsibility for the content or privacy practices of external websites.</p>
                            <h2>Children&apos;s Information</h2>
                            <p>Protecting children&apos;s privacy is important to us.</p>
                            <p>Khelogy does not knowingly collect personal information from children under the age of 13. If you believe that a child has provided personal information on our website, please contact us and we will promptly remove such information from our records.</p>
                            <h2>Data Security</h2>
                            <p>We take reasonable measures to protect your information from unauthorized access, disclosure, alteration, or destruction.</p>
                            <p>However, no method of data transmission over the internet is completely secure, and we cannot guarantee absolute security.</p>
                            <h2>Consent</h2>
                            <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>
                            <h2>Updates to This Privacy Policy</h2>
                            <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated <b>Last Updated</b> date.</p>
                            <p>We encourage users to review this page periodically to stay informed about how we protect user information.</p>
                            <h2>Contact Us</h2>
                            <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                            <b>Email: softseedssolution@gmail.com</b>
                            <b>Website: <Link to="/">https://khelogy.com</Link></b>
                        </Row>
                    </Container>
                </section>
            </div >
        </>
    )
}
