import { useContext } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import GameContext from "../../ContextApi/GameContext";
import generalGameTHumbnail from "../../assets/defaultGameThumbnail.jpg";
import { Link } from "react-router-dom";
import CatSection from "./CatSection";
import "keen-slider/keen-slider.min.css";
import RecommendedGames from "./RecommendedGames";
import LazyThumbnail from "../LazyThumbnail";
import { Helmet } from 'react-helmet-async';
import FeatureGameSection from "./FeatureGameSection";
import CategoryWiseGames from "./CategoryWiseGames";
import Hero from "./Hero";

export default function GamePage() {
    const { AllGames, updateViewsFn } = useContext(GameContext);

    const uniqueCategories = [];
    const addedIds = new Set();

    AllGames?.forEach(game => {
        const cat = game.categoryId;
        if (cat && !addedIds.has(cat._id)) {
            uniqueCategories.push(cat);
            addedIds.add(cat._id);
        }
    });

    return (
        <div className="page-content">
            <Helmet>
                <title>Play Free Online Games | Action, Puzzle, Arcade & More</title>
                <meta name="description" content="Play free online games on Khelogy including action, puzzle, racing, sports, adventure and arcade games. Enjoy instant browser games without download." />
                <meta name="keywords" content="free online games, play games online, browser games, arcade games online, puzzle games online, action games online, racing games online, sports games online, adventure games online, html5 games" />
                <link rel="canonical" href="https://www.khelogy.com" />
                <meta name="robots" content="index, follow" />
            </Helmet>
            <Hero />
            <FeatureGameSection />

            <section style={{ backgroundColor: "var(--bg-whites)", borderRadius: "5px" }}>
                <Container fluid>
                    <Row className="g-3 justify-content-between p-3 mt-3 px-6">
                        <Col md={6}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h3 className="heading-color sub-heading">Top Views Games</h3>
                                <Link to="/top-views-games"> <Button className="btn">View All</Button></Link>
                            </div>
                            <div
                                className="game-scroll-container"
                                style={{
                                    display: "flex",
                                    overflowX: "auto",
                                    gap: "16px",
                                    scrollbarWidth: "none",
                                    msOverflowStyle: "none",
                                }}
                            >
                                {AllGames?.length > 0
                                    ? AllGames
                                        .sort((a, b) => b.views - a.views)
                                        .slice(0, 20)
                                        .map((game, ind) => (
                                            <div key={ind} className="cat-div-width d-md-none" style={{ flex: "0 0 auto" }}>
                                                <Link to={`/${game.title.en.toLowerCase().replace(/\s+/g, "-")}`}>
                                                    <div
                                                        className="GameThumbnail"
                                                        onClick={() => updateViewsFn(game._id)}
                                                    >
                                                        <LazyThumbnail
                                                            src={game.thumbnail}
                                                            blurSrc={game.blurThumbnail}
                                                            fallback={generalGameTHumbnail}
                                                            className="GameThumbnail"
                                                        />
                                                    </div>
                                                </Link>
                                            </div>
                                        ))
                                    : [1, 2, 3].map((_, ind) => (
                                        <div key={ind} className="cat-div-width d-md-none" style={{ flex: "0 0 auto" }}>
                                            <div className="GameThumbnail skeleton-thumbnail"></div>
                                        </div>
                                    ))}
                            </div>
                            <div className="d-none d-md-block">
                                <Row className="g-3 mt-2 mt-md-0">
                                    {[...AllGames].length > 0 ? (

                                        [...AllGames]?.sort((a, b) => b.views - a.views).slice(0, 9).map((gameData, ind) => (
                                            <Col md={4} key={ind}>
                                                <Link
                                                    to={`/${gameData.title.en.toLowerCase().replace(/\s+/g, "-")}`}
                                                >
                                                    <div
                                                        className={`GameThumbnail ${ind === 3 ? "lg-thumbnail" : ""}`}
                                                        onClick={() => updateViewsFn(gameData._id, gameData.gameUrl)}
                                                    >
                                                        <LazyThumbnail
                                                            src={gameData.thumbnail}
                                                            blurSrc={gameData.blurThumbnail}
                                                            fallback={generalGameTHumbnail}
                                                            className={`${ind === 3 ? "lg-thumbnail" : ""}`}
                                                        />
                                                    </div>
                                                </Link>
                                            </Col>
                                        ))
                                    ) : (
                                        [1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((gameData, ind) => (
                                            <Col md={4} xs={12} key={ind}>
                                                <div
                                                    className={`d-none d-md-block GameThumbnail ${ind === 3 ? "lg-thumbnail" : ""}`}
                                                >
                                                </div>
                                            </Col>
                                        ))
                                    )}
                                </Row>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h3 className="heading-color sub-heading">Popular Games</h3>
                                <Link to="/popular-games"> <Button className="btn">View All</Button></Link>
                            </div>
                            <div
                                className="game-scroll-container"
                                style={{
                                    display: "flex",
                                    overflowX: "auto",
                                    gap: "16px",
                                    scrollbarWidth: "none",
                                    msOverflowStyle: "none",
                                }}
                            >
                                {AllGames?.length > 0
                                    ? AllGames
                                        .sort((a, b) => b.likes - a.likes)
                                        .slice(0, 20)
                                        .map((game, ind) => (
                                            <div key={ind} className="cat-div-width d-md-none" style={{ flex: "0 0 auto" }}>
                                                <Link to={`/${game.title.en.toLowerCase().replace(/\s+/g, "-")}`}>
                                                    <div
                                                        className="GameThumbnail"
                                                        onClick={() => updateViewsFn(game._id)}
                                                    >
                                                        <LazyThumbnail
                                                            src={game.thumbnail}
                                                            blurSrc={game.blurThumbnail}
                                                            fallback={generalGameTHumbnail}
                                                            className="GameThumbnail"
                                                        />
                                                    </div>
                                                </Link>
                                            </div>
                                        ))
                                    : [1, 2, 3].map((_, ind) => (
                                        <div key={ind} className="cat-div-width d-md-none" style={{ flex: "0 0 auto" }}>
                                            <div className="GameThumbnail skeleton-thumbnail"></div>
                                        </div>
                                    ))}
                            </div>

                            <div className="d-none d-md-block">
                                <Row className="g-3 mt-2 mt-md-0">
                                    {[...AllGames].length > 0 ? (

                                        [...AllGames]?.sort((a, b) => b.likes - a.likes).slice(0, 9).map((gameData, ind) => (
                                            <Col md={4} xs={12} key={ind} className="d-none d-md-block">
                                                <Link
                                                    to={`/${gameData.title.en.toLowerCase().replace(/\s+/g, "-")}`}
                                                >
                                                    <div
                                                        className={`GameThumbnail ${ind === 3 ? "lg-thumbnail" : ""}`}
                                                        onClick={() => updateViewsFn(gameData._id, gameData.gameUrl)}
                                                    >
                                                        <LazyThumbnail
                                                            src={gameData.thumbnail}
                                                            blurSrc={gameData.blurThumbnail}
                                                            fallback={generalGameTHumbnail}
                                                            className={`${ind === 3 ? "lg-thumbnail" : ""}`}
                                                        />
                                                    </div>
                                                </Link>
                                            </Col>
                                        ))
                                    ) : (
                                        [1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((gameData, ind) => (
                                            <Col md={4} xs={12} key={ind}>
                                                <div
                                                    className={`d-none d-md-block GameThumbnail ${ind === 0 ? "lg-thumbnail" : ""}`}
                                                >
                                                </div>
                                            </Col>
                                        ))
                                    )}
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <Container fluid>
                <RecommendedGames />

                <div style={{ backgroundColor: "var(--border)" }} className="my-5">
                    <hr />
                </div>

                <CatSection />

                <div style={{ backgroundColor: "var(--border)" }} className="my-5">
                    <hr />
                </div>
                <CategoryWiseGames />
            </Container >
        </div >
    );
}