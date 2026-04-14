import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GameCatContext from "../../ContextApi/GameCatContext";

export default function CatSection() {
    const { categories, setSelectedCategory } = useContext(GameCatContext);
    const [catSlice, setCatSlice] = useState(9)

    const mainCategories = categories?.filter(cat => cat.parent === null);
    // const displayedCategories = [...categories?.slice(0, 8), "more"];

    useEffect(() => {
        if (window.innerWidth < 680) {
            setCatSlice(6)
        }
    }, [])

    return (
        <>
            <Container>
                <Row className="align-items-center">
                    <Col md={4}>
                        <h4 className="heading-color">Online Games at Khelogy</h4>
                        <p>
                            Khelogy features the latest and best free online games. You can enjoy playing fun games without interruptions from downloads, intrusive ads, or pop-ups. Just load up your favorite games instantly in your web browser and enjoy the experience.
                            You can play our games on desktop and on mobile devices. That includes everything
                        </p>
                    </Col>
                    <Col md={8}>
                        <Row>
                            {mainCategories?.slice(0, catSlice).map((category, index) => (
                                <Col md={4} xs={6} key={index} className="p-3">
                                    <Link to={`/category/${category?.catUrl}`} onClick={() => setSelectedCategory(category?.category)} className="nav-link">
                                        <div className="d-flex px-2 py-3 align-items-center gap-2 mb-3 cat-bar">
                                            <Image src={category?.logo}
                                            //  className="category-icon"
                                            />
                                            {/* <FontAwesomeIcon icon={faGamepad}></FontAwesomeIcon> */}
                                            <h5 className="game-Titles">{category?.category}</h5>
                                        </div>
                                    </Link>
                                </Col>
                            ))}
                            <div className="d-flex justify-content-center"><Link to="/all-categories"> <Button className="btn">View All</Button></Link></div>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    );
}