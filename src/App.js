import './App.css';
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {fetchWithToken, handleLogout} from "./api/api";
import Header from "./components/Header/Header";


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
    <>
      <Header isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              accountInfo={accountInfo}
              setAccountInfo={setAccountInfo}
              handleLogout={handleLogout}/>
    </>
  );
}

export default App;
