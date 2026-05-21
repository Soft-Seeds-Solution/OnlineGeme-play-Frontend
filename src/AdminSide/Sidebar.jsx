import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
    faXmark,
    faGamepad,
    faUsers,
    faTags,
    faUserShield,
    faChevronDown
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserContext from "../ContextApi/UserContext";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {

    const [openMenu, setOpenMenu] = useState("");

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? "" : menu);
    };

    const { signUser } = useContext(UserContext);

    // ✅ ADDED ONLY THIS
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="d-lg-none position-fixed top-0 start-0 w-100 h-100"
                    style={{
                        background: "rgba(0,0,0,0.5)",
                        zIndex: 20
                    }}
                />
            )}

            <aside
                className={`position-fixed top-0 start-0 bg-white border-end ${sidebarOpen ? "show-sidebar" : "hide-sidebar"}`}
                style={{
                    width: "280px",
                    height: "100vh",
                    zIndex: 30,
                    overflowY: "auto",
                    transition: "all 0.3s ease",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                }}
            >

                {/* Mobile Header */}
                <div className="d-flex align-items-center justify-content-between p-3 border-bottom d-lg-none">

                    <Link to="/adminPanel">
                        <img src="/logo.png" alt="Logo" style={{ width: "180px" }} />
                    </Link>

                    <button onClick={() => setSidebarOpen(false)}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>

                </div>

                <div className="p-3" style={{ marginTop: "70px" }}>

                    {/* Dashboard */}
                    {/* <Link
                        to="/adminPanel"
                        className={`sidebar-link ${isActive("/adminPanel") ? "active" : ""}`}
                    >
                        <div className="d-flex align-items-center">
                            <FontAwesomeIcon icon={faGauge} className="me-3" />
                            Dashboard
                        </div>
                    </Link> */}

                    {/* Games */}
                    <div className="mb-2">

                        <button
                            onClick={() => toggleMenu("games")}
                            className="sidebar-dropdown-btn"
                        >
                            <div>
                                <FontAwesomeIcon icon={faGamepad} className="me-3" />
                                Games
                            </div>

                            <FontAwesomeIcon
                                icon={faChevronDown}
                                style={{
                                    transition: "0.3s",
                                    transform: openMenu === "games" ? "rotate(180deg)" : "rotate(0deg)"
                                }}
                            />
                        </button>

                        <div style={{
                            maxHeight: openMenu === "games" ? "300px" : "0px",
                            overflow: "hidden",
                            transition: "0.3s"
                        }}>
                            {signUser?.role?.permissions?.includes("create games") && (
                                <Link to="upload-game" className={`sidebar-sublink ${isActive("/adminPanel/upload-game") ? "active" : ""}`}>
                                    Upload Game
                                </Link>
                            )}

                            <Link to="uploaded-games" className={`sidebar-sublink ${isActive("/adminPanel/uploaded-games") ? "active" : ""}`}>
                                Uploaded Games
                            </Link>

                            {signUser?.role?.role === "Admin" && (
                                <Link to="pending-approval-games" className={`sidebar-sublink ${isActive("/adminPanel/pending-approval-games") ? "active" : ""}`}>
                                    Pending Approval Games
                                </Link>
                            )}

                            <Link to="feature-games" className={`sidebar-sublink ${isActive("/adminPanel/feature-games") ? "active" : ""}`}>
                                Feature Games
                            </Link>

                            <Link to="unpublish-games" className={`sidebar-sublink ${isActive("/adminPanel/unpublish-games") ? "active" : ""}`}>
                                UnPublish Games
                            </Link>

                            <Link to="pending-games" className={`sidebar-sublink ${isActive("/adminPanel/pending-games") ? "active" : ""}`}>
                                Pending Games
                            </Link>

                            <Link to="rejected-games" className={`sidebar-sublink ${isActive("/adminPanel/rejected-games") ? "active" : ""}`}>
                                Rejected Games
                            </Link>

                        </div>
                    </div>

                    {/* Users */}
                    <div className="mb-2">

                        <button onClick={() => toggleMenu("users")} className="sidebar-dropdown-btn">
                            <div>
                                <FontAwesomeIcon icon={faUsers} className="me-3" />
                                Users
                            </div>
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                style={{
                                    transition: "0.3s",
                                    transform: openMenu === "games" ? "rotate(180deg)" : "rotate(0deg)"
                                }}
                            />
                        </button>

                        <div style={{
                            maxHeight: openMenu === "users" ? "300px" : "0px",
                            overflow: "hidden",
                            transition: "0.3s"
                        }}>

                            {signUser?.role?.permissions?.includes("create users") && (
                                <Link to="add-user" className={`sidebar-sublink ${isActive("/adminPanel/add-user") ? "active" : ""}`}>
                                    Add User
                                </Link>
                            )}

                            <Link to="all-users" className={`sidebar-sublink ${isActive("/adminPanel/all-users") ? "active" : ""}`}>
                                All Users
                            </Link>

                        </div>
                    </div>

                    {/* Roles */}
                    <div className="mb-2">

                        <button onClick={() => toggleMenu("roles")} className="sidebar-dropdown-btn">
                            <div>
                                <FontAwesomeIcon icon={faUserShield} className="me-3" />
                                Roles
                            </div>
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                style={{
                                    transition: "0.3s",
                                    transform: openMenu === "games" ? "rotate(180deg)" : "rotate(0deg)"
                                }}
                            />
                        </button>

                        <div style={{
                            maxHeight: openMenu === "roles" ? "300px" : "0px",
                            overflow: "hidden",
                            transition: "0.3s"
                        }}>

                            {/* {signUser?.role?.role === "Admin" && ( */}
                            <Link to="add-user-roles" className={`sidebar-sublink ${isActive("/adminPanel/add-user-roles") ? "active" : ""}`}>
                                Add User Roles
                            </Link>

                            {/* )} */}
                            <Link to="user-roles" className={`sidebar-sublink ${isActive("/adminPanel/user-roles") ? "active" : ""}`}>
                                User Roles
                            </Link>

                        </div>
                    </div>

                    {/* Categories */}
                    <div className="mb-2">

                        <button onClick={() => toggleMenu("categories")} className="sidebar-dropdown-btn">
                            <div>
                                <FontAwesomeIcon icon={faUsers} className="me-3" />
                                Categories
                            </div>
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                style={{
                                    transition: "0.3s",
                                    transform: openMenu === "games" ? "rotate(180deg)" : "rotate(0deg)"
                                }}
                            />
                        </button>

                        <div style={{
                            maxHeight: openMenu === "categories" ? "300px" : "0px",
                            overflow: "hidden",
                            transition: "0.3s"
                        }}>
                            {signUser?.role?.permissions?.includes("create games category") && (
                                <Link to="add-category" className={`sidebar-sublink ${isActive("/adminPanel/add-category") ? "active" : ""}`}>
                                    Add Category
                                </Link>
                            )}

                            <Link to="all-categories" className={`sidebar-sublink ${isActive("/adminPanel/all-categories") ? "active" : ""}`}>
                                All Categories
                            </Link>
                            {signUser?.role?.role === "Admin" && (
                                <Link to="pending-approval-category" className={`sidebar-sublink ${isActive("/adminPanel/pending-approval-category") ? "active" : ""}`}>
                                    Pending Categories
                                </Link>
                            )}

                        </div>
                    </div>

                    {/* Tags */}
                    <div className="mb-2">

                        <button onClick={() => toggleMenu("tags")} className="sidebar-dropdown-btn">
                            <div>
                                <FontAwesomeIcon icon={faTags} className="me-3" />
                                Tags
                            </div>
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                style={{
                                    transition: "0.3s",
                                    transform: openMenu === "games" ? "rotate(180deg)" : "rotate(0deg)"
                                }}
                            />
                        </button>

                        <div style={{
                            maxHeight: openMenu === "tags" ? "300px" : "0px",
                            overflow: "hidden",
                            transition: "0.3s"
                        }}>

                            <Link to="manage-tags" className={`sidebar-sublink ${isActive("/adminPanel/manage-tags") ? "active" : ""}`}>
                                Manage Tags
                            </Link>

                        </div>
                    </div>

                </div>
            </aside>

            {/* CSS */}
            <style>
                {`
                    .show-sidebar{
                        transform: translateX(0);
                    }

                    .hide-sidebar{
                        transform: translateX(-100%);
                    }

                    @media(min-width:992px){
                        .show-sidebar,
                        .hide-sidebar{
                            transform: translateX(0);
                        }
                    }

                    .sidebar-link{
                        display:flex;
                        align-items:center;
                        justify-content:space-between;
                        width:100%;
                        padding:12px 15px;
                        margin-bottom:8px;
                        border-radius:12px;
                        text-decoration:none;
                        color:#475569;
                        font-weight:600;
                        transition:0.3s;
                    }

                    .sidebar-link:hover{
                        background:#13a4ec;
                        color:white;
                    }

                    .sidebar-link.active,
                    .sidebar-sublink.active{
                        background:#13a4ec;
                        color:white;
                        box-shadow:0 5px 15px rgba(19,164,236,0.3);
                    }

                    .sidebar-dropdown-btn{
                        width:100%;
                        border:none;
                        background:transparent;
                        display:flex;
                        align-items:center;
                        justify-content:space-between;
                        padding:12px 15px;
                        border-radius:12px;
                        color:#475569;
                        font-weight:600;
                        transition:0.3s;
                    }

                    .sidebar-dropdown-btn:hover{
                        background:#f1f5f9;
                    }

                    .sidebar-sublink{
                        display:block;
                        padding:10px 15px 10px 50px;
                        text-decoration:none;
                        color:#64748b;
                        border-radius:10px;
                        margin-top:5px;
                        transition:0.3s;
                        font-size:14px;
                        font-weight:500;
                    }

                    .sidebar-sublink:hover{
                        background:#f8fafc;
                        color:#13a4ec;
                    }
                `}
            </style>
        </>
    );
}