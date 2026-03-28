import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import GameCatProvider from './ContextApi/GameCatProvider';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Category from './AdminSide/GameCat/Category';
import AdminPanel from './AdminSide/AdminPanel';
import GamesIndexPage from './AdminSide/Games/GamesIndexPage';
import GameProvider from './ContextApi/GameProvider';
import GamePage from './Pages/Home/GamePage';
import GameDetailPage from './Pages/GameDetailPage';
import Login from './Pages/authPage/Login';
import UserProvider from './ContextApi/UserProvider';
import { useContext } from 'react';
import UserContext from './ContextApi/UserContext';
import Page404 from './Pages/Page404';
import GameCatPage from './Pages/GameCatPage';
import AboutPage from './Pages/About/AboutPage';
import Footer from './Components/Footer';
import ContactPage from './Pages/Contact/ContactPage';
import MoveToTop from './MoveToTop';
import SignUp from './Pages/authPage/Signup';
import TrackProvider from './ContextApi/TrackProvider';
import UserPanel from './UserSide/UserPanel';
import Favourites from './UserSide/Favourites';
import RecentTrack from './UserSide/RecentTrack';
import SearchGames from './Pages/SearchGames';
import UserNavbar from './Components/UserNavbar';
import AllCategories from './Pages/AllCategories';
import TrackFavourites from './ContextApi/FavouriteProvider';
import FeatureGame from './AdminSide/Games/FeatureGame';
import TopLikeGames from './Pages/TopLikeGames';
import TopViewGames from './Pages/TopViewGames';
import UserUploadGame from './UserSide/UserUploadGame';
import PendingGames from './AdminSide/Games/PendingGames';
import RejectedGames from './AdminSide/Games/RejectedGames';
import UserLayout from './Components/UserLayout';
import { HelmetProvider } from 'react-helmet-async';
import UploadedGamesRecord from './UserSide/UploadedGamesRecord';
import ExportGamesToJson from './ExportedGamesToJson';
import usePageTracking from './hook/UsePageTracking';
import UploadBlog from './AdminSide/Blogs/AddBlog';
import BlogsProvider from './ContextApi/BlogsProvider';
import Blogs from './Pages/Blogs/Blogs';
import BlogDetail from './Pages/Blogs/BlogDetail';
import UnPublish from './AdminSide/Games/UnPublish';
import AddCategory from './AdminSide/Category/AddCategory';
import Categories from './AdminSide/Category/Categories';
import MainPage from './Pages/PrivacyPolicy/MainPage';
import DisclaimerMainPage from './Pages/Disclaimer/DisclaimerMainPage';
import TermsMainPage from './Pages/TermsAndConditions/TermsMainPage';
import DMCAainPage from './Pages/DMCA/DMCAMainPage';
import CookiesMainPage from './Pages/CookiesPolicy/CookiesMainPage';
import AddTags from './AdminSide/Tags/AddTags';
import GameTagPage from './Pages/GameTagPage';
import { useState } from 'react';
import { useEffect } from 'react';
import Loader from './Pages/Loader';
import GameContext from './ContextApi/GameContext';
import GameCatContext from './ContextApi/GameCatContext';

function App() {

  return (
    <>
      <Router>
        <GameCatProvider>
          <GameProvider>
            <UserProvider>
              <TrackProvider>
                <BlogsProvider>
                  <TrackFavourites>
                    <MoveToTop />
                    <UserNavbar />
                    {/* <PrefetchGames /> */}
                    <UserLayout />
                    <ExportGamesToJson />
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
    </>
  )
}

export default App

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

        {subRoutes.map((routes, index) => (
          <Route
            key={index}
            path={routes.path}
            element={routes.module}
          >
            {/* {
              routes.subPaths.map((routes, index) => (
                <Route
                  key={index}
                  path={routes.path}
                  element={routes.module}
                />
              ))
            } */}
          </Route>
        ))}
        {adminRoutes.map((routes, index) => (
          pathname.includes("/adminPanel") && signUser?.role === "Admin" ?
            <Route
              key={index}
              path={routes.path}
              element={routes.module}
            >
              {
                routes.subPaths.map((routes, index) => (
                  <Route
                    key={index}
                    path={routes.path}
                    element={routes.module}
                  />
                ))
              }
            </Route>
            : <Route key={index} path='*' element={<Page404 />} />
        ))}
        {userRoutes.map((routes, index) => (
          pathname.includes("/userPanel") && signUser?.role === "User" ?
            <Route
              key={index}
              path={routes.path}
              element={routes.module}
            >
              {
                routes.subPaths.map((routes, index) => (
                  <Route
                    key={index}
                    path={routes.path}
                    element={routes.module}
                  />
                ))
              }
            </Route>
            : <Route key={index} path='*' element={<Page404 />} />
        ))}
      </Routes >
    </>
  )
}
