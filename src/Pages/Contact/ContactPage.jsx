import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import emailjs from "@emailjs/browser"
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLocation, faPhone, faVoicemail } from "@fortawesome/free-solid-svg-icons";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    })
    const [errorMessage, setErrorMessage] = useState("")

    const sendEmail = (e) => {
        e.preventDefault()
        const { name, email, subject, message } = formData

        if (!name || !email || !subject || !message) {
            setErrorMessage("Field with * should be filled")
            return null;
        }
        setErrorMessage("")
        emailjs.send("service_x3zug9a", "template_qmixyks", formData, "BMWnnRIrv3qh2w5AZ")
            .then(res => {
                setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    message: ""
                })
                console.log(res);
                Swal.fire({
                    title: "Success",
                    text: "Your message has been sent successfully",
                    icon: "success",
                    confirmButtonText: "Ok"
                }
                )
            })
            .catch(err => console.log(err))
    }

    const onchangeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    return (
        <>
            <Container className="page-content">
                <h1 className="heading-color">Get In Touch</h1>
                <Row className="justify-content-between py-3">
                    <Col md={6} className="bg-white p-4" style={{ borderRadius: "5px" }}>
                        <Form onSubmit={sendEmail} className="login-form">
                            {errorMessage && <div className="text-danger">{errorMessage}</div>}
                            <div className="d-flex justify-content-between">
                                <Form.Group className="input mb-3">
                                    <Form.Control type="text" placeholder="Your Name" name="name" value={formData.name} onChange={onchangeHandler} />
                                </Form.Group>
                                <Form.Group className="input mb-3">
                                    <Form.Control type="email" placeholder="Your Email" name="email" value={formData.email} onChange={onchangeHandler} />
                                </Form.Group>
                            </div>
                            <Form.Group className="input mb-3">
                                <Form.Control type="text" placeholder="Your Message Subject" name="subject" value={formData.subject} onChange={onchangeHandler} />
                            </Form.Group>
                            <Form.Group className="input mb-3">
                                <Form.Control as="textarea" rows={7} placeholder="How can we help you?" name="message" value={formData.message} onChange={onchangeHandler} />
                            </Form.Group>
                            <div className="d-flex justify-content-center">
                                <Button className="px-5 primary-btn" type="submit">Submit</Button>
                            </div>
                        </Form>
                    </Col>
                    <Col md={5}>
                        <Row className="g-4">
                            <Col md={7}>
                                <div className="d-flex">
                                    <FontAwesomeIcon className="me-2" icon={faEnvelope}></FontAwesomeIcon>
                                    <div>
                                        <h5 className="sub-heading">Email Us</h5>
                                        <p>softseedssolution@gmail.com</p>
                                    </div>
                                </div>
                            </Col>
                            <Col md={5}>
                                <div className="d-flex">
                                    <FontAwesomeIcon className="me-2" icon={faPhone}></FontAwesomeIcon>
                                    <div>
                                        <h5 className="sub-heading">Call Us</h5>
                                        <p>+923474192493</p>
                                    </div>
                                </div>
                            </Col>
                            <Col md={9}>
                                <div className="d-flex">
                                    <FontAwesomeIcon className="me-2" icon={faLocation}></FontAwesomeIcon>
                                    <div>
                                        <h5 className="sub-heading">Visit Our Studio</h5>
                                        <p>337 Sultan Ahmed Road, Near Wahdat Road, G Block Rehmanpura Colony, Ichra Lahore, 54000, Pakistan</p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Col md={12} className="mt-3">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13604.283235752857!2d74.3135405!3d31.5222151!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391904838334dd3d%3A0xb94b19675c74b96f!2sG8F8%2B7QH%2C%20337%20Sultan%20Ahmed%20Rd%2C%20near%20Wahdat%20Road%2C%20G%20Block%20Rehmanpura%20Colony%2C%20Lahore%2C%2054000%2C%20Pakistan!5e0!3m2!1sen!2s!4v1775221345934!5m2!1sen!2s" style={{ border: 0, width: "100%", height: "250px" }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                        </Col>
                    </Col>
                </Row>

            </Container>
        </>
    )
}