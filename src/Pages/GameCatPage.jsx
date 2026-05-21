import { Link, useLocation } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import GameContext from "../ContextApi/GameContext";
import GameCatContext from "../ContextApi/GameCatContext";
import { Col, Container, Row } from "react-bootstrap";
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

    const breadcrumbItems = [
        { name: "Home", path: "/", url: "https://www.khelogy.com/" },
        ...(selectedCategoryObj?.ancestors
            ?.map((catId) => {
                const category = AllCategory.find((c) => c._id === catId);
                return category
                    ? { name: category.category, path: `/category/${category.catUrl}`, url: `https://www.khelogy.com/category/${category.catUrl}` }
                    : null;
            })
            .filter(Boolean) || []),
        ...(selectedCategoryObj
            ? [{ name: selectedCategoryObj.category, path: `/category/${selectedCategoryObj?.catUrl}`, url: `https://www.khelogy.com/category/${selectedCategoryObj?.catUrl}` }]
            : []),
    ];

    const faqItems = selectedCategoryObj?.faqs?.filter((faq) => faq.question || faq.answer) || [];

    const sanitizeFaqAnswerHtml = (html) =>
        html
            ?.replace(/<span[^>]*background-color:\s*transparent;\s*color:\s*rgb\(0,\s*0,\s*0\);?[^>]*>/gi, "")
            .replace(/<\/span>/gi, "")
            .replace(/<p><\/p>/gi, "") || "";

    const stripHtmlTags = (html) => html?.replace(/<[^>]+>/g, "") || "";

    const pageTitle = selectedCategoryObj?.metaTitle || categoryName;
    const pageDescription = selectedCategoryObj?.metaDes || stripHtmlTags(selectedCategoryObj?.shortDes);

    const faqSchema = faqItems.map((faq) => ({
        "@type": "Question",
        name: faq.question || "",
        acceptedAnswer: {
            "@type": "Answer",
            text: stripHtmlTags(sanitizeFaqAnswerHtml(faq.answer)),
        },
    }));

    // Filter games that belong to this category
    const categoryGames = AllGames?.filter((game) =>
        game.categories?.some((cat) => cat.catUrl === categoryUrl)
    );

    const itemListSchema = categoryGames?.map((game, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
            "@type": "VideoGame",
            name: game.title?.en || game.title || "",
            url: `https://www.khelogy.com/${game.title?.en?.toLowerCase().replace(/\s+/g, "-")}`,
            image: game.thumbnail || generalGameThumbnail,
            description: game.shortDes?.en || "",
        },
    })) || [];

    const categoryPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: pageTitle,
        description: pageDescription,
        url: `https://www.khelogy.com/category/${selectedCategoryObj?.catUrl}`,
        isPartOf: {
            "@type": "WebSite",
            name: "Khelogy",
            url: "https://www.khelogy.com",
        },
        primaryImageOfPage: {
            "@type": "ImageObject",
            url: selectedCategoryObj?.logo,
        },
    };

    if (!selectedCategoryObj) {
        return null; // or loading UI
    }

    return (
        <div className="pt-5 px-6">

            <Container fluid style={{ marginTop: "50px" }}>
                <Row className="g-3">

                    <Helmet key={selectedCategoryObj?.catUrl}>
                        {/* Title */}
                        <title>{pageTitle}</title>
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
                            content={pageDescription}
                        />
                        {selectedCategoryObj.keywords && (
                            <meta name="keywords" content={selectedCategoryObj.keywords} />
                        )}
                        {/* Canonical */}
                        <link
                            rel="canonical"
                            href={`https://www.khelogy.com/category/${selectedCategoryObj?.catUrl}`}
                        />

                        {/* Open Graph */}
                        <meta property="og:type" content="article" />
                        <meta property="og:title" content={pageTitle} />
                        <meta property="og:description" content={pageDescription} />
                        <meta property="og:image" content={selectedCategoryObj.logo} />
                        <meta property="og:url" content={`https://www.khelogy.com/category/${selectedCategoryObj?.catUrl}`} />
                        <meta property="og:site_name" content="Khelogy" />

                        {/* Twitter */}
                        <meta name="twitter:card" content="summary_large_image" />
                        <meta name="twitter:title" content={pageTitle} />
                        <meta name="twitter:description" content={pageDescription} />
                        <meta name="twitter:image" content={selectedCategoryObj.logo} />

                        {/* Page Schema */}
                        <script type="application/ld+json">
                            {JSON.stringify(categoryPageSchema)}
                        </script>
                        <script type="application/ld+json">
                            {JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "CollectionPage",
                                name: pageTitle,
                                description: pageDescription,
                                url: `https://www.khelogy.com/category/${selectedCategoryObj?.catUrl}`,
                                publisher: {
                                    "@type": "Organization",
                                    name: "Khelogy",
                                    logo: {
                                        "@type": "ImageObject",
                                        url: "https://www.khelogy.com/logo.png",
                                    },
                                },
                                mainEntity: {
                                    "@type": "ItemList",
                                    itemListElement: itemListSchema,
                                },
                            })}
                        </script>
                        <script type="application/ld+json">
                            {JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "BreadcrumbList",
                                "itemListElement": breadcrumbItems.map((item, index) => ({
                                    "@type": "ListItem",
                                    "position": index + 1,
                                    "name": item.name,
                                    "item": item.url,
                                })),
                            })}
                        </script>
                        {faqSchema.length > 0 && (
                            <script type="application/ld+json">
                                {JSON.stringify({
                                    "@context": "https://schema.org",
                                    "@type": "FAQPage",
                                    mainEntity: faqSchema,
                                })}
                            </script>
                        )}
                    </Helmet>

                    {/* Breadcrumb & Category Title */}
                    <Row className="mt-2 mb-3">
                        <span className="heading-color sub-heading">
                            {breadcrumbItems.map((item, index) => (
                                <span key={index}>
                                    {index > 0 && <span className="breadcrumb-separator"> &#8250; </span>}
                                    {index === breadcrumbItems.length - 1 ? (
                                        <span>{item.name}</span>
                                    ) : (
                                        <Link to={item.path} className="heading-color">
                                            {item.name}
                                        </Link>
                                    )}
                                </span>
                            ))}
                        </span>
                        <h1 className="heading-color sub-heading">{categoryName}</h1>
                        <Col md={7}>
                            <p dangerouslySetInnerHTML={{ __html: selectedCategoryObj?.shortDes }}></p>
                        </Col>
                    </Row>

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
            <Container fluid className="mt-5 mb-5">
                {/* Direct Subcategories */}
                {directSubCategories.length > 0 && (
                    <section>
                        <Row>
                            <h2 className="sub-heading">Related Categories</h2>
                            {directSubCategories.map((cat) => (
                                <Col key={cat._id} md={3}>
                                    <Link to={`/category/${cat.catUrl}`}>
                                        <div className="d-flex px-2 py-3 align-items-center gap-2 my-3 cat-bar">
                                            {/* <Image src={cat.logo} style={{ width: "20%", borderRadius: "50px", backgroundColor: "var(--blue-color)" }} className="p-2" /> */}
                                            <p className="game-Titles">{cat.category}</p>
                                        </div>
                                    </Link>
                                </Col>
                            ))}
                        </Row>
                    </section>
                )}
                <Row className="g-3">
                    <h2 className="sub-heading">Description</h2>
                    {selectedCategoryObj?.description && (
                        <>

                            <div
                                dangerouslySetInnerHTML={{
                                    __html: selectedCategoryObj?.description
                                }}
                            />
                        </>
                    )}
                    {faqItems.length > 0 && (
                        <section className="faq-container" aria-label="Frequently Asked Questions">
                            <h2 className="faq-main-heading mb-3">FAQ&apos;s</h2>

                            <div className="faq-accordion">
                                {faqItems.map((faq, i) => (
                                    <article
                                        className={`faq-item ${activeIndex === i ? "active" : ""}`}
                                        key={i}
                                    >
                                        <div className="faq-question-header faq-question" onClick={() => toggleIndex(i)}>
                                            <h3 style={{ fontSize: "0.95rem", lineHeight: 1.4 }}>{faq.question}</h3>
                                            <span className="icon">{activeIndex === i ? "-" : "+"}</span>
                                        </div>

                                        <div
                                            className="faq-answer"
                                            style={{
                                                maxHeight:
                                                    activeIndex === i
                                                        ? contentRefs.current[i]?.scrollHeight + "px"
                                                        : "0px",
                                            }}
                                        >
                                            <div
                                                ref={(el) => (contentRefs.current[i] = el)}
                                                className="faq-answer-content"
                                                dangerouslySetInnerHTML={{ __html: sanitizeFaqAnswerHtml(faq.answer) }}
                                            />
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}


                </Row>
            </Container>

        </div>
    );
}
