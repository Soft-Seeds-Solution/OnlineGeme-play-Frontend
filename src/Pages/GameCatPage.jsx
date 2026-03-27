import { Link, useLocation } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import GameContext from "../ContextApi/GameContext";
import GameCatContext from "../ContextApi/GameCatContext";
import { Col, Container, Image, Row } from "react-bootstrap";
import generalGameThumbnail from "../assets/defaultGameThumbnail.jpg";
import { Helmet } from "react-helmet-async";

export default function GameCatPage() {
    const { pathname } = useLocation();
    const { AllGames, updateViewsFn } = useContext(GameContext);
    const { categories, AllCategory } = useContext(GameCatContext);
    const [hoveredId, setHoveredId] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const contentRefs = useRef([]);

    const toggleIndex = (i) => {
        setActiveIndex(activeIndex === i ? null : i);
    };
    const handleMouseEnter = (id) => setHoveredId(id);
    const handleMouseLeave = () => setHoveredId(null);

    // Extract the category URL from the path
    const categoryUrl = pathname.replace("/category/", "");

    // Recursive function to find category by catUrl
    const findCategoryByUrl = (cats, url) => {
        for (let cat of cats) {
            if (cat.catUrl === url) return cat;
            if (cat.children?.length > 0) {
                const found = findCategoryByUrl(cat.children, url);
                if (found) return found;
            }
        }
        return null;
    };

    const selectedCategoryObj = findCategoryByUrl(categories, categoryUrl);
    const categoryName = selectedCategoryObj?.category || "";

    const hasGameInCategory = (cat) => {
        return AllGames?.some(game =>
            game.categories?.some(c => c.catUrl === cat.catUrl)
        );
    };

    // Direct subcategories
    const directSubCategories = selectedCategoryObj?.children?.filter(cat =>
        hasGameInCategory(cat)
    ) || [];

    // Build breadcrumb dynamically using ancestors
    const breadcrumb =
        selectedCategoryObj?.ancestors
            ?.map((catId) => AllCategory.find((c) => c._id === catId)?.category)
            .filter(Boolean) || [];
    if (categoryName) breadcrumb.push(categoryName);

    // Filter games that belong to this category
    const categoryGames = AllGames?.filter((game) =>
        game.categories?.some((cat) => cat.catUrl === categoryUrl)
    );

    if (!selectedCategoryObj) {
        return null; // or loading UI
    }

    return (
        <div className="pt-5 px-6">

            <Container fluid style={{ marginTop: "50px" }}>
                <Row className="g-3">

                    <Helmet key={selectedCategoryObj?.catUrl}>
                        {/* Title */}
                        <title>{`${selectedCategoryObj.metaTitle}`}</title>
                        <meta
                            name="robots"
                            content={
                                selectedCategoryObj?.catIndex === "index"
                                    ? "index, follow"
                                    : "noindex, nofollow"
                            }
                        />

                        {/* Meta */}
                        <meta
                            name="description"
                            content={selectedCategoryObj.metaDes}
                        />
                        <meta name="keywords" content={selectedCategoryObj.keywords} />
                        {/* Canonical */}
                        <link
                            rel="canonical"
                            href={`https://www.khelogy.com/category/${selectedCategoryObj.catUrl}`}
                        />

                        {/* Open Graph */}
                        <meta property="og:type" content="article" />
                        <meta property="og:title" content={selectedCategoryObj.metaTitle} />
                        <meta property="og:description" content={selectedCategoryObj.metaDes} />
                        <meta property="og:image" content={selectedCategoryObj.logo} />
                        <meta property="og:url" content={`https://www.khelogy.com/category/${selectedCategoryObj.catUrl}`} />
                        <meta property="og:site_name" content="Khelogy" />

                        {/* Twitter */}
                        <meta name="twitter:card" content="summary_large_image" />
                        <meta name="twitter:title" content={selectedCategoryObj.metaTitle} />
                        <meta name="twitter:description" content={selectedCategoryObj.metaDes} />
                        <meta name="twitter:image" content={selectedCategoryObj.logo} />

                        {/* Article Schema */}
                        <script type="application/ld+json">
                            {JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "VideoGame",
                                "name": selectedCategoryObj.metaTitle,
                                "description": selectedCategoryObj.metaDes,
                                "image": selectedCategoryObj.logo,
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

                    {/* Breadcrumb & Category Title */}
                    <Row className="mt-2 mb-3">
                        <span className="heading-color sub-heading">
                            <Link to="/" className="heading-color">Home</Link>{" "}
                            / {breadcrumb.join(" / ")}
                        </span>
                        <h1 className="heading-color sub-heading">{categoryName}</h1>
                        <Col md={7}>
                            <p dangerouslySetInnerHTML={{ __html: selectedCategoryObj?.shortDes }}></p>
                        </Col>

                    </Row>

                    {/* Direct Subcategories */}
                    <section>
                        <Row>
                            {directSubCategories.map((cat) => (
                                <Col key={cat._id} md={3}>
                                    <Link to={`/category/${cat.catUrl}`}>
                                        <div className="d-flex px-2 py-3 align-items-center gap-2 mb-3 cat-bar">
                                            <Image src={cat.logo} style={{ width: "20%", borderRadius: "50px", backgroundColor: "var(--blue-color)" }} className="p-2" />
                                            <p className="game-Titles">{cat.category}</p>
                                        </div>
                                    </Link>
                                </Col>
                            ))}
                        </Row>
                    </section>

                    {/* Games Grid */}
                    <Row className="g-3 mt-3">
                        {categoryGames.map((game, index) => (
                            <Col md={2} xs={4} key={index}>
                                <Link to={`/${game.title.en.toLowerCase().replace(/\s+/g, "-")}`}>
                                    <div
                                        className="GameThumbnail"
                                        style={{ backgroundImage: `url(${game.thumbnail || generalGameThumbnail})` }}
                                        onClick={() => updateViewsFn(game._id, game.gameUrl)}
                                        onMouseEnter={() => handleMouseEnter(game._id)}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        {game.video && hoveredId === game._id && (
                                            <video
                                                className="game-video"
                                                src={game.video}
                                                autoPlay
                                                loop
                                                muted
                                                playsInline
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        )}
                                    </div>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </Row>
            </Container>

            {/* Category Description & FAQs */}
            <Container fluid className="mt-5">
                <Row className="g-3">

                    {selectedCategoryObj?.description && (
                        <>

                            <div
                                dangerouslySetInnerHTML={{
                                    __html: selectedCategoryObj?.description
                                }}
                            />
                        </>
                    )}
                    {selectedCategoryObj?.faqs?.filter(f => f.question || f.answer)?.length > 0 && (
                        <div className="faq-container">
                            <h2 className="faq-main-heading">FAQ&apos;s</h2>

                            <div className="faq-accordion">
                                {selectedCategoryObj?.faqs?.map((faq, i) => (
                                    <div
                                        className={`faq-item ${activeIndex === i ? "active" : ""}`}
                                        key={i}
                                    >
                                        <h3 className="faq-question" onClick={() => toggleIndex(i)}>
                                            {faq.question}
                                            <span className="icon">{activeIndex === i ? "-" : "+"}</span>
                                        </h3>

                                        <div
                                            ref={(el) => (contentRefs.current[i] = el)}
                                            className={`faq-answer`}
                                            style={{
                                                maxHeight:
                                                    activeIndex === i
                                                        ? contentRefs.current[i]?.scrollHeight + "px"
                                                        : "0px",
                                            }}
                                        >
                                            <div
                                                className="faq-answer-content"
                                                dangerouslySetInnerHTML={{ __html: faq.answer }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                </Row>
            </Container>

        </div>
    );
}