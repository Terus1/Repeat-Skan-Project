//======================================================App.js==========================================================


// Функция для запроса с использованием токена
export const fetchWithToken = async (url, token) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Проверяем ответ
    if (!response.ok) {
      const errorMessage = `Ошибка запроса: ${response.status}`;
      console.error(errorMessage);
      return { error: errorMessage }; // Возвращаем объект с ошибкой вместо выброса исключения
    }

    return await response.json(); // Возвращаем данные
  } catch (error) {
    console.error('Ошибка запроса:', error);
    return null;
  }
};


// Функция для выхода пользователя из системы
export const handleLogout = ({setIsLoggedIn, setAccountInfo, navigate}) => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('tokenExpire');
  localStorage.removeItem('isLoggedIn');
  setIsLoggedIn(false);
  setAccountInfo(null);
  navigate('/authorization')

}


