import { useContext, useState } from "react";
import {
    Navbar,
    Container,
    Dropdown,
    Image,
    Button
} from "react-bootstrap";

import {
    faBars,
    faGlobe,
    faUser,
    faGear,
    faRightFromBracket,
    faBell
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserContext from "../ContextApi/UserContext";
import siteLogo from "../assets/khelogy-logo.webp";
import { useMemo } from "react";
import GameCatContext from "../ContextApi/GameCatContext";
import GameContext from "../ContextApi/GameContext";
export default function Header({ sidebarOpen, setSidebarOpen }) {
    const { signUser, setSignUser } = useContext(UserContext)
    const { AllGames } = useContext(GameContext)
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const logOutButton = () => {
        sessionStorage.removeItem("userData");
        setSignUser("");
        navigate("/");
    };

    const {
        categories
    } = useContext(GameCatContext);

    const pendingGames = AllGames.filter(game => game.publishedByAdmin === false)

    // ====================================
    // FLATTEN NESTED CATEGORIES
    // ====================================

    const flattenCategories = (cats = [], level = 0) => {

        let result = [];

        cats.forEach(cat => {

            result.push({
                ...cat,
                level
            });

            if (cat.children?.length > 0) {

                result = result.concat(
                    flattenCategories(cat.children, level + 1)
                );
            }
        });

        return result;
    };

    // ====================================
    // GET ALL CATEGORIES INCLUDING CHILDREN
    // ====================================

    const allFlatCategories = useMemo(() => {
        return flattenCategories(categories || []);
    }, [categories]);

    // ====================================
    // PENDING CATEGORIES
    // ====================================

    const pendingApprovalCats = allFlatCategories.filter(cat =>
        cat.publishedByAdmin === false)

    const totalNotifications =
        pendingApprovalCats.length + pendingGames.length;
    return (
        <>
            {pathname.includes("/adminPanel") && (
                <Navbar
                    expand="lg"
                    className="px-3 px-md-4 border-bottom sticky-top"
                    style={{
                        height: "65px",
                        background: "#fff",
                        zIndex: 999,
                    }}
                >
                    <Container fluid>

                        {/* Sidebar Toggle */}
                        <Button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="d-flex align-items-center justify-content-center me-3"
                            style={{
                                width: "40px",
                                height: "40px",
                                background: "#13a4ec",
                                border: "none",
                                borderRadius: "8px"
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faBars}
                                className="text-white"
                            />
                        </Button>

                        {/* Logo */}
                        <Navbar.Brand
                            href="/"
                            className="d-flex align-items-center"
                        >
                            <img
                                src={siteLogo}
                                alt="Logo"
                                style={{
                                    width: "170px",
                                    objectFit: "contain"
                                }}
                            />
                        </Navbar.Brand>

                        {/* User Dropdown */}
                        <div className="ms-auto d-flex align-items-center gap-3">

                            {/* ========================= */}
                            {/* NOTIFICATION DROPDOWN */}
                            {/* ========================= */}

                            <Dropdown align="end">

                                <Dropdown.Toggle
                                    variant="light"
                                    className="position-relative border-0 bg-transparent shadow-none"
                                    style={{
                                        padding: "6px 10px"
                                    }}
                                >

                                    <FontAwesomeIcon
                                        icon={faBell}
                                        style={{
                                            fontSize: "20px",
                                            color: "#333"
                                        }}
                                    />

                                    {
                                        totalNotifications > 0 && (
                                            <span
                                                className="position-absolute d-flex align-items-center justify-content-center"
                                                style={{
                                                    top: "-2px",
                                                    right: "-2px",
                                                    width: "18px",
                                                    height: "18px",
                                                    borderRadius: "50%",
                                                    background: "red",
                                                    color: "#fff",
                                                    fontSize: "10px",
                                                    fontWeight: "700"
                                                }}
                                            >
                                                {totalNotifications}
                                            </span>
                                        )
                                    }

                                </Dropdown.Toggle>

                                <Dropdown.Menu
                                    className="shadow border-0 p-2"
                                    style={{
                                        width: "320px",
                                        borderRadius: "16px"
                                    }}
                                >

                                    <h6 className="px-2 mb-3 fw-bold">
                                        Pending Notifications
                                    </h6>

                                    {/* ========================= */}
                                    {/* CATEGORY CHANGES */}
                                    {/* ========================= */}

                                    <div className="mb-3">

                                        <div
                                            className="px-2 py-2 fw-bold"
                                            style={{
                                                fontSize: "13px",
                                                color: "#13a4ec"
                                            }}
                                        >
                                            Category Changes
                                        </div>

                                        {
                                            pendingApprovalCats.length === 0 ? (
                                                <div
                                                    className="px-2 py-1 text-muted"
                                                    style={{
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    No pending categories
                                                </div>
                                            ) : (
                                                pendingApprovalCats.map((cat, index) => (

                                                    <Dropdown.Item
                                                        key={index}
                                                        className="py-2 rounded"
                                                        href="/adminPanel/pending-category-approval"
                                                    >

                                                        <div
                                                            style={{
                                                                fontSize: "13px",
                                                                fontWeight: "600"
                                                            }}
                                                        >
                                                            {
                                                                cat.pendingChanges?.category ||
                                                                cat.category
                                                            }
                                                        </div>

                                                        <small
                                                            style={{
                                                                color: "#888"
                                                            }}
                                                        >
                                                            Category update pending
                                                        </small>

                                                    </Dropdown.Item>

                                                ))
                                            )
                                        }

                                    </div>

                                    {/* ========================= */}
                                    {/* GAME CHANGES */}
                                    {/* ========================= */}

                                    <div>

                                        <div
                                            className="px-2 py-2 fw-bold"
                                            style={{
                                                fontSize: "13px",
                                                color: "#13a4ec"
                                            }}
                                        >
                                            Game Changes
                                        </div>

                                        {
                                            pendingGames.length === 0 ? (

                                                <div
                                                    className="px-2 py-1 text-muted"
                                                    style={{
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    No pending games
                                                </div>

                                            ) : (

                                                pendingGames.map((game, index) => (

                                                    <Dropdown.Item
                                                        key={index}
                                                        className="py-2 rounded"
                                                        href="/adminPanel/pending-games"
                                                    >

                                                        <div
                                                            style={{
                                                                fontSize: "13px",
                                                                fontWeight: "600"
                                                            }}
                                                        >
                                                            {game.title?.en}
                                                        </div>

                                                        <small
                                                            style={{
                                                                color: "#888"
                                                            }}
                                                        >
                                                            Game update pending
                                                        </small>

                                                    </Dropdown.Item>

                                                ))
                                            )
                                        }

                                    </div>

                                </Dropdown.Menu>

                            </Dropdown>

                            {/* ========================= */}
                            {/* USER DROPDOWN */}
                            {/* ========================= */}

                            <Dropdown align="end">

                                <Dropdown.Toggle
                                    variant="light"
                                    id="dropdown-basic"
                                    className="d-flex align-items-center gap-2 border shadow-sm px-2 py-1 bg-white"
                                    style={{
                                        borderRadius: "12px"
                                    }}
                                >

                                    {/* Avatar */}
                                    <div className="position-relative">

                                        <Image
                                            src="https://ui-avatars.com/api/?name=John+Doe&background=13a4ec&color=fff"
                                            roundedCircle
                                            width={40}
                                            height={40}
                                            style={{
                                                objectFit: "cover"
                                            }}
                                        />

                                        <div
                                            className="position-absolute"
                                            style={{
                                                width: "10px",
                                                height: "10px",
                                                background: "green",
                                                borderRadius: "50%",
                                                right: "2px",
                                                bottom: "2px",
                                                border: "2px solid white"
                                            }}
                                        />

                                    </div>

                                    {/* User Info */}
                                    <div className="d-none d-md-flex flex-column text-start">

                                        <span
                                            style={{
                                                fontSize: "13px",
                                                fontWeight: "700",
                                                color: "#111"
                                            }}
                                        >
                                            {signUser?.name}
                                        </span>

                                        <span
                                            style={{
                                                fontSize: "11px",
                                                color: "#777"
                                            }}
                                        >
                                            @{signUser?.name?.toLowerCase()}
                                        </span>

                                    </div>

                                </Dropdown.Toggle>

                                <Dropdown.Menu
                                    className="shadow border-0 p-2"
                                    style={{
                                        width: "280px",
                                        borderRadius: "18px"
                                    }}
                                >

                                    {/* Top User Info */}
                                    <div
                                        className="px-3 py-3 mb-2"
                                        style={{
                                            background: "#f8f9fa",
                                            borderRadius: "12px"
                                        }}
                                    >

                                        <p
                                            className="mb-1 text-uppercase"
                                            style={{
                                                fontSize: "10px",
                                                color: "#888",
                                                letterSpacing: "1px",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            Signed in as
                                        </p>

                                        <p
                                            className="mb-0 fw-bold"
                                            style={{
                                                fontSize: "14px"
                                            }}
                                        >
                                            {signUser?.email}
                                        </p>

                                    </div>

                                    <div
                                        className="px-3 mb-2"
                                        style={{
                                            fontSize: "10px",
                                            fontWeight: "bold",
                                            color: "#13a4ec",
                                            letterSpacing: "1px"
                                        }}
                                    >
                                        ACCOUNT
                                    </div>

                                    <Dropdown.Item
                                        href="/"
                                        className="d-flex align-items-center py-2 rounded"
                                    >
                                        <FontAwesomeIcon
                                            icon={faGlobe}
                                            className="me-3"
                                        />
                                        View Website
                                    </Dropdown.Item>

                                    <Dropdown.Item
                                        href="/profile"
                                        className="d-flex align-items-center py-2 rounded"
                                    >
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            className="me-3"
                                        />
                                        My Profile
                                    </Dropdown.Item>

                                    <Dropdown.Item
                                        href="/settings"
                                        className="d-flex align-items-center py-2 rounded"
                                    >
                                        <FontAwesomeIcon
                                            icon={faGear}
                                            className="me-3"
                                        />
                                        Settings
                                    </Dropdown.Item>

                                    <hr />

                                    <Dropdown.Item
                                        className="d-flex align-items-center py-2 text-danger rounded"
                                        onClick={logOutButton}
                                    >

                                        <FontAwesomeIcon
                                            icon={faRightFromBracket}
                                            className="me-3"
                                        />

                                        Sign Out

                                    </Dropdown.Item>

                                </Dropdown.Menu>

                            </Dropdown>

                        </div>

                    </Container>
                </Navbar>
            )}
        </>
    );
}