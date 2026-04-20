import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-quill/dist/quill.snow.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { useContext, useEffect, useState, lazy } from 'react';

import GameCatProvider from './ContextApi/GameCatProvider';
import GameProvider from './ContextApi/GameProvider';
import UserProvider from './ContextApi/UserProvider';
import TrackProvider from './ContextApi/TrackProvider';
import BlogsProvider from './ContextApi/BlogsProvider';
import TrackFavourites from './ContextApi/FavouriteProvider';
import UserContext from './ContextApi/UserContext';
import GameContext from './ContextApi/GameContext';
import GameCatContext from './ContextApi/GameCatContext';

import MoveToTop from './MoveToTop';
import Footer from './Components/Footer';
import UserNavbar from './Components/UserNavbar';
import UserLayout from './Components/UserLayout';
import Loader from './Pages/Loader';
import { HelmetProvider } from 'react-helmet-async';
import usePageTracking from './hook/UsePageTracking';

// ===================== LAZY IMPORTS =====================

// Pages
const GamePage = lazy(() => import('./Pages/Home/GamePage'));
const GameDetailPage = lazy(() => import('./Pages/GameDetailPage'));
const Login = lazy(() => import('./Pages/authPage/Login'));
const SignUp = lazy(() => import('./Pages/authPage/Signup'));
const SearchGames = lazy(() => import('./Pages/SearchGames'));
const GameCatPage = lazy(() => import('./Pages/GameCatPage'));
const GameTagPage = lazy(() => import('./Pages/GameTagPage'));
const AboutPage = lazy(() => import('./Pages/About/AboutPage'));
const ContactPage = lazy(() => import('./Pages/Contact/ContactPage'));
const AllCategories = lazy(() => import('./Pages/AllCategories'));
const TopLikeGames = lazy(() => import('./Pages/TopLikeGames'));
const TopViewGames = lazy(() => import('./Pages/TopViewGames'));
const Blogs = lazy(() => import('./Pages/Blogs/Blogs'));
const BlogDetail = lazy(() => import('./Pages/Blogs/BlogDetail'));

// Policies
const MainPage = lazy(() => import('./Pages/PrivacyPolicy/MainPage'));
const DisclaimerMainPage = lazy(() => import('./Pages/Disclaimer/DisclaimerMainPage'));
const TermsMainPage = lazy(() => import('./Pages/TermsAndConditions/TermsMainPage'));
const DMCAainPage = lazy(() => import('./Pages/DMCA/DMCAMainPage'));
const CookiesMainPage = lazy(() => import('./Pages/CookiesPolicy/CookiesMainPage'));

// Admin
const AdminPanel = lazy(() => import('./AdminSide/AdminPanel'));
const Category = lazy(() => import('./AdminSide/GameCat/Category'));
const AddCategory = lazy(() => import('./AdminSide/Category/AddCategory'));
const Categories = lazy(() => import('./AdminSide/Category/Categories'));
const GamesIndexPage = lazy(() => import('./AdminSide/Games/GamesIndexPage'));
const FeatureGame = lazy(() => import('./AdminSide/Games/FeatureGame'));
const UnPublish = lazy(() => import('./AdminSide/Games/UnPublish'));
const PendingGames = lazy(() => import('./AdminSide/Games/PendingGames'));
const RejectedGames = lazy(() => import('./AdminSide/Games/RejectedGames'));
const UploadBlog = lazy(() => import('./AdminSide/Blogs/AddBlog'));
const AddTags = lazy(() => import('./AdminSide/Tags/AddTags'));

// User
const UserPanel = lazy(() => import('./UserSide/UserPanel'));
const Favourites = lazy(() => import('./UserSide/Favourites'));
const RecentTrack = lazy(() => import('./UserSide/RecentTrack'));
const UserUploadGame = lazy(() => import('./UserSide/UserUploadGame'));
const UploadedGamesRecord = lazy(() => import('./UserSide/UploadedGamesRecord'));

import Page404 from './Pages/Page404';

// ===================== APP =====================

