import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import emailjs from "@emailjs/browser"
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVoicemail } from "@fortawesome/free-solid-svg-icons";

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
                            <Col md={6}>
                                <div className="d-flex align-items-center">
                                    <FontAwesomeIcon className="me-2" icon={faVoicemail}></FontAwesomeIcon>
                                    <div>
                                        <p>Email Us</p>
                                        <p>emailhere@gmail.com</p>
                                        <p>emailhere@gmail.com</p>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="d-flex align-items-center">
                                    <FontAwesomeIcon className="me-2" icon={faVoicemail}></FontAwesomeIcon>
                                    <div>
                                        <p>Call Us</p>
                                        <p>0000000000000</p>
                                        <p>0000000000000</p>
                                    </div>
                                </div>
                            </Col>
                            <Col md={9}>
                                <div className="d-flex align-items-center">
                                    <FontAwesomeIcon className="me-2" icon={faVoicemail}></FontAwesomeIcon>
                                    <div>
                                        <p>Visit Our Studio</p>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, eius?</p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Col md={12}>
                            <iframe className="mt-4" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13602.744629615981!2d74.31834674999999!3d31.5327787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919049bf02720f9%3A0x4295a66061acf664!2sIchhra%20Lahore%2C%2054000%2C%20Pakistan!5e0!3m2!1sen!2s!4v1775199499174!5m2!1sen!2s" style={{ border: 0, width: "100%", height: "250px" }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                        </Col>
                    </Col>
                </Row>

            </Container>
        </>
    )
}