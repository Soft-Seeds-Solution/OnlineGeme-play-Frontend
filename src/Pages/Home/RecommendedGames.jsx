import { useContext, useEffect, useState } from "react"
import GameContext from "../../ContextApi/GameContext";
import generalGameTHumbnail from "../../assets/defaultGameThumbnail.jpg";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import LazyThumbnail from "../LazyThumbnail";

export default function RecommendedGames() {
    const { AllGames, updateViewsFn } = useContext(GameContext);
    const [getPlayedGameCat, setGetPlayedGameCat] = useState()
    const [hoveredId, setHoveredId] = useState(null);

    const handleMouseEnter = (index) => {
        setHoveredId(index);
    };

    const handleMouseLeave = () => {
        setHoveredId(null);
    };

    const getMostPlayedCategory = () => {
        const playedGameCats = JSON.parse(localStorage.getItem("gameCat")) || {}

        const categoriesArray = Object.values(playedGameCats)
        const allCats = categoriesArray.sort((a, b) => b.count - a.count)
        console.log(allCats);

        setGetPlayedGameCat(allCats[0])
    }

    useEffect(() => {
        getMostPlayedCategory()
    }, [])

    const filterGames = getPlayedGameCat && AllGames.filter(game => game.categoryId?.category === getPlayedGameCat.category)

    return (
        <>
            {filterGames?.length > 0 && (
                <Container fluid className="my-3 g-3">

                    <div className="px-6 py-3">
                        <h2 className="heading-color sub-heading mt-3">Recommended Games</h2>
                        <div
                            style={{
                                display: "flex",
                                overflowX: "auto",
                                gap: "20px",
                                paddingBottom: "10px"
                            }}
                            className="recommended-scroll"
                        >
                            {filterGames?.map((gameData, ind) => (
                                <div
                                    key={ind}
                                    style={{ minWidth: "185px", flex: "0 0 auto" }}
                                >
                                    <Link
                                        to={`/${gameData.categoryId?.category.toLowerCase()}/${gameData.title.en.toLowerCase().replace(/\s+/g, "-")}`}
                                        onClick={() => updateViewsFn(gameData._id, gameData.gameUrl)}
                                    >
                                        <div
                                            className="GameThumbnail"
                                            // style={{
                                            //     backgroundImage: `url(${gameData.thumbnail ? gameData.thumbnail : generalGameTHumbnail})`,
                                            // }}
                                            onMouseEnter={() => handleMouseEnter(gameData._id)}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <LazyThumbnail
                                                src={gameData.thumbnail}
                                                blurSrc={gameData.blurThumbnail}
                                                fallback={generalGameTHumbnail}
                                                className="GameThumbnail"
                                            />
                                            {gameData.video && hoveredId === gameData._id && (
                                                <video
                                                    className="game-video"
                                                    src={gameData.video}
                                                    autoPlay
                                                    loop
                                                    muted
                                                    playsInline
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                />
                                            )}
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            )}
        </>
    )
}