function App() {
  return (
    <Router>
      <GameCatProvider>
        <GameProvider>
          <UserProvider>
            <TrackProvider>
              <BlogsProvider>
                <TrackFavourites>

                  <MoveToTop />
                  <UserNavbar />
                  <UserLayout />

                  <HelmetProvider>
                    <GameRoutes />
                  </HelmetProvider>

                  <Footer />

                </TrackFavourites>
              </BlogsProvider>
            </TrackProvider>
          </UserProvider>
        </GameProvider>
      </GameCatProvider>
    </Router>
  )
}

export default App

// ===================== ROUTES =====================

function GameRoutes() {
  usePageTracking()

  const { signUser } = useContext(UserContext)
  const { pathname } = useLocation()
  const { AllGames } = useContext(GameContext);
  const { categories } = useContext(GameCatContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (AllGames?.length > 0 || categories?.length > 0) {
      setLoading(false);
    }
  }, [AllGames, categories]);

  const subRoutes = [
    { path: "/", module: <GamePage /> },
    { path: "/:title", module: <GameDetailPage /> },
    { path: "/category/*", module: <GameCatPage /> },
    { path: "/tag/:tagGames", module: <GameTagPage /> },
    { path: "/about-us", module: <AboutPage /> },
    { path: "/contact-us", module: <ContactPage /> },
    { path: "/privacy-policy", module: <MainPage /> },
    { path: "/disclaimer", module: <DisclaimerMainPage /> },
    { path: "/terms-conditions", module: <TermsMainPage /> },
    { path: "/DMCA", module: <DMCAainPage /> },
    { path: "/cookies", module: <CookiesMainPage /> },
    { path: "/userLogin", module: <Login /> },
    { path: "/signup", module: <SignUp /> },
    { path: "/search", module: <SearchGames /> },
    { path: "/all-categories", module: <AllCategories /> },
    { path: "/popular-games", module: <TopLikeGames /> },
    { path: "/top-views-games", module: <TopViewGames /> },
    { path: "/blogs", module: <Blogs /> },
    { path: "/blog/:postSlug", module: <BlogDetail /> },
  ];

  const adminRoutes = [
    {
      path: "/adminPanel",
      module: <AdminPanel />,
      subPaths: [
        { path: "manage-categories", module: <Category /> },
        { path: "add-category", module: <AddCategory /> },
        { path: "all-categories", module: <Categories /> },
        { path: "manage-games", module: <GamesIndexPage /> },
        { path: "feature-games", module: <FeatureGame /> },
        { path: "unpublish-games", module: <UnPublish /> },
        { path: "pending-games", module: <PendingGames /> },
        { path: "rejected-games", module: <RejectedGames /> },
        { path: "upload-blog", module: <UploadBlog /> },
        { path: "manage-tags", module: <AddTags /> },
      ],
    }
  ];

  const userRoutes = [
    {
      path: "/userPanel",
      module: <UserPanel />,
      subPaths: [
        { path: "favourites", module: <Favourites /> },
        { path: "recent-played-games", module: <RecentTrack /> },
        { path: "user-manage-game", module: <UserUploadGame /> },
        { path: "user-uploaded-games-record", module: <UploadedGamesRecord /> },
      ],
    }
  ];

  return (
    <>
      {loading && <Loader />}
      <Routes>

        {/* MAIN ROUTES */}
        {subRoutes.map((routes, index) => (
          <Route
            key={index}
            path={routes.path}
            element={routes.module}
          />
        ))}

        {/* ADMIN ROUTES */}
        {pathname.includes("/adminPanel") && signUser?.role === "Admin" &&
          adminRoutes.map((routes, index) => (
            <Route key={index} path={routes.path} element={routes.module}>
              {routes.subPaths.map((r, i) => (
                <Route key={i} path={r.path} element={r.module} />
              ))}
            </Route>
          ))
        }

        {/* USER ROUTES */}
        {pathname.includes("/userPanel") && signUser?.role === "User" &&
          userRoutes.map((routes, index) => (
            <Route key={index} path={routes.path} element={routes.module}>
              {routes.subPaths.map((r, i) => (
                <Route key={i} path={r.path} element={r.module} />
              ))}
            </Route>
          ))
        }

        {/* 404 */}
        <Route path="*" element={<Page404 />} />

      </Routes>
    </>
  )
}