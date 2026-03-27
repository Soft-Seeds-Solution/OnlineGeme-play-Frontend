import { Container, Row, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext } from "react";
import GameCatContext from "../ContextApi/GameCatContext";

function AllCategories() {
    const { categories } = useContext(GameCatContext);
    const mainCategories = categories?.filter(cat => cat.parent === null);

    return (
        <Container fluid className="page-content">
            <Row className="justify-content-center pt-5">
                <Col md={8} className="p-4" style={{ backgroundColor: "var(--light-bg)", borderRadius: "15px" }}>
                    <h1 className="heading-color">All Categories</h1>
                    <Row>
                        {mainCategories?.map((category, index) => (
                            <Col md={3} xs={6} key={index} className="p-3">
                                <Link to={`/category/${category?.catUrl}`} className="nav-link">
                                    <div className="d-flex px-2 py-3 align-items-center gap-2 mb-3 cat-bar">
                                        <Image src={category?.logo}
                                            style={{
                                                width: "20%",
                                                backgroundColor: "var(--blue-color)",
                                                borderRadius: "50px"
                                            }}
                                            className="p-2"
                                        />
                                        <h5 className="game-Titles">{category?.category}</h5>
                                    </div>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row >
        </Container >
    );
}

export default AllCategories;