import './App.css';
import {useEffect, useState} from "react";
import {Route, Routes, useNavigate} from "react-router-dom";
import {fetchWithToken, handleLogout} from "./api/api";
import Header from "./components/Header/Header";
import {Main} from "./components/Main/Main";
import Footer from "./components/Footer/Footer";
import Authorization from "./components/Authorization/Authorization";
import Search from "./components/Search/Search";


function App() {
  const [accountInfo, setAccountInfo] = useState(null); // Состояние для данных аккаунта
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Состояние для проверки авторизации пользователя
  const navigate = useNavigate(); // Для перехода на другую страницу

  // Проверка состояния авторизации при загрузке приложения
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Проверяем статус авторизации
    const accessToken = localStorage.getItem('accessToken');

    if (loggedIn && accessToken) {
      setIsLoggedIn(true);  // Устанавливаем флаг, что пользователь авторизован
      // Если пользователь авторизован, получаем информацию об аккаунте
      fetchWithToken('https://gateway.scan-interfax.ru/api/v1/account/info', accessToken)
        .then(data => {
          setAccountInfo(data)  // Передаём информацию об аккаунте
        })
        .catch(error => {
          console.error('Ошибка при получении информации об аккаутне', error)
          handleLogout({setAccountInfo, setIsLoggedIn, navigate}); // Выход из системы если токен не действителен
        })
    }

  }, [navigate]);


  return (
    <div className="app-container"> {/* Основной контейнер с flex */}
      <Header isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              accountInfo={accountInfo}
              setAccountInfo={setAccountInfo}
              handleLogout={handleLogout}/>
      <div className="main-content"> {/* Контентная область */}

        <Routes>
          {/* Главная страница */}
          <Route path={"/"} element={<Main isLoggedIn={isLoggedIn} />}/>

          {/* Страница авторизации */}
          <Route path={"/authorization"} element={<Authorization setIsLoggedIn={setIsLoggedIn} setAccountInfo={setAccountInfo} />}/>

          {/* Страница поиска */}

          <Route path={"/search"} element={<Search />}/>
        </Routes>

      </div>
      <Footer /> {/* Футер */}
    </div>
  );
}

export default App;
