import { Col, Container, Image, Row } from "react-bootstrap";
import siteLogo from "../../assets/khelogy-icon.webp"
export default function Hero() {
    return (
        <>
            <Container style={{ backgroundColor: "var(--bg-whites)", borderRadius: "5px" }}>
                <Row className="justify-content-center py-4">
                    <Col md={8}>
                        <div className="d-flex align-items-center">
                            <Image src={siteLogo} style={{ height: "90px" }} />
                            <h1 className="hero-heading"> Welcome To<br /> Khelogy</h1>
                        </div>

                        <p className="d-flex ">Explore a huge library of free online games designed for every type of player. However you love shooting, racing, puzzles, or strategy games — your next favorite game is waiting for you.</p>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
