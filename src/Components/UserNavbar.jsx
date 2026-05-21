import { useContext, useEffect, useState } from "react";
import { Navbar, Nav, Container, DropdownButton, Dropdown, Button, Image, Form, Offcanvas } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GameContext from "../ContextApi/GameContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook, faHome, faInfoCircle, faUser, faMagnifyingGlass, faGamepad } from "@fortawesome/free-solid-svg-icons";
import expandIcon from "../assets/expand-icon.svg"
import dummyUserIcon from "../assets/dummy-user.png"
import UserContext from "../ContextApi/UserContext";
import siteLogo from "../assets/khelogy-logo.webp";
import generalGameThumbnail from "../assets/defaultGameThumbnail.jpg";
import UserLayout from "./UserLayout";
import { useRef } from "react";
import GameCatContext from "../ContextApi/GameCatContext";

function UserNavbar() {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchInput, setSearchInput] = useState("")
    const { categories } = useContext(GameCatContext)
    const { signUser, setSignUser, setCatHover, catHover } = useContext(UserContext)
    const { AllGames, setGameSearch, filterSearchGames, gameSearch } = useContext(GameContext)
    const navigate = useNavigate()
    const [showSearch, setShowSearch] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const searchRef = useRef(null);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setShowSearch(false);
                setShowSuggestions(false);
                setSearchInput("");
                setGameSearch("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const signUserPanelLinks = (() => {
        if (signUser && signUser.role === "User") {
            return [
                { path: "/userPanel/favourites", text: "Favourites" },
            ];
        } else {
            return [
                { path: "/adminPanel/add-category", text: "Manage Categories" },
                { path: "/adminPanel/manage-games", text: "Manage Games" },
            ];
        }
    })();

    const logOutButton = () => {
        sessionStorage.removeItem("userData");
        setSignUser("");
        navigate("/");
    };

    // Get unique categories based on categoryId
    const uniqueCategories = [];
    const addedIds = new Set();

    AllGames?.forEach(game => {
        const cat = game.categoryId;
        if (cat && !addedIds.has(cat._id)) {
            uniqueCategories.push(cat);
            addedIds.add(cat._id);
        }
    });
    const location = useLocation()
    const isActive = (path) => location.pathname === path;

    const mainCategories = categories?.filter(cat => cat.parent === null);
    const handleSearchSubmit = () => {
        if (!searchInput.trim()) return;

        // Example: redirect to search page
        navigate(`/search?query=${searchInput.toLowerCase()}`);

        setShowSearch(false);
        setShowSuggestions(false);
        setSearchInput("");
    };
    return (
        <>
            {!location.pathname.includes("/adminPanel/") && (
                <>
                    <Navbar expand="lg" className="navbar sticky-transition" style={{
                        position: "fixed",
                        top: 0,
                        width: "100%", // full width
                        backgroundColor: isScrolled ? "rgba(255, 255, 255,.9)" : "var(--bg-whites)",
                        zIndex: 1000,
                        padding: 0, // remove container padding
                    }}>
                        <Container fluid className="d-flex justify-content-between align-items-center px-0 mx-0">
                            {/* LEFT: Logo + Links */}
                            <div className="d-flex align-items-center">
                                <div className="d-none d-md-block" style={{ margin: "20px", cursor: "pointer" }} onClick={() => setCatHover(catHover === "Open" ? "Close" : "Open")}>
                                    <Image
                                        className="me-2"
                                        style={{ width: "15px", borderRadius: "6px" }}
                                        src={expandIcon}
                                    />
                                </div>
                                <div className="d-md-none" style={{ margin: "20px", cursor: "pointer" }} onClick={handleShow}>
                                    <Image
                                        className="me-2"
                                        style={{ width: "15px", borderRadius: "6px" }}
                                        src={expandIcon}
                                    />
                                </div>

                                <Navbar.Brand as={Link} to="/">
                                    <Image src={siteLogo} style={{ width: "70%" }} />
                                </Navbar.Brand>
                            </div>
                            <div className="d-none d-md-block">
                                <Nav className="ms-4 d-flex align-items-center">
                                    <Link to="/" className={`header-text ${isActive("/") ? "activeHeader" : ""}`}>
                                        <Nav className="me-3 d-flex align-items-center">
                                            <FontAwesomeIcon icon={faHome} className="p-1 me-2 icon" />
                                            <span>Home</span>
                                        </Nav>
                                    </Link>
                                    <Link to="/about-us" className={`header-text ${isActive("/about-us") ? "activeHeader" : ""}`}>
                                        <Nav className="me-3 d-flex align-items-center">
                                            <FontAwesomeIcon icon={faInfoCircle} className="p-1 me-2 icon" />
                                            <span>About</span>
                                        </Nav>
                                    </Link>
                                    <Link to="/contact-us" className={`header-text ${isActive("/submit-request") ? "activeHeader" : ""}`}>
                                        <Nav className="me-3 d-flex align-items-center">
                                            <FontAwesomeIcon icon={faAddressBook} className="p-1 me-2 icon" />
                                            <span>Contact</span>
                                        </Nav>
                                    </Link>
                                </Nav>
                            </div>

                            {/* RIGHT: Search + Login/User */}
                            <div className="d-flex align-items-center me-3">
                                {/* Search Icon */}
                                <div ref={searchRef} className="position-relative me-3">
                                    <FontAwesomeIcon
                                        icon={faMagnifyingGlass}
                                        className="p-2"
                                        style={{ cursor: "pointer", color: "var(--blackish-color)" }}
                                        onClick={() => {
                                            setShowSearch(prev => !prev);
                                            setShowSuggestions(false);
                                            setSearchInput("");
                                            setGameSearch("");
                                        }}
                                    />
                                    {/* SEARCH POPUP */}
                                    {showSearch && (
                                        <div
                                            className="search-popup open"
                                            style={{ position: "absolute", right: 0, top: "100%", zIndex: 1000 }}
                                        >
                                            <div style={{ position: "relative" }}>
                                                <Form.Control
                                                    placeholder="Search games..."
                                                    className="searchInput pe-5 my-3"
                                                    value={searchInput}
                                                    onChange={(e) => {
                                                        setSearchInput(e.target.value);
                                                        setGameSearch(e.target.value);
                                                        setShowSuggestions(true);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            handleSearchSubmit();
                                                        }
                                                    }}
                                                />

                                                {/* Enter Icon Button */}
                                                <button
                                                    onClick={handleSearchSubmit}
                                                    style={{
                                                        position: "absolute",
                                                        right: "10px",
                                                        top: "50%",
                                                        transform: "translateY(-50%)",
                                                        background: "transparent",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        color: "white",
                                                        fontSize: "28px",
                                                    }}
                                                >
                                                    ↪
                                                </button>
                                            </div>

                                            {/* Suggestions */}
                                            {gameSearch && showSuggestions && (
                                                <div
                                                    style={{
                                                        maxHeight: "260px",
                                                        overflowY: "auto",
                                                        backgroundColor: "#383838",
                                                        borderRadius: "8px",
                                                    }}
                                                >
                                                    <h5 className="text-white p-2">Categories</h5>
                                                    {[...categories]
                                                        .filter(cat =>
                                                            cat.category.toLowerCase().includes(searchInput.toLowerCase())
                                                        )
                                                        .slice(0, 3) // limit to 3 suggestions
                                                        .map((cat, ind) => (
                                                            <Link
                                                                key={`cat-${ind}`}
                                                                to={`/category/${cat.category.toLowerCase().replace(/\s+/g, "-")}`}
                                                                onClick={() => {
                                                                    setShowSearch(false);
                                                                    setShowSuggestions(false);
                                                                    setSearchInput("");
                                                                }}
                                                                style={{ textDecoration: "none" }}
                                                            >
                                                                <div className="d-flex align-items-center p-2 hover-search">
                                                                    <Image
                                                                        className="me-2"
                                                                        style={{ width: "25px", borderRadius: "6px" }}
                                                                        src={cat.logo || generalGameThumbnail}
                                                                    />
                                                                    <p className="text-white mb-0">{cat.category}</p>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    <h5 className="text-white p-2">Games</h5>
                                                    {[...filterSearchGames]?.slice(0, 5).map((gameData, ind) => (
                                                        <Link
                                                            key={ind}
                                                            to={`/${gameData.title.en.toLowerCase().replace(/\s+/g, "-")}`}
                                                            onClick={() => {
                                                                setShowSearch(false);
                                                                setShowSuggestions(false);
                                                                setSearchInput("");
                                                            }}
                                                            style={{ textDecoration: "none" }}
                                                        >
                                                            <div className="d-flex align-items-center p-2 hover-search">
                                                                <Image
                                                                    className="me-2"
                                                                    style={{ width: "45px", borderRadius: "6px" }}
                                                                    src={gameData.thumbnail || generalGameThumbnail}
                                                                />
                                                                <p className="text-white mb-0">{gameData.title.en}</p>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Login/User */}
                                <div className="d-none d-md-block">
                                    {!signUser?.role ? (
                                        <Link to="/userLogin" className="d-flex align-items-center">
                                            <p className="me-2 mb-0" style={{ color: "var(--blackish-color)" }}>Login</p>
                                            <FontAwesomeIcon icon={faUser} style={{ color: "white", backgroundColor: "var(--blue-color)", borderRadius: "50%" }} className="p-1" />
                                        </Link>
                                    ) : (
                                        <Dropdown drop="start">
                                            <Dropdown.Toggle as="div" style={{ cursor: "pointer", padding: 0 }}>
                                                <Image
                                                    src={dummyUserIcon}
                                                    style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }}
                                                />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {signUserPanelLinks.map((panelLinks, index) => (
                                                    <Dropdown.Item className="mb-2" key={index} as={Link} to={panelLinks.path}>
                                                        <span style={{ border: "1px solid var(--primary-color)", borderRadius: "10px", padding: "4px 8px" }}>
                                                            {panelLinks.text}
                                                        </span>
                                                    </Dropdown.Item>
                                                ))}
                                                <Dropdown.Item as="button" className="primary-btn text-center" onClick={logOutButton}>
                                                    Logout
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    )}
                                </div>
                            </div>
                        </Container>
                    </Navbar>


                    <div className="d-md-none d-block w-100 sticky-transition" style={{
                        position: "fixed",
                        top: isScrolled ? 0 : 0,
                        transform: isScrolled ? "translateY(0)" : "translateY(0)",
                        zIndex: 999,
                        backgroundColor: isScrolled ? "rgba(15, 15, 15,.9)" : "var(--dark-bg)",
                    }}>
                        <div className="d-flex justify-content-between align-items-center p-3">
                            <div>
                                <Link to="/"> <Image src={siteLogo} style={{ width: "80px" }} /></Link>
                            </div>

                            <div>
                                {!signUser?.role && (
                                    <div className="d-flex align-items-center">
                                        <p className="me-2" style={{ fontSize: "18px", color: "white" }}><Link to="/userLogin" className="header-text">Login</Link></p>
                                        <FontAwesomeIcon icon={faUser} style={{ color: "white", backgroundColor: "var(--blue-color)", borderRadius: "50px" }} className="p-1" />
                                    </div>
                                )}
                                {signUser && (
                                    <DropdownButton
                                        id="dropdown-basic-button"
                                        className="user-drop"
                                        drop="start"
                                        title={signUser && signUser.name.slice(0, 10)}
                                        style={{ backgroundColor: "transparent" }}
                                    >
                                        {signUserPanelLinks.map((panelLinks, index) => (
                                            <Dropdown.Item className="mb-2" key={index} as={Link} to={panelLinks.path}>
                                                <span className="text-dark p-1" style={{ border: "1px solid var(--primary-color)", borderRadius: "10px" }}> {panelLinks.text}</span>
                                            </Dropdown.Item>
                                        ))}
                                        <Dropdown.Item as={Button} className="primary-btn text-center" onClick={logOutButton}>Logout</Dropdown.Item>
                                    </DropdownButton>
                                )}
                            </div>
                        </div>

                        <div>
                            <UserLayout />
                        </div>
                        {/* offcanvas */}
                        <Offcanvas show={show} style={{ width: "80%" }} onHide={handleClose}>
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title>Categories List</Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                {mainCategories.map((category, index) => (
                                    <Nav.Link
                                        onClick={handleClose}
                                        key={index}
                                        as={Link}
                                        to={`/category/${category?.catUrl}`}
                                        className="category-item mt-3 d-flex align-items-center"
                                    >
                                        {/* <Image src={category.logo} className="category-icon" alt={category.category} /> */}
                                        <FontAwesomeIcon className="me-3" icon={faGamepad}></FontAwesomeIcon>
                                        <span className="text-dark">{category.category}</span>
                                    </Nav.Link>
                                ))}
                            </Offcanvas.Body>
                        </Offcanvas>
                    </div>
                </>
            )}
        </>
    );
}

export default UserNavbar;
