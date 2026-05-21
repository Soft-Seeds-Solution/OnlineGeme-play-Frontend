import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faInstagram, faLinkedin, faTiktok, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { Col, Container, Form, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import siteLogo from "../assets/khelogy-logo.webp";
import { useContext } from "react";
import GameCatContext from "../ContextApi/GameCatContext";

export default function Footer() {
    const { categories } = useContext(GameCatContext);
    const mainCategories = categories?.filter(cat => cat.parent === null);
    return (
        <>
            <section className="mt-5 py-4" style={{ backgroundColor: "var(--bg-whites)" }}>

                <Container>
                    <Row className="justify-content-between">
                        <Col md={3}> <Image className="mb-4" src={siteLogo} style={{ width: "50%" }} /> <br />  Explore a huge library of free online games designed for every type of player. However you love shooting, racing, puzzles, or strategy games — your next favorite game is waiting for you.</Col>
                        <Col md={2}>
                            <h3>Quick Links</h3>
                            <Link to="/" className="text-dark"><p className="mb-3">Home</p></Link>
                            {/* <Link to="/about" className="text-dark"><p className="mb-3">About</p></Link>
                            <Link to="/contact-us" className="text-dark"><p className="mb-3">Contact</p></Link> */}
                            <Link to="/privacy-policy" className="text-dark"><p className="mb-3">Privacy Policy</p></Link>
                            <Link to="/disclaimer" className="text-dark"><p className="mb-3">Disclaimer</p></Link>
                            <Link to="/terms-conditions" className="text-dark"><p className="mb-3">Terms & Conditions</p></Link>
                            <Link to="/DMCA" className="text-dark"><p className="mb-3">DMCA</p></Link>
                            <Link to="/cookies" className="text-dark"><p className="mb-3">Cookies Policy</p></Link>
                        </Col>
                        <Col md={3}>
                            <h3>Main Categories</h3>
                            {mainCategories?.slice(0, 6).map((category, index) => (
                                <Col md={12} xs={6} key={index}>
                                    <Link to={`/category/${category?.catUrl}`} className="nav-link">
                                        <div className="d-flex px-2 align-items-center">
                                            <Image src={category?.logo}
                                                style={{
                                                    width: "15%"
                                                }}
                                                className="p-2"
                                            />
                                            <p>{category?.category}</p>
                                        </div>
                                    </Link>
                                </Col>
                            ))}</Col>
                        <Col md={3} className="follow-icons">
                            <h3 className="mt-4">Follow Us</h3>
                            <Form className="d-flex align-items-center">
                                <div className="position-relative">
                                    <Form.Control
                                        type="email"
                                        placeholder="Email"
                                        className="pe-5"
                                    />

                                    <FontAwesomeIcon
                                        icon={faArrowRight}
                                        className="position-absolute top-50 end-0 translate-middle-y me-3 text-secondary"
                                        style={{ cursor: "pointer" }}
                                    />
                                </div>
                            </Form>
                            <div className="mt-3">
                                <a href="https://www.facebook.com/profile.php?id=61584803254093&mibextid=rS40aB7S9Ucbxw6v" target="blank"> <FontAwesomeIcon icon={faFacebookF} className="me-3 icon" /></a>
                                <a href="https://www.instagram.com/_khelogy/" target="blank">     <FontAwesomeIcon icon={faInstagram} className="me-3 icon" /></a>
                                <a href="https://x.com/Khelogy" target="blank"> <FontAwesomeIcon icon={faTwitter} className="me-3 icon" /></a>
                                <a href="https://www.linkedin.com/company/khelogy/" target="blank"><FontAwesomeIcon icon={faLinkedin} className="me-3 icon" /></a>
                                <a href="https://www.tiktok.com/@khelogy" target="blank"><FontAwesomeIcon icon={faTiktok} className="me-3 icon" /></a>
                                <a href="https://www.youtube.com/@khelogyonlineplaygames" target="blank"><FontAwesomeIcon icon={faYoutube} className="icon" /></a>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section >
            <section className="d-flex justify-content-center mt-2">
                <h6> Copyright @2025. All Rights Reseved</h6>
            </section>
        </>
    )
}