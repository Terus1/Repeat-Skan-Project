import './App.css';
import {useEffect, useState} from "react";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {fetchWithToken, handleLogout} from "./api/api";
import Header from "./components/Header/Header";
import {Main} from "./components/Main/Main";
import Footer from "./components/Footer/Footer";
import Authorization from "./components/Authorization/Authorization";
import Search from "./components/Search/Search";
import Result from "./components/Result/Result";
import BurgerMenu from "./components/BurgerMenu/BurgerMenu";


function App() {
  const [accountInfo, setAccountInfo] = useState(null); // Состояние для данных аккаунта
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Состояние для проверки авторизации пользователя
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [previousPath, setPreviousPath] = useState(null) // Состояние для хранения пути
  const [toWhite, setToWhite] = useState(true)
  const navigate = useNavigate(); // Для перехода на другую страницу
  const location = useLocation(); // Хук для получения пути


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  const toggleWhite = () => {
    setToWhite(!toWhite)
  }

  const handleBurgerMenuClick = () => {
    if (!isMenuOpen) {
      //   Если меню открывыается, то сохраняем текущий путь
      setPreviousPath(location.pathname);
    } else {
      //   Если меню закрывается, возвращаем на сохраненный путь
      if (previousPath) {
        navigate(previousPath);
      }
    }
    toggleMenu()
  }

  // Проверка состояния авторизации при загрузке приложения
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Проверяем статус авторизации
    const accessToken = localStorage.getItem('accessToken');
    const tokenExpire = localStorage.getItem('tokenExpire');
    const currentTime = Date.now();

    if (tokenExpire && currentTime > tokenExpire) {
      console.log('Токен истек, требуется повторная авторизация');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('tokenExpire');
      localStorage.setItem('isLoggedIn', 'false');
      navigate('/authorization'); // Перенаправляем на страницу авторизации
    }


    // if (loggedIn && accessToken) {
    //   setIsLoggedIn(true);  // Устанавливаем флаг, что пользователь авторизован
    //   // Если пользователь авторизован, получаем информацию об аккаунте
    //   fetchWithToken('https://gateway.scan-interfax.ru/api/v1/account/info', accessToken)
    //     .then(data => {
    //       setAccountInfo(data)  // Передаём информацию об аккаунте
    //     })
    //     .catch(error => {
    //       console.error('Ошибка при получении информации об аккаутне', error)
    //       handleLogout({setAccountInfo, setIsLoggedIn, navigate}); // Выход из системы если токен не действителен
    //     })
    // }

  }, [navigate]);


  return (
    <div className={`app-container ${isMenuOpen ? 'app-container-open' : ''}`}> {/* Основной контейнер с flex */}
      <Header isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              accountInfo={accountInfo}
              setAccountInfo={setAccountInfo}
              handleLogout={handleLogout}
              handleBurgerMenuClick={handleBurgerMenuClick}
              toggleMenu={toggleMenu}
              isMenuOpen={isMenuOpen}
              toggleWhite={toggleWhite}
      />
      <div className="main-content"> {/* Контентная область */}

        <Routes>
          {/* Главная страница */}
          <Route path={"/"} element={<Main isLoggedIn={isLoggedIn} />}/>

          {/* Страница авторизации */}
          <Route path={"/authorization"} element={<Authorization setIsLoggedIn={setIsLoggedIn} setAccountInfo={setAccountInfo} />}/>

          {/* Страница поиска */}
          <Route path={"/search"} element={<Search />}/>

          {/* Страница результата */}
          <Route path={"/result"} element={<Result />}/>

          <Route path={"/burger"} element={<BurgerMenu handleBurgerMenuClick={handleBurgerMenuClick} toggleMenu={toggleMenu}/>}/>
        </Routes>

      </div>
      <Footer /> {/* Футер */}
    </div>
  );
}

export default App;
