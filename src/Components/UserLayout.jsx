import { Image, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import UserContext from "../ContextApi/UserContext";
// import { useKeenSlider } from "keen-slider/react";

function UserLayout() {
    const { catHover, setCatHover } = useContext(UserContext);
    const [categories, setCategories] = useState([]);
    const { pathname } = useLocation()
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const fetchCategories = async () => {
        const res = await fetch("https://edge.khelogy.com/api/category/nestedCategories");
        const data = await res.json();
        setCategories(data);
    };
    useEffect(() => {
        fetchCategories();
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const mainCategories = categories?.filter(cat => cat.parent === null);
    // const [sliderRef] = useKeenSlider(
    //     {
    //         loop: true,
    //         slides: {
    //             perView: 4,
    //             spacing: 5,
    //         },
    //         breakpoints: {
    //             "(max-width: 1200px)": {
    //                 slides: { perView: 3, spacing: 10 },
    //             },
    //             "(max-width: 768px)": {
    //                 slides: { perView: 2.5, spacing: 10 },
    //             },
    //             "(max-width: 576px)": {
    //                 slides: { perView: 4, spacing: 5 },
    //             },
    //         },
    //         duration: 1000,
    //         dragSpeed: 1,
    //         mode: "free-snap",
    //         renderMode: "performance",
    //         defaultAnimation: {
    //             duration: 1000,
    //             easing: (t) => t,
    //         },
    //         created(slider) {
    //             let timeout
    //             let mouseOver = false

    //             function clearNextTimeout() {
    //                 clearTimeout(timeout)
    //             }

    //             function nextTimeout() {
    //                 clearTimeout(timeout)
    //                 if (mouseOver) return
    //                 timeout = setTimeout(() => {
    //                     slider.prev()
    //                 }, 4000)
    //             }

    //             slider.container.addEventListener("mouseover", () => {
    //                 mouseOver = true
    //                 clearNextTimeout()
    //             })

    //             slider.container.addEventListener("mouseout", () => {
    //                 mouseOver = false
    //                 nextTimeout()
    //             })

    //             nextTimeout()

    //             slider.on("dragStarted", clearNextTimeout)
    //             slider.on("animationEnded", nextTimeout)
    //             slider.on("updated", nextTimeout)
    //         },
    //     }
    // )

    // Sidebar for desktop view
    const renderDesktopSidebar = () => (
        <div
            className={`category-sidebar-overlay ${catHover === "Open" ? "expanded" : ""}`}
            onMouseEnter={() => setCatHover("Open")}
            onMouseLeave={() => setCatHover("Close")}
        >
            {mainCategories.map((category, index) => (
                <Nav.Link
                    key={index}
                    as={Link}
                    to={`/category/${category?.catUrl}`}
                    className="category-item mt-3 d-flex align-items-center"
                >
                    <Image src={category.logo} className="me-2" style={{ width: "30px" }} alt={category.category} />
                    {/* <FontAwesomeIcon icon={faGamepad}></FontAwesomeIcon> */}
                    <span className="category-name text-dark">{category.category}</span>
                </Nav.Link>
            ))}
        </div>
    );

    return (
        <>
            {(!pathname.includes("adminPanel") && (!pathname.includes("userPanel"))) && (
                <div className="user-layout-wrapper">
                    {/* Sidebar only for large screens */}
                    {windowWidth >= 768 && mainCategories.length > 0 && renderDesktopSidebar()}

                    {/* Mobile horizontal category slider */}
                    {/* {windowWidth < 768 && mainCategories.length > 0 && (
                        <Container fluid className="mt-3 d-block d-md-none">
                            {renderMobileSlides()}
                        </Container>
                    )} */}
                </div>
            )}
        </>
    );

}

export default UserLayout;
