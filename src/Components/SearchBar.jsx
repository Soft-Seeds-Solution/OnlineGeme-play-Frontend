import { faHome, faSearch, faThLarge } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { Card, Col, Container, Form, Offcanvas, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import GameContext from "../ContextApi/GameContext";
import generalGameTHumbnail from "../assets/defaultGameThumbnail.jpg";

export default function SearchBar() {
    const [show, setShow] = useState(false);
    const [catShow, setCatShow] = useState(false);
    const handleClose = () => {
        setShow(false)
        setSearchTitle("")
    };
    const handleCatClose = () => {
        setCatShow(false)
    };
    const handleShow = () => setShow(true);
    const handleCatShow = () => setCatShow(true);
    const { AllGames } = useContext(GameContext)
    const [searchTitle, setSearchTitle] = useState("")
    const filterGames = AllGames?.filter(gameData => gameData.title.toLowerCase().includes(searchTitle.toLowerCase()))
    const getUniqueCategories = new Set(AllGames?.map(gameData => gameData.categoryId?.category))
    return (
        <>
            <div className="searchBar">
                <h5 className="text-center">Games</h5>
                <div className="d-flex align-items-center">
                    <Link to="/"> <FontAwesomeIcon icon={faHome} className="me-2 site-icons" /></Link>
                    <div style={{ width: "1px", height: "20px", backgroundColor: "black" }} className="me-2"></div>
                    <FontAwesomeIcon className="site-icons me-2" icon={faSearch} onClick={handleShow} style={{ cursor: "pointer" }} />
                    <div style={{ width: "1px", height: "20px", backgroundColor: "black" }} className="me-2"></div>
                    <FontAwesomeIcon className="site-icons me-2" icon={faThLarge} onClick={handleCatShow} style={{ cursor: "pointer" }} />
                </div>
            </div>

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

            {/* game cat canvas */}
            <Offcanvas show={catShow} onHide={handleCatClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Game Categories</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Container>
                        <Row className="g-3 mt-4">
                            {Array.from(getUniqueCategories).map((cat, ind) => (
                                <Col key={ind} md={12}>
                                    <Link onClick={handleCatClose} to={`/category-wise-game/${cat.replace(/\s+/g, "-")}`} style={{ textDecoration: "none" }}>
                                        <Card style={{ border: "1px solid var(--theme-color)" }}>
                                            <Card.Body className="d-flex justify-content-center align-items-center">
                                                <h5 className="text-center" style={{ cursor: "pointer", color: "initial" }}>{cat}</h5>
                                            </Card.Body>
                                        </Card>
                                    </Link>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </Offcanvas.Body>
            </Offcanvas >
        </>
    )
}
