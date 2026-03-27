import { Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

export default function AboutPage() {
    return (
        <div className="page-content">
            <section>
                <Container>
                    <Row className="justify-content-center ">
                        <Col md={8} className="py-4">
                            <div className="d-flex justify-content-center">
                                <h1 className="text-center heading-color mt-3 ">Innovating for a Better Tomorrow</h1>
                            </div>
                            <p className="text-center m-0">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Autem aliquam voluptas fugit, voluptatum, provident inventore eligendi, recusandae dolore incidunt nostrum sunt doloremque unde hic reprehenderit excepturi vero aut fuga in.</p>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section>
                <Container className="py-5">
                    <Row className="align-items-center justify-content-between">
                        <h2>Core Values</h2>
                        <p>The Principles that guide every decision we make and every product we build</p>
                        <Col md={3} className="aboutCards">
                            <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                            <h4>Integrity</h4>
                            <p>We believe in honest work and transparent communication. We do the right thing, even when no one is watching.</p>
                        </Col>
                        <Col md={3} className="aboutCards">
                            <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                            <h4>Innovation</h4>
                            <p>Pushing boundaries to find creative solutions. We embrase curiosity and are never satisfied with the status quo.</p>
                        </Col>
                        <Col md={3} className="aboutCards">
                            <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                            <h4>Sustainability</h4>
                            <p>Committed To a greener future through tech. We design products that server both our clients and our planet.</p>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section>
                <Container className="py-5">
                    <Row className="align-items-center justify-content-between">
                        <h2>Our Journey</h2>
                        <p>A decade of growth, innovation, and impact.</p>
                        <Row className="justify-content-center">
                            <Col md={4} className="journey-after mt-3 align-items-end">
                                2014
                                The Begginning
                                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ab, consequuntur.</p>
                            </Col>
                            <Col md={4}></Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col md={4}></Col>
                            <Col md={4} className="journey-after mt-3 align-items-end">
                                2014
                                The Begginning
                                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ab, consequuntur.</p>
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col md={4} className="journey-after mt-3 align-items-end">
                                2014
                                The Begginning
                                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ab, consequuntur.</p>
                            </Col>
                            <Col md={4}></Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col md={4}></Col>
                            <Col md={4} className="journey-after mt-3 align-items-end">
                                2014
                                The Begginning
                                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ab, consequuntur.</p>
                            </Col>
                        </Row>

                    </Row>
                </Container>
            </section>

        </div>
    )
}