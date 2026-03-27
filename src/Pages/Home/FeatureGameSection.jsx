import { Col, Container, Row } from "react-bootstrap";
import LazyThumbnail from "../LazyThumbnail";
import { Link } from "react-router-dom";
import React, { useContext, useRef, useState, useEffect } from "react";
import generalGameTHumbnail from "../../assets/defaultGameThumbnail.jpg";
import GameContext from "../../ContextApi/GameContext";

function FeatureGameSection() {
    const { AllGames, updateViewsFn } = useContext(GameContext);

    const featureGames = AllGames?.filter(gameData => gameData.featureGame === "Yes")
    // oh yes

    const chunkGames = (games, size) => {
        const chunks = [];
        for (let i = 0; i < games.length; i += size) {
            chunks.push(games.slice(i, i + size));
        }
        return chunks;
    };
    const featuredGroups = chunkGames(featureGames, 9);

    const scrollRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const THRESHOLD = 2;

    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        const scrollLeft = el.scrollLeft;
        const maxScrollLeft = el.scrollWidth - el.clientWidth;

        setShowLeftArrow(scrollLeft > THRESHOLD);
        setShowRightArrow(scrollLeft < maxScrollLeft - THRESHOLD);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        handleScroll();
        el.addEventListener("scroll", handleScroll);
        return () => el.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -scrollRef.current.offsetWidth, behavior: "smooth" });
            setTimeout(handleScroll, 300);
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: scrollRef.current.offsetWidth, behavior: "smooth" });
            setTimeout(handleScroll, 300);
        }
    };

    return (
        <>
            <section className="d-none d-md-block" style={{ position: "relative" }}>
                <Container fluid>
                    <div className="featured-scroll-container" style={{ position: "relative" }}>
                        {/* Arrows outside the scroll wrapper so they stay fixed */}
                        {showLeftArrow && <button className="scroll-arrow feature-left-arrow" onClick={scrollLeft}>&lt;</button>}

                        {(featuredGroups.length > 0) && <button className="scroll-arrow feature-right-arrow" onClick={scrollRight}>&gt;</button>}

                        <div
                            className="featured-scroll-wrapper"
                            ref={scrollRef}
                            style={{
                                display: "flex",
                                overflowX: "auto",
                                scrollBehavior: "smooth",
                                gap: "1rem",
                                padding: "1rem 0",
                            }}
                        >
                            {featuredGroups.length > 0 ? (
                                featuredGroups.map((group, groupIndex) => (
                                    <div
                                        className="featured-slide"
                                        key={groupIndex}
                                        style={{ minWidth: "100%", flexShrink: 0 }}
                                    >
                                        <Row className="p-3 g-3 mx-5">
                                            {/* LEFT SIDE */}
                                            <Col md={4}>
                                                <Row className="g-3">
                                                    {group.slice(0, 4).map((gameData, ind) => (
                                                        <Col md={6} xs={ind === 0 ? 12 : 4} key={ind}>
                                                            <Link to={`/${gameData.title.en.toLowerCase().replace(/\s+/g, "-")}`}>
                                                                <div
                                                                    className={`GameThumbnail ${ind === 0 ? "lg-thumbnail" : ""}`}
                                                                    onClick={() => updateViewsFn(gameData._id, gameData.gameUrl)}
                                                                >
                                                                    <LazyThumbnail
                                                                        eager="true"
                                                                        src={gameData.thumbnail}
                                                                        blurSrc={gameData.blurThumbnail}
                                                                        bgColor={"#222"}
                                                                        fallback={generalGameTHumbnail}
                                                                        className={`${ind === 0 ? "lg-thumbnail" : ""}`}
                                                                        loading={groupIndex === 0 ? "eager" : "lazy"} // eagerly load first group
                                                                    />
                                                                </div>
                                                            </Link>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </Col>

                                            {/* CENTER */}
                                            <Col md={4}>
                                                {group.slice(4, 5).map((gameData, ind) => (
                                                    <Link
                                                        key={ind}
                                                        to={`/${gameData.title.en.toLowerCase().replace(/\s+/g, "-")}`}
                                                        className="keen-slider__slide"
                                                        style={{ boxShadow: "0 0 4px rgb(0, 0, 0)" }}
                                                    >
                                                        <div
                                                            className="GameThumbnail thumbnailHeight"
                                                            onClick={() => updateViewsFn(gameData._id, gameData.gameUrl)}
                                                        >
                                                            <LazyThumbnail
                                                                eager="true"
                                                                src={gameData.thumbnail}
                                                                blurSrc={gameData.blurThumbnail}
                                                                bgColor={"#222"}
                                                                fallback={generalGameTHumbnail}
                                                                className="thumbnailHeight"
                                                            />
                                                        </div>
                                                    </Link>
                                                ))}
                                            </Col>

                                            {/* RIGHT SIDE */}
                                            <Col md={4}>
                                                <Row className="g-3">
                                                    {group.slice(5, 9).map((gameData, ind) => (
                                                        <Col md={6} xs={ind === 3 ? 12 : 4} key={ind}>
                                                            <Link to={`/${gameData.title.en.toLowerCase().replace(/\s+/g, "-")}`}>
                                                                <div
                                                                    className={`GameThumbnail ${ind === 3 ? "lg-thumbnail" : ""}`}
                                                                    onClick={() => updateViewsFn(gameData._id, gameData.gameUrl)}
                                                                >
                                                                    <LazyThumbnail
                                                                        eager="true"
                                                                        src={gameData.thumbnail}
                                                                        blurSrc={gameData.blurThumbnail}
                                                                        bgColor={"#222"}
                                                                        fallback={generalGameTHumbnail}
                                                                        className={`${ind === 3 ? "lg-thumbnail" : ""}`}
                                                                    />
                                                                </div>
                                                            </Link>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                ))
                            ) : (
                                <div className="featured-slide" style={{ minWidth: "100%", flexShrink: 0 }}>
                                    <Row className="p-3 g-3 mx-5">
                                        <Col md={4}>
                                            <Row className="g-3">
                                                {[1, 2, 3, 4].map((_, ind) => (
                                                    <Col md={6} key={ind}>
                                                        <div className="GameThumbnail" />
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Col>
                                        <Col md={4}>
                                            <div className="GameThumbnail" />
                                        </Col>
                                        <Col md={4}>
                                            <Row className="g-3">
                                                {[1, 2, 3, 4].map((_, ind) => (
                                                    <Col md={6} key={ind}>
                                                        <div className="GameThumbnail" />
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                            )}
                        </div>
                    </div>
                </Container>
            </section >
            <section>
                {/* mobile View */}
                <Container fluid>
                    <h2 className="heading-color d-md-none sub-heading mt-3">Featured Games</h2>
                    <div
                        className="game-scroll-container"
                        style={{
                            display: "flex",
                            overflowX: "auto",
                            gap: "16px",
                            scrollbarWidth: "none", // for Firefox
                            msOverflowStyle: "none", // for IE/Edge
                        }}
                    >
                        {featureGames.length > 0 ? (
                            featureGames?.map((game, ind) => (
                                <div key={ind} className="cat-div-width d-md-none" style={{ flex: "0 0 auto" }}>
                                    <Link to={`/${game.title.en.toLowerCase().replace(/\s+/g, "-")}`}>
                                        <div
                                            className="GameThumbnail"
                                            onClick={() => updateViewsFn(game._id)}
                                        >
                                            <LazyThumbnail
                                                eager="true"
                                                src={game.thumbnail}
                                                blurSrc={game.blurThumbnail}
                                                fallback={generalGameTHumbnail}
                                                className=""
                                            />
                                        </div>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            [1, 2, 3, 4]?.map((game, ind) => (
                                <div key={ind} className="cat-div-width d-md-none" style={{ flex: "0 0 auto" }}>
                                    <div className="GameThumbnail" />
                                </div>
                            ))
                        )}
                    </div>
                </Container>
            </section >
        </>
    );
}

export default React.memo(FeatureGameSection);