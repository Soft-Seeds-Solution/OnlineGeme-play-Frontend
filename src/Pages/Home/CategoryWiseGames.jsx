import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LazyThumbnail from "../LazyThumbnail";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import generalGameTHumbnail from "../../assets/defaultGameThumbnail.jpg";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import GameContext from "../../ContextApi/GameContext";

export default function CategoryWiseGames() {
    const { AllGames, updateViewsFn } = useContext(GameContext);
    const [scrollStates, setScrollStates] = useState({});
    const scrollRefs = useRef([]);
    const [hoveredGameCatIndex, setHoveredGameCatIndex] = useState("")
    const groupGameWithCat = AllGames
        ?.filter(game => game.featureGame !== "Yes" && game.categories?.length > 0)
        .reduce((acc, game) => {

            game.categories.forEach(cat => {

                // only show root categories as sections
                if (cat.ancestors.length !== 0) return;

                const catName = cat.category;
                const catUrl = cat.catUrl || cat.category.toLowerCase().replace(/\s+/g, "-");

                if (!acc[catName]) {
                    acc[catName] = {
                        catUrl,
                        games: [],
                    };
                }

                acc[catName].games.push(game);

            });

            return acc;

        }, {});

    const getVisibleCardsCount = () => {
        if (window.innerWidth < 576) return 2;
        if (window.innerWidth < 768) return 3;
        if (window.innerWidth < 992) return 4;
        return 6;
    };
    const scrollLeft = (index) => {
        const container = scrollRefs.current[index];
        if (container) {
            const cardWidth = container.querySelector(".cat-div-width")?.offsetWidth || 200;
            const visibleCards = getVisibleCardsCount();
            container.scrollBy({ left: -cardWidth * visibleCards, behavior: "smooth" });
        }
    };

    const scrollRight = (index) => {
        const container = scrollRefs.current[index];
        if (container) {
            const cardWidth = container.querySelector(".cat-div-width")?.offsetWidth || 200;
            const visibleCards = getVisibleCardsCount();
            container.scrollBy({ left: cardWidth * visibleCards, behavior: "smooth" });
        }
    };

    const handleScroll = (index) => {
        const container = scrollRefs.current[index];
        if (container) {
            const atStart = container.scrollLeft <= 0;
            const atEnd = container.scrollLeft + container.offsetWidth >= container.scrollWidth - 10;

            setScrollStates((prev) => ({
                ...prev,
                [index]: { atStart, atEnd },
            }));
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            requestAnimationFrame(() => {
                Object.keys(groupGameWithCat).forEach((_, index) => {
                    handleScroll(index);
                });
            });
        }, 0);

        return () => clearTimeout(timeout);
    }, [groupGameWithCat]);
    return (
        <>
            {/* here category wise content */}
            <div>
                {Object.entries(groupGameWithCat).map(([categoryName, { catUrl, games }], index) => {
                    if (!scrollRefs.current[index]) scrollRefs.current[index] = React.createRef();

                    return (
                        <div
                            key={index}
                            className="mb-4 p-3"
                            style={{
                                backgroundColor: Math.floor(index / 1) % 2 === 0 ? "var(--bg-whites)" : "transparent",
                                borderRadius: "10px"
                            }}

                            onMouseEnter={() => setHoveredGameCatIndex(categoryName)}
                            onMouseLeave={() => setHoveredGameCatIndex("")}
                        >
                            <div className="d-flex px-6 justify-content-between align-items-center mb-3">
                                <h3 className="heading-color sub-heading">{categoryName}</h3>
                                <Link to={`/category/${catUrl}`}>
                                    <Button className="btn">View All</Button>
                                </Link>
                            </div>

                            <div className="position-relative px-6">
                                {/* Left L-Shaped Arrow */}

                                {/* Game Scroll Container */}
                                <div
                                    className="scrollbar-container"
                                    ref={(el) => (scrollRefs.current[index] = el)}
                                    onScroll={() => handleScroll(index)}
                                    style={{
                                        display: "flex",
                                        overflowX: "auto",
                                        gap: "20px",
                                        paddingBottom: "10px",
                                        scrollbarWidth: "none"
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faAngleLeft}
                                        className={`slider-arrow left-arrow ${hoveredGameCatIndex === categoryName &&
                                            games.length > 6 &&
                                            !scrollStates[index]?.atStart
                                            ? "d-block"
                                            : "d-none"
                                            }`}
                                        onClick={() => scrollLeft(index)}
                                    />
                                    {games.slice(0, 24).map((game, ind) => (
                                        <div key={ind} className="cat-div-width" style={{ flex: "0 0 auto" }}>
                                            <Link to={`/${game.title.en.toLowerCase().replace(/\s+/g, "-")}`} draggable={false}
                                                onDragStart={(e) => e.preventDefault()}
                                            >
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
                                    ))}
                                    <FontAwesomeIcon
                                        icon={faAngleRight}
                                        className={`slider-arrow right-arrow ${hoveredGameCatIndex === categoryName &&
                                            games.length > 6 &&
                                            !scrollStates[index]?.atEnd
                                            ? "d-block"
                                            : "d-none"
                                            }`}
                                        onClick={() => scrollRight(index)}
                                    />

                                </div>

                                {/* Right L-Shaped Arrow */}

                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    )
}
