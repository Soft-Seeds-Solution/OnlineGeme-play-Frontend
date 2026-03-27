import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import emailjs from "@emailjs/browser"
import Swal from "sweetalert2";

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
                <Row className="justify-content-center py-3">
                    <Col md={6}>
                        <h1 className="heading-color">Submit Request</h1>
                        <Form onSubmit={sendEmail} className="login-form">
                            {errorMessage && <div className="text-danger">{errorMessage}</div>}
                            <Form.Group className="input mb-3">
                                <Form.Control type="text" placeholder="Your Name" name="name" value={formData.name} onChange={onchangeHandler} />
                            </Form.Group>
                            <Form.Group className="input mb-3">
                                <Form.Control type="email" placeholder="Your Email" name="email" value={formData.email} onChange={onchangeHandler} />
                            </Form.Group>
                            <Form.Group className="input mb-3">
                                <Form.Control type="text" placeholder="Your Message Subject" name="subject" value={formData.subject} onChange={onchangeHandler} />
                            </Form.Group>
                            <Form.Group className="input mb-3">
                                <Form.Control as="textarea" rows={7} placeholder="Type Message Here" name="message" value={formData.message} onChange={onchangeHandler} />
                            </Form.Group>
                            <div className="d-flex justify-content-center">
                                <Button className="px-5 primary-btn" type="submit">Submit</Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    )
}