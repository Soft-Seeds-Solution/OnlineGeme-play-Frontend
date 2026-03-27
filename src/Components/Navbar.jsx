import { useContext, useEffect, useState } from "react";
import { Navbar, Nav, Container, Offcanvas, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import GameContext from "../ContextApi/GameContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import generalGameTHumbnail from "../assets/defaultGameThumbnail.jpg";
// import LOGO from "../../src/assets/Images/AIG-Logo.png";

function UserNavbar() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 992);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false)
        setSearchTitle("")
    };

    const handleShow = () => setShow(true);
    const { AllGames } = useContext(GameContext)
    const [searchTitle, setSearchTitle] = useState("")
    const filterGames = AllGames?.filter(gameData => gameData.title.toLowerCase().includes(searchTitle.toLowerCase()))
    const getUniqueCategories = new Set(AllGames?.map(gameData => gameData.categoryId?.category))
    return (
        <>
            <Container fluid>
                <Row>
                    <Col md={3}>

                    </Col>
                    <Col md={9}>
                        <Navbar expand="lg" className="main-nav py-2">
                            <Container fluid>
                                <Navbar.Brand as={Link} to="/">
                                    <h5>Site Logo</h5>
                                </Navbar.Brand>

                                {/* Search Icon */}
                                <FontAwesomeIcon className="site-icons me-2 d-lg-none" icon={faSearch} onClick={handleShow} style={{ cursor: "pointer" }} />

                                {!isMobile ? (
                                    <Navbar.Collapse id="basic-navbar-nav">
                                        <Nav className="me-auto mx-auto">
                                            {Array.from(getUniqueCategories)?.map((category, ind) => (
                                                <Nav.Link key={ind} as={Link} to={`/category-wise-game/${category.replace(/\s+/g, "-")}`} className="nav-link">
                                                    {category}
                                                </Nav.Link>
                                            ))}
                                        </Nav>
                                        <FontAwesomeIcon className="site-icons me-2 d-none d-lg-inline" icon={faSearch} onClick={handleShow} style={{ cursor: "pointer" }} />
                                    </Navbar.Collapse>
                                ) : (
                                    <div className="mobile-category-scroll">
                                        {Array.from(getUniqueCategories)?.map((category, ind) => (
                                            <Link key={ind} to={`/category-wise-game/${category.replace(/\s+/g, "-")}`} className="category-link">
                                                {category}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </Container>
                        </Navbar>
                    </Col>
                </Row>
            </Container>

            {/* search bar canvas */}
            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Search Games</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form>
                        <Form.Control size="lg" placeholder="What are you playing today?" onChange={(e) => setSearchTitle(e.target.value)} />
                    </Form>

                    {/* filter games */}
                    {searchTitle && (
                        <Container>
                            <Row className="g-3 mt-4">
                                {filterGames?.map((gameData, ind) => (
                                    <Col key={ind} md={4}>
                                        <Link
                                            to={`/${gameData.title.replace(/\s+/g, "-")}`}
                                            onClick={handleClose}
                                        >
                                            <div
                                                className="GameThumbnail"
                                                style={{
                                                    backgroundImage: `url(${gameData.thumbnail ? gameData.thumbnail : generalGameTHumbnail})`,
                                                }}
                                            ></div>
                                        </Link>
                                    </Col>
                                ))}
                            </Row>
                        </Container>
                    )}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default UserNavbar;
