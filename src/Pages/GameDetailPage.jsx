import { Link, useParams } from "react-router-dom";
import { useContext, useRef, useState, useEffect } from "react";
import GameContext from "../ContextApi/GameContext";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import generalGameThumbnail from "../assets/defaultGameThumbnail.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faEye, faShare, faStar, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import UserContext from "../ContextApi/UserContext";
import TrackContext from "../ContextApi/TrackContext";
import FavouriteContext from "../ContextApi/FavouriteContext";
import { Helmet } from 'react-helmet-async';

export default function GameDetailPage() {
    const { title } = useParams();
    const gameTitle = title.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const { AllGames, updateLikesFn, updatePlayedFn, updateBackLikesFn, updateBackDisLikes, alreadyPlayed, setAlreadyPlayed, updateViewsFn } = useContext(GameContext);
    const { signUser } = useContext(UserContext);
    const { trackRecordFn } = useContext(TrackContext);
    const { trackFavouriteFn } = useContext(FavouriteContext);

    const isMobile = window.innerWidth <= 768;
    const iframeRef = useRef(null);
    const divRef = useRef(null);
    const fullscreenRef = isMobile ? iframeRef : divRef;
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [orientation, setOrientation] = useState("landscape");
    const [showGame, setShowGame] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [likedGames, setLikedGames] = useState(() => {
        const stored = JSON.parse(localStorage.getItem("likeStore"));
        return stored || [];
    });
    const [disLikedGames, setDisLikedGames] = useState(() => {
        const stored = JSON.parse(localStorage.getItem("disLikeStore"));
        return stored || [];
    });

    const toggleFullscreen = () => {
        const el = fullscreenRef.current;

        if (!document.fullscreenElement || document.fullscreenElement !== el) {
            // Enter fullscreen
            el?.requestFullscreen?.()
                .then(() => {
                    setIsFullscreen(true);

                    // Lock orientation based on game setting
                    if (screen.orientation?.lock) {
                        const targetOrientation = orientation === "potrait" ? "portrait" : "landscape";
                        screen.orientation.lock(targetOrientation).catch((err) =>
                            console.warn("Orientation lock failed:", err)
                        );
                    }

                    setTimeout(() => {
                        const iframe = el.querySelector("iframe");
                        iframe?.focus?.();
                    }, 500);
                })
                .catch(err => console.error("Error enabling full-screen:", err));
        } else {
            // Exit fullscreen
            document.exitFullscreen()
                .then(() => {
                    setIsFullscreen(false);

                    // Reset orientation back to portrait (normal mobile)
                    if (screen.orientation?.lock) {
                        screen.orientation.lock("portrait").catch((err) =>
                            console.warn("Orientation reset failed:", err)
                        );
                    }

                    setTimeout(() => {
                        const iframe = el.querySelector("iframe");
                        iframe?.focus?.();
                    }, 500);
                })
                .catch(err => console.error("Error exiting full-screen:", err));
        }
    };

    const selectedGame = AllGames?.find(gameData => gameData.title?.en.toLowerCase() === gameTitle.toLowerCase())

    const otherGames = AllGames?.filter(gameData => gameData.title.en.toLowerCase() !== gameTitle.toLowerCase()).filter(gameData => gameData.gameUrl !== selectedGame?.gameUrl);

    useEffect(() => {
        if (selectedGame) {
            setOrientation(selectedGame.orientation);
        }
    }, [selectedGame]);

    useEffect(() => {
        const updateIframeHeight = () => {
            const wrapper = document.querySelector(".iframe-wrapper");
            if (wrapper && document.fullscreenElement && isMobile) {
                wrapper.style.height = `${window.innerHeight}px`;
            }
        };

        updateIframeHeight();
        window.addEventListener("resize", updateIframeHeight);

        return () => window.removeEventListener("resize", updateIframeHeight);
    }, [isMobile]);

    // --- Put this inside your component (replace previous fullscreen-related useEffects) ---
    useEffect(() => {
        if (!isMobile) return;
        const wrapperSelector = ".iframe-wrapper";
        const iframeSelector = ".game-iframe";

        // When entering fullscreen: expand wrapper/iframe to real visual viewport height
        const handleEnter = () => {
            const wrapper = document.querySelector(".iframe-wrapper");
            const iframe = document.querySelector(".game-iframe");
            setIsFullscreen(true);

            const vh = (window.visualViewport && window.visualViewport.height)
                ? window.visualViewport.height
                : window.innerHeight;

            if (wrapper) wrapper.style.height = `${vh}px`;
            if (iframe) iframe.style.height = `${vh}px`;

            document.documentElement.style.overflow = "hidden";
            document.body.style.overflow = "hidden";

            // ✅ Hide icon bar during fullscreen
            const iconBar = document.querySelector(".icon-bar");
            if (iconBar) iconBar.style.display = "none";
        };

        // When exiting fullscreen: restore exact preview view
        const handleExit = () => {
            setIsFullscreen(false);

            // Try to unlock orientation
            if (screen.orientation && screen.orientation.unlock) {
                try { screen.orientation.unlock(); } catch (e) { }
            } else if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock("portrait").catch(() => { });
            }

            // Restore normal scrolling
            document.documentElement.style.overflow = "auto";
            document.body.style.overflow = "auto";
            document.documentElement.style.height = "auto";
            document.body.style.height = "auto";

            // Reset zoom/transform
            document.body.style.transform = "none";
            document.body.style.zoom = "1";
            document.documentElement.style.zoom = "1";

            // Reset viewport
            const meta = document.querySelector('meta[name="viewport"]');
            if (meta) {
                meta.setAttribute(
                    "content",
                    "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
                );
            }

            // Restore iframe size
            const wrapper = document.querySelector(".iframe-wrapper");
            const iframe = document.querySelector(".game-iframe");
            if (wrapper) {
                wrapper.style.height = "200px";
                wrapper.style.maxWidth = "100%";
                wrapper.style.overflow = "hidden";
            }
            if (iframe) {
                iframe.style.height = "200px";
                iframe.style.width = "100%";
                iframe.style.objectFit = "cover";
            }

            // ✅ Ensure icon bar reappears
            const iconBar = document.querySelector(".icon-bar");
            if (iconBar) iconBar.style.display = "flex";

            // Re-enable scroll in case any delay happens
            setTimeout(() => {
                document.documentElement.style.overflow = "auto";
                document.body.style.overflow = "auto";
            }, 500);
        };

        // fullscreenchange listener that decides enter/exit
        const onFullScreenChange = () => {
            // On some devices, document.fullscreenElement may refer to different element; test truthiness
            if (document.fullscreenElement) {
                handleEnter();
            } else {
                handleExit();
            }
        };

        // Visual viewport resize -> if not fullscreen ensure wrapper is 200px
        const onVisualResize = () => {
            if (!document.fullscreenElement) {
                const wrapper = document.querySelector(wrapperSelector);
                const iframe = document.querySelector(iframeSelector);
                if (wrapper) wrapper.style.height = "200px";
                if (iframe) iframe.style.height = "200px";
            }
        };

        // Window resize and orientation change fallback
        const onWindowResize = () => {
            // if user didn't enter fullscreen, keep iframe at 200px
            if (!document.fullscreenElement) {
                const wrapper = document.querySelector(wrapperSelector);
                const iframe = document.querySelector(iframeSelector);
                if (wrapper) wrapper.style.height = "200px";
                if (iframe) iframe.style.height = "200px";
            }
        };

        document.addEventListener("fullscreenchange", onFullScreenChange);
        window.addEventListener("resize", onWindowResize);
        window.addEventListener("orientationchange", onWindowResize);
        if (window.visualViewport) {
            window.visualViewport.addEventListener("resize", onVisualResize);
        }

        // Clean up
        return () => {
            document.removeEventListener("fullscreenchange", onFullScreenChange);
            window.removeEventListener("resize", onWindowResize);
            window.removeEventListener("orientationchange", onWindowResize);
            if (window.visualViewport) {
                window.visualViewport.removeEventListener("resize", onVisualResize);
            }
        };
    }, [isMobile]);

    const playBtnClick = (userId, gameId, gameUrl) => {
        setShowGame(true);
        setIsFullscreen(false);
        trackRecordFn(userId, gameId);
        updatePlayedFn(gameId, gameUrl);

        if (window.gtag) {
            window.gtag("event", "play_game", {
                event_category: "Game",
                // event_label: gameCat,
                value: gameId,
            });
            // console.log("🎮 Game play event tracked:", gameCat);
        }

        // Save play count by category
        // const isAlreadyHaveCat = JSON.parse(localStorage.getItem("gameCat")) || {};
        // if (isAlreadyHaveCat[gameCat]) {
        //     isAlreadyHaveCat[gameCat].count += 1;
        // } else {
        //     isAlreadyHaveCat[gameCat] = { count: 1, category: gameCat };
        // }
        // localStorage.setItem("gameCat", JSON.stringify(isAlreadyHaveCat));

        // ✅ Automatically go fullscreen on mobile only
        if (isMobile) {
            setTimeout(() => {
                toggleFullscreen(); // call fullscreen logic after showing iframe
            }, 300);
        }
    };

    const likeAndStore = (id) => {
        setLikedGames(prevLikedGames => {
            let updatedLikes = [...prevLikedGames];
            let updatedDislikes = [...disLikedGames];

            if (prevLikedGames.includes(id)) {
                // Remove like
                updatedLikes = prevLikedGames.filter(gameId => gameId !== id);
                updateBackLikesFn(id);
            } else {
                // Add like and remove dislike if it exists
                updatedLikes.push(id);
                updateLikesFn(id);

                if (updatedDislikes.includes(id)) {
                    updatedDislikes = updatedDislikes.filter(gameId => gameId !== id);
                    updateBackDisLikes(id);
                }
            }

            // Update both localStorage and state
            localStorage.setItem("likeStore", JSON.stringify(updatedLikes));
            localStorage.setItem("disLikeStore", JSON.stringify(updatedDislikes));
            setDisLikedGames(updatedDislikes);

            return updatedLikes;
        });
    };

    useEffect(() => {
        setShowGame(false);
    }, [title]);

    useEffect(() => {
        const handleEscFullscreen = () => {
            if (!document.fullscreenElement) {
                setIsFullscreen(false);
            } else {
                setIsFullscreen(true);
            }
        };

        document.addEventListener("fullscreenchange", handleEscFullscreen);

        return () => {
            document.removeEventListener("fullscreenchange", handleEscFullscreen);
        };
    }, []);

    return (
        <main>
            <div className="px-6 mt-4">
                {selectedGame && (
                    <Helmet>
                        {/* Title */}
                        <title>{`${selectedGame?.title.en} – Play Online Free | Khelogy`}</title>
                        {selectedGame.gameIndex === "Index" ? (
                            <meta name="robots" content="index, follow"></meta>
                        ) : (
                            <meta name="robots" content="noindex, nofollow"></meta>
                        )}
                        {/* Meta */}
                        <meta
                            name="description"
                            content={selectedGame.shortDes.en?.slice(0, 160)}
                        />

                        {/* Canonical */}
                        <link
                            rel="canonical"
                            href={`https://www.khelogy.com/${selectedGame.title.en.toLowerCase().replace(/\s+/g, "-")}`}
                        />

                        {/* Open Graph */}
                        <meta property="og:type" content="article" />
                        <meta property="og:title" content={selectedGame.title.en} />
                        <meta property="og:description" content={selectedGame.shortDes.en} />
                        <meta property="og:image" content={selectedGame.thumbnail} />
                        <meta property="og:url" content={window.location.href} />
                        <meta property="og:site_name" content="Khelogy" />

                        {/* Twitter */}
                        <meta name="twitter:card" content="summary_large_image" />
                        <meta name="twitter:title" content={selectedGame.title.en} />
                        <meta name="twitter:description" content={selectedGame.shortDes.en} />
                        <meta name="twitter:image" content={selectedGame.thumbnail} />

                        {/* Article Schema */}
                        <script type="application/ld+json">
                            {JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "VideoGame",
                                "name": selectedGame.title.en,
                                "description": selectedGame.shortDes.en,
                                "image": selectedGame.thumbnail,
                                "url": window.location.href,
                                "author": {
                                    "@type": "Organization",
                                    "name": "Khelogy"
                                },
                                "publisher": {
                                    "@type": "Organization",
                                    "name": "Khelogy",
                                    "logo": {
                                        "@type": "ImageObject",
                                        "url": "https://www.khelogy.com/logo.png"
                                    }
                                }
                            })}
                        </script>
                    </Helmet>
                )}

                <Container fluid className="page-content px-3">
                    {selectedGame ? (
                        <div>
                            <div className={`${orientation}`}>
                                {!showGame && <Row className="justify-content-center">
                                    <Col md={8}>
                                        <div className="game-preview-card position-relative">
                                            {selectedGame?.video ? (
                                                <video
                                                    src={selectedGame.video}
                                                    autoPlay
                                                    muted
                                                    loop
                                                    playsInline
                                                    className="w-100 h-100 object-fit-cover rounded"
                                                />
                                            ) : (
                                                <img
                                                    src={selectedGame.thumbnail || generalGameThumbnail}
                                                    alt={selectedGame.keywords.en}
                                                    loading="lazy"
                                                    className="w-100 h-100 object-fit-cover rounded"
                                                />
                                            )}
                                            <div className="play-overlay position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center">
                                                <div>
                                                    <div className="d-flex justify-content-center">
                                                        <Image alt={selectedGame.keywords.en} src={selectedGame.thumbnail ? selectedGame.thumbnail : generalGameThumbnail} style={{ width: "190px", maxHeight: "200px" }} loading="lazy" />
                                                    </div>
                                                    <h2 className="text-white text-center my-3 game-Titles">{selectedGame.title.en}</h2>
                                                    <div className="d-flex justify-content-center">
                                                        <Button className="primary-btn px-4 py-2 fs-5" onClick={() => playBtnClick(signUser?._id, selectedGame._id, selectedGame.gameUrl)}>
                                                            {/* <Button className="primary-btn px-4 py-2 fs-5" onClick={() => playBtnClick(signUser?._id, selectedGame._id, selectedGame.categoryId?.category, selectedGame.gameUrl)}> */}
                                                            ▶ Play
                                                        </Button>
                                                    </div>
                                                    <div style={{ position: "absolute", bottom: 0, left: "0", width: "100%", backgroundColor: "var(--dark-bg)" }}>
                                                        <div className="py-2 d-flex justify-content-center">
                                                            <FontAwesomeIcon icon={faThumbsUp} className="me-2" style={{
                                                                fontSize: "20px",
                                                            }} onClick={() => likeAndStore(selectedGame._id)} data-bs-toggle="tooltip" data-bs-placement="top" title="Likes" />
                                                            <p className="text-white me-3">{selectedGame.likes}</p>
                                                            <FontAwesomeIcon icon={faEye} className="text-white me-2" style={{ fontSize: "20px" }} data-bs-toggle="tooltip" data-bs-placement="top" title="Views" />
                                                            <p className="text-white me-3">{selectedGame.views}</p>
                                                            <FontAwesomeIcon icon={faStar} className="text-white me-3" style={{ fontSize: "20px" }} onClick={() => trackFavouriteFn(signUser?._id, selectedGame._id)} data-bs-toggle="tooltip" data-bs-placement="top" title="Add To Favourites" />
                                                            <FontAwesomeIcon
                                                                icon={faShare}
                                                                className="text-white"
                                                                style={{ fontSize: "20px", cursor: "pointer" }}
                                                                onClick={() => {
                                                                    if (navigator.share) {
                                                                        navigator.share({
                                                                            title: selectedGame.title,
                                                                            text: "Check out this game!",
                                                                            url: window.location
                                                                        });
                                                                    } else {
                                                                        alert("Sharing not supported on this browser");
                                                                    }
                                                                }}
                                                                data-bs-toggle="tooltip"
                                                                data-bs-placement="top"
                                                                title="Share Game"
                                                            />

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                }

                                <div>
                                    <div style={{ display: showGame ? "flex" : "none" }} ref={!isMobile ? fullscreenRef : null} className={`${showGame ? "d-lg-flex" : ""} justify-content-center`}>
                                        <Col md={isFullscreen ? 12 : 8} className={` ${isFullscreen ? " mt-lg-5" : "iframe-wrapper"}`}>
                                            <div className="d-flex justify-content-center">
                                                <iframe
                                                    key={selectedGame._id}
                                                    ref={isMobile ? fullscreenRef : null}
                                                    src={selectedGame.gameUrl}

                                                    className="game-iframe"
                                                    allow="autoplay; fullscreen; pointer-lock; encrypted-media; accelerometer; gamepad"
                                                    style={
                                                        isMobile
                                                            ? selectedGame.orientation === "potrait" ? { height: "230px" } : { height: "200px" }
                                                            : isFullscreen
                                                                ? selectedGame.orientation === "potrait"
                                                                    ? { height: "calc(100vh - 100px)", width: "500px" }
                                                                    : { height: "calc(100vh - 100px)" }
                                                                : selectedGame.orientation === "potrait" ? { width: "50%", height: "520px" } : { width: "100%", height: "480px" }
                                                    }
                                                    title="Game"
                                                />
                                            </div>
                                            {/* {showGame && !isFullscreen && isMobile && ( */}
                                            <div className="d-md-none d-flex justify-content-end" style={{ backgroundColor: "black", width: "100%", bottom: 0, zIndex: 10 }}>
                                                <FontAwesomeIcon
                                                    icon={faExpand}
                                                    className="p-1 text-end"
                                                    onClick={toggleFullscreen}
                                                    style={{ fontSize: "24px", color: "#fff", cursor: "pointer" }}
                                                />
                                            </div>
                                            {/* )} */}

                                            {isFullscreen && (

                                                <div className="iframe-mask-bottom d-none d-md-block">
                                                    <div className="py-2 d-flex justify-content-center">
                                                        <FontAwesomeIcon icon={faThumbsUp} className="me-2" style={{
                                                            fontSize: "20px",
                                                            color: likedGames?.includes(selectedGame._id) ? "var(--icon-color)" : "#ffffff"
                                                        }} onClick={() => likeAndStore(selectedGame._id)} data-bs-toggle="tooltip" data-bs-placement="top" title="Likes" />
                                                        <p className="text-white me-3">{selectedGame.likes}</p>
                                                        <FontAwesomeIcon icon={faEye} className="text-white me-2" style={{ fontSize: "20px" }} data-bs-toggle="tooltip" data-bs-placement="top" title="Views" />
                                                        <p className="text-white me-3">{selectedGame.views}</p>
                                                        <FontAwesomeIcon icon={faStar} className="text-white me-3" style={{ fontSize: "20px" }} onClick={() => trackFavouriteFn(signUser?._id, selectedGame._id)} data-bs-toggle="tooltip" data-bs-placement="top" title="Add To Favourites" />
                                                        <FontAwesomeIcon
                                                            icon={faShare}
                                                            className="text-white me-3"
                                                            style={{ fontSize: "20px", cursor: "pointer" }}
                                                            onClick={() => {
                                                                if (navigator.share) {
                                                                    navigator.share({
                                                                        title: selectedGame.title,
                                                                        text: "Check out this game!",
                                                                        url: window.location
                                                                    });
                                                                } else {
                                                                    alert("Sharing not supported on this browser");
                                                                }
                                                            }}
                                                            data-bs-toggle="tooltip"
                                                            data-bs-placement="top"
                                                            title="Share Game"
                                                        />
                                                        <FontAwesomeIcon
                                                            icon={faExpand}
                                                            className="text-white me-3"
                                                            style={{ fontSize: "20px", cursor: "pointer" }}
                                                            onClick={toggleFullscreen}
                                                            title={isFullscreen ? "Exit Full" : "Fullscreen"}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </Col>
                                    </div>
                                    {(showGame && !isFullscreen) && (

                                        <div className="d-flex justify-content-center">
                                            <Col md={8} className="iframe-maskk-bottom d-none d-md-block">
                                                <div className="py-2 d-flex justify-content-center">
                                                    <FontAwesomeIcon icon={faThumbsUp} className="me-2" style={{
                                                        fontSize: "20px",
                                                        color: likedGames?.includes(selectedGame._id) ? "var(--icon-color)" : "#ffffff"
                                                    }} onClick={() => likeAndStore(selectedGame._id)} data-bs-toggle="tooltip" data-bs-placement="top" title="Likes" />
                                                    <p className="text-white me-3">{selectedGame.likes}</p>
                                                    {/* <FontAwesomeIcon icon={faThumbsDown} className="me-2" style={{
                                                    fontSize: "20px",
                                                    color: disLikedGames?.includes(selectedGame._id) ? "var(--icon-color)" : "#ffffff"
                                                }} onClick={() => disLikeAndStore(selectedGame._id)} data-bs-toggle="tooltip" data-bs-placement="top" title="Dislike" /> */}
                                                    {/* <p className="text-white me-3">{selectedGame.disLikes}</p> */}
                                                    <FontAwesomeIcon icon={faEye} className="text-white me-2" style={{ fontSize: "20px" }} data-bs-toggle="tooltip" data-bs-placement="top" title="Views" />
                                                    <p className="text-white me-3">{selectedGame.views}</p>
                                                    <FontAwesomeIcon icon={faStar} className="text-white me-3" style={{ fontSize: "20px" }} onClick={() => trackFavouriteFn(signUser?._id, selectedGame._id)} data-bs-toggle="tooltip" data-bs-placement="top" title="Add To Favourites" />
                                                    <FontAwesomeIcon
                                                        icon={faShare}
                                                        className="text-white me-3"
                                                        style={{ fontSize: "20px", cursor: "pointer" }}
                                                        onClick={() => {
                                                            if (navigator.share) {
                                                                navigator.share({
                                                                    title: selectedGame.title,
                                                                    text: "Check out this game!",
                                                                    url: window.location
                                                                });
                                                            } else {
                                                                alert("Sharing not supported on this browser");
                                                            }
                                                        }}
                                                        data-bs-toggle="tooltip"
                                                        data-bs-placement="top"
                                                        title="Share Game"
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faExpand}
                                                        className="text-white me-3"
                                                        style={{ fontSize: "20px", cursor: "pointer" }}
                                                        onClick={toggleFullscreen}
                                                        title={isFullscreen ? "Exit Full" : "Fullscreen"}
                                                    />
                                                    {/* <FontAwesomeIcon
                                                    icon={isMuted ? faVolumeMute : faVolumeUp}
                                                    className="text-white me-3"
                                                    style={{ fontSize: "20px", cursor: "pointer" }}
                                                    onClick={() => {
                                                        const newMuted = !isMuted;
                                                        setIsMuted(newMuted);

                                                        const iframe = document.querySelector(".game-iframe");
                                                        if (iframe && iframe.contentWindow) {
                                                            iframe.contentWindow.postMessage(
                                                                { type: "SET_MUTE", mute: newMuted },
                                                                "*"
                                                            );
                                                        }
                                                    }}
                                                    data-bs-toggle="tooltip"
                                                    data-bs-placement="top"
                                                    title={isMuted ? "Unmute" : "Mute"}
                                                /> */}

                                                </div>
                                            </Col>
                                        </div>
                                    )}
                                </div>
                                {/* ) */}
                            </div>
                        </div>
                    ) : (
                        <Row className="justify-content-center">
                            <Col md={8}>
                                <div className="game-preview-card position-relative" style={{ backgroundColor: "black" }}>

                                </div>
                            </Col>
                        </Row>
                    )}
                </Container>

                {selectedGame ? (
                    <>
                        <Container className="my-5">
                            <div style={{ backgroundColor: "var(--dark-bg)", borderRadius: "15px" }} className="p-4">
                                <h2 className="heading-color text-white">Related Games</h2>
                                <div
                                    style={{
                                        display: "flex",
                                        overflowX: "auto",
                                        gap: "20px",
                                        paddingBottom: "10px",
                                    }}
                                    className="scrollbar-container"
                                >
                                    {AllGames?.filter(game => game.categoryId?._id === selectedGame.categoryId?._id).filter(game => game.gameUrl !== selectedGame.gameUrl).slice(0, 10).map((gameData, ind) => (
                                        <div key={ind} style={{ flex: "0 0 auto", width: isMobile ? "50px" : "180px" }}>
                                            <Link to={`/${gameData.title.en.toLowerCase().replace(/\s+/g, "-")}`}>
                                                <div
                                                    className="GameThumbnail"
                                                    style={{
                                                        backgroundImage: `url(${gameData.thumbnail || generalGameThumbnail})`,
                                                        width: isMobile ? "60px" : "100%",
                                                        height: isMobile ? "60px" : "180px",
                                                        backgroundSize: "cover",
                                                        backgroundPosition: "center",
                                                        borderRadius: "10px",
                                                    }}
                                                ></div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Container>
                        <Container fluid className=" my-4 gameDetail" style={{ borderRadius: "8px" }}>
                            <Row>
                                <Col md={7}>
                                    <div style={{ backgroundColor: "var(--bg-whites)", borderRadius: "15px" }} className="p-4">
                                        <h1 className="heading-color">{selectedGame.title.en}</h1>
                                        <p>{selectedGame.shortDes.en}</p>
                                        <p>{selectedGame.description.en}</p>
                                    </div>

                                    {selectedGame.howToPlay && (
                                        <div style={{ backgroundColor: "var(--bg-whites)", borderRadius: "15px" }} className="mt-3 p-4">
                                            <h3 className="heading-color">How to play {selectedGame.title.en} online?</h3>
                                            <p dangerouslySetInnerHTML={{ __html: selectedGame.howToPlay }}></p>
                                        </div>
                                    )}

                                    {selectedGame.whoCreated && (
                                        <div style={{ backgroundColor: "var(--bg-whites)", borderRadius: "15px" }} className="mt-3 p-4">
                                            <h3 className="fw-bold">Who created {selectedGame.title.en}?</h3>
                                            <p dangerouslySetInnerHTML={{ __html: selectedGame.whoCreated }}></p>
                                        </div>
                                    )}
                                    {selectedGame.gameTags?.length > 0 && (
                                        <div style={{ backgroundColor: "var(--bg-whites)", borderRadius: "15px" }} className="mt-3 p-4">
                                            <h3 className="fw-bold">{selectedGame.title.en} Tags</h3>
                                            {selectedGame.gameTags?.map((tag, ind) => (
                                                <Link className="tag-bar" key={ind} to={`/tag/${tag.tags.toLowerCase().replace(/\s+/g, "-")}`}><p >{tag.tags}</p></Link>
                                            ))}
                                        </div>
                                    )}
                                </Col>
                                <Col md={5}>
                                    <Row className="g-3">
                                        {otherGames?.slice(0, 18).map((gameData, ind) => (
                                            <Col md={4} xs={4} key={ind}>
                                                <Link
                                                    to={`/${gameData.title.en.toLowerCase().replace(/\s+/g, "-")}`}
                                                >
                                                    <div
                                                        className="GameThumbnail"
                                                        onClick={() => updateViewsFn(gameData._id, gameData.gameUrl)}
                                                        style={{
                                                            backgroundImage: `url(${gameData.thumbnail ? gameData.thumbnail : generalGameThumbnail})`,
                                                            height: isMobile ? "" : "150px"
                                                        }}
                                                    >
                                                        <span className="gameTitle">{gameData.title.en}</span>
                                                    </div>
                                                </Link>
                                            </Col>
                                        ))}
                                        {/* <Link className="d-flex justify-content-center" to={`.replace(/\s+/g, "-")}-games`}>
                                            <Button className="btn">View All</Button>
                                        </Link> */}
                                    </Row>
                                </Col>
                            </Row>
                        </Container>
                    </>
                ) : (
                    <>
                        <Container className="my-5">
                            <div style={{ backgroundColor: "var(--dark-bg)", borderRadius: "15px" }} className="p-4">
                                <h3 className="heading-color text-white">Related Games</h3>
                                <div
                                    style={{
                                        display: "flex",
                                        overflowX: "auto",
                                        gap: "20px",
                                        paddingBottom: "10px",
                                    }}
                                    className="scrollbar-container"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((gameData, ind) => (
                                        <div key={ind} style={{ flex: "0 0 auto", width: isMobile ? "50px" : "180px" }}>
                                            <div
                                                className="GameThumbnail"
                                                style={{
                                                    backgroundColor: "black",
                                                    width: isMobile ? "60px" : "100%",
                                                    height: isMobile ? "60px" : "100px",
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center",
                                                    borderRadius: "10px",
                                                }}
                                            ></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Container>
                    </>
                )}

                {showLoginPrompt && (
                    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content bg-dark text-white">
                                <div className="modal-header">
                                    <h5 className="modal-title">Login Required</h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowLoginPrompt(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <p className="text-center">Please log in to save your progress and add games to your favorites.</p>
                                </div>
                                <div className="d-flex justify-content-center pb-3">
                                    <Link to="/userLogin" className="btn me-3">
                                        Login
                                    </Link>
                                    <button className="btn" onClick={() => setShowLoginPrompt(false)}>
                                        Continue without login
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {alreadyPlayed && (
                    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content bg-dark text-white">
                                <div className="modal-header">
                                    <h5 className="modal-title">Game Already Played</h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={() => setAlreadyPlayed(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p className="text-center">
                                        You’ve already played this game.
                                        If you want to play again, go ahead —
                                        or try another game for a new challenge!
                                    </p>
                                </div>
                                <div className="modal-footer justify-content-center">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setAlreadyPlayed(false)}
                                    >
                                        Choose Another
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


            </div>

        </main >
    );
}