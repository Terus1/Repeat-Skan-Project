import './App.css';
import {useEffect, useState} from "react";
import {Route, Routes, useNavigate} from "react-router-dom";
import {fetchWithToken, handleLogout} from "./api/api";
import Header from "./components/Header/Header";
import {Main} from "./components/Main/Main";
import Footer from "./components/Footer/Footer";
import Authorization from "./components/Authorization/Authorization";
import Search from "./components/Search/Search";
import Result from "./components/Result/Result";
import {Phone} from "./components/Phone/Phone";


function App() {
  const [accountInfo, setAccountInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [handleBurgerMenu, setHandleBurgerMenu] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setHandleBurgerMenu((prev) => !prev);
  };


  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="app-container">
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        accountInfo={accountInfo}
        setAccountInfo={setAccountInfo}
        handleLogout={handleLogout}
        loading={loading}
        setLoading={setLoading}
        handleBurgerMenu={handleBurgerMenu}
        setHandleBurgerMenu={setHandleBurgerMenu}
        toggleMenu={toggleMenu}
      />
      <div className="main-content">
        <Routes>
          {!isMobileView ? (
            <Route path="/" element={<Main isLoggedIn={isLoggedIn} />} />
          ) : (
            <Route
              path="/" element={
                <Phone
                  isLoggedIn={isLoggedIn}
                  handleBurgerMenu={handleBurgerMenu}
                  setHandleBurgerMenu={setHandleBurgerMenu}
                />
              }
            />
          )}
          <Route
            path="/authorization"
            element={
              <Authorization
                setIsLoggedIn={setIsLoggedIn}
                setAccountInfo={setAccountInfo}
                loading={loading}
                setLoading={setLoading}
                handleBurgerMenu={handleBurgerMenu}
                setHandleBurgerMenu={setHandleBurgerMenu}
              />
            }
          />
          <Route path="/search" element={<Search />} />
          <Route path="/result" element={<Result />} />

          <Route path={'/phone'} element={<Phone />} />
        </Routes>
      </div>
      {!isMobileView && <Footer />}
    </div>
  );
}

export default App;
