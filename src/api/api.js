//======================================================App.js==========================================================
import {mockUsers} from "../users";

// Функция для запроса с использованием токена
export const fetchWithToken = async (url, token, navigate) => {
  try {
    // Проверяем, не истек ли токен
    const tokenExpire = localStorage.getItem('tokenExpire');
    const currentTime = Date.now();

    // Если срок действия токена истек, перенаправляем на страницу логина
    if (tokenExpire && currentTime > tokenExpire) {
      // console.log('Токен истек, требуется повторная авторизация');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('tokenExpire');
      localStorage.setItem('isLoggedIn', 'false');
      navigate('/authorization'); // Перенаправление на страницу авторизации
      return { error: 'Токен истек, пожалуйста, авторизуйтесь снова' };
    }

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


//==================================================Authorization.jsx===================================================
// Функция для авторизации и получения токена (v2)

export const loginAndFetch = async (username, password, setIsLoggedIn, setAccountInfo, navigate) => {
  try {
    // Ищем пользователя в локальных данных
    // const localUser = mockUsers.find(user => user.login === username && user.password === password);

    // if (localUser) {
    //   // Если пользователь найден в mockUsers, то сохраняем его данные в состоянии и localStorage
    //   const accountInfo = {
    //     id: localUser.id,
    //     login: localUser.login,
    //     userPhoto: localUser.userPhoto, // Локальная аватарка
    //     tariff: localUser.tariff,
    //   };
    //
    //   // Сохранение состояния авторизации
    //   setIsLoggedIn(true);
    //   setAccountInfo(accountInfo);
    //
    //   // Сохраняем данные о пользователе в localStorage для последующих сессий
    //   localStorage.setItem('accountInfo', JSON.stringify(accountInfo));
    //   localStorage.setItem('accessToken', 'mockToken123'); // Моковый токен
    //
    //   console.log('Локальный вход выполнен для пользователя:', localUser.login);
    //   navigate('/');  // Перенаправление после успешного логина
    //   return;
    // }

    // Если пользователь не найден в mockUsers, выполняем запрос к серверу
    const response = await fetch('https://gateway.scan-interfax.ru/api/v1/account/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: username,
        password: password,
      }),
    });

    // Проверяем ответ от сервера
    if (!response.ok) {
      const errorMessage = `Ошибка авторизации: ${response.status}`;
      console.error(errorMessage);
      return { error: errorMessage };

    }

    const data = await response.json();
    const accessToken = data.accessToken;
    const expire = data.expire;

    // Сохранение токена в localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('tokenExpire', expire);
    // localStorage.setItem('tokenExpire', new Date(Date.now() - 5000).toISOString());
    localStorage.setItem('isLoggedIn', 'true');

    // console.log('Токен получен:', accessToken);
    // console.log('Срок действия токена до:', expire);


    setIsLoggedIn(true);

    // Выполняем защищённый запрос для получения accountInfo
    const accountInfoFromServer = await fetchWithToken('https://gateway.scan-interfax.ru/api/v1/account/info', accessToken);

    const localUser = mockUsers.find(user => user.login === username && user.password === password)

    if (!localUser) {
      // console.log('Пользователь с таким логином и паролем не найден в mockUsers!', username)
      return
    }
    // console.log('Найден пользователь в mockUsers!', localUser)

    // Объединяем данные из сервера с локальными данными
    const MergedAccountInfo = {
      ...accountInfoFromServer, // Данные с сервера
      tariff: localUser?.tariff || null, // Берём тариф из mockUsers
      userPhoto: localUser.userPhoto || null,  // Берём фото пользователя из mockUsers
      fullName: localUser.fullName || null, // Берём Имя пользователя из mockUsers
    }

    // Устанавливаем и сохраняем данные о аккаунте
    setAccountInfo(MergedAccountInfo);
    // console.log('MergedAccountInfo', MergedAccountInfo)
    localStorage.setItem('accountInfo', JSON.stringify(MergedAccountInfo));

    // Перенаправление на главную страницу
    navigate('/');
  } catch (error) {
    console.error('Ошибка:', error);
  }
};



// // Функция для авторизации и получения токена (v1)
// export const loginAndFetch = async (username, password, setIsLoggedIn, setAccountInfo, navigate) => {
//   try {
//     // 1. Авторизация (логин)
//     const response = await fetch('https://gateway.scan-interfax.ru/api/v1/account/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         login: username,
//         password: password,
//       }),
//     });
//
//     // Проверяем ответ
//     if (!response.ok) {
//       const errorMessage = `Ошибка авторизации: ${response.status}`;
//       console.error(errorMessage);
//       return { error: errorMessage }; // Возвращаем объект с ошибкой вместо выброса исключения
//     }
//
//     const data = await response.json();
//
//     // Получение accessToken и даты истечения действия токена
//     const accessToken = data.accessToken;
//     const expire = data.expire;
//
//     // Сохранение токена в localStorage
//     localStorage.setItem('accessToken', accessToken);
//     localStorage.setItem('tokenExpire', expire);
//     localStorage.setItem('isLoggedIn', 'true'); // Сохранение состояния
//
//
//     console.log('Токен получен:', accessToken);
//     console.log('Срок действия токена до:', expire);
//
//     // После успешной авторизации изменить состояние на авторизованное
//     setIsLoggedIn(true);
//
//     // Выполняем защищённый запрос и получаем accountInfo
//     const accountInfo = await fetchWithToken('https://gateway.scan-interfax.ru/api/v1/account/info', accessToken);
//
//     // Сохраняем информацию о аккаунте в состоянии
//     setAccountInfo(accountInfo);
//     console.log(`accountInfo`, accountInfo);
//     console.log(await fetchWithToken('https://gateway.scan-interfax.ru/api/v1/account/info', accessToken))
//     // Сохранение информации об аккаунте в localStorage
//     localStorage.setItem('accountInfo', JSON.stringify(accountInfo));  // Сохраняем объект как строку
//
//     // Выводим только usedCompanyCount
//     console.log('Used Company Count:', accountInfo.eventFiltersInfo.usedCompanyCount);
//
//     // Выводим только companyLimit
//     console.log('CompanyLimit:', accountInfo.eventFiltersInfo.companyLimit);
//
//     // 2. После успешной авторизации, выполнить защищённый запрос
//     await fetchWithToken('https://gateway.scan-interfax.ru/api/v1/account/info', accessToken);
//     await fetchWithToken('https://gateway.scan-interfax.ru/api/v1/account/balance', accessToken);
//     // await fetchWithToken('https://gateway.scan-interfax.ru/api/v1/account/purchaseHistory', accessToken);
//
//     // Перенаправление на главную страницу
//     navigate('/');
//
//   } catch (error) {
//     console.error('Ошибка:', error);
//   }
// };




//====================================================Search.jsx========================================================

// Функция для проверки валидности ИНН
export const validateInn = (inn, setError) => {
  let result = false;

  // Преобразование типа ИНН
  if (typeof inn === 'number') {
    inn = inn.toString();
  } else if (typeof inn !== 'string') {
    inn = '';
  }

  // Если поле очищено, сразу сбрасываем ошибку и завершаем выполнение
  if (!inn.length) {
    setError({ message: '' }); // Очищаем ошибку
    return false; // Возвращаем false, так как ИНН невалиден, но ошибки нет
  }

  // Функция для расчёта контрольного числа
  const checkDigit = (inn, coefficients) => {
    let n = 0;
    for (let i in coefficients) {
      n += coefficients[i] * inn[i];
    }
    return parseInt(n % 11 % 10);
  };

  // Проверка длины и контрольного числа
  if (inn.length === 10) {
    let n10 = checkDigit(inn, [2, 4, 10, 3, 5, 9, 4, 6, 8]);
    if (n10 === parseInt(inn[9])) {
      result = true; // Валидный ИНН
    }
  }

  // Устанавливаем ошибку или очищаем её
  if (!result) {
    setError({ message: 'Некорректные данные' });
  } else {
    setError({ message: '' }); // Очищаем ошибку при успешной проверке
  }

  return result;
};





// Функция для проверки дат
export const validateDates = (start, end, setDateError) => {
  const today = new Date(); // Текущая дата
  const startDate = new Date(start);
  const endDate = new Date(end);

  // Проверяем, чтобы даты не были в будущем
  if (startDate > today || endDate > today) {
    setDateError('Дата не может быть в будущем');
    return false;
  }

  // Проверяем, чтобы дата начала была не позже даты конца
  if (start && end && startDate > endDate) {
    setDateError('Дата начала не может быть позже даты конца');
    return false;
  }

  setDateError(''); // Если ошибок нет, очищаем сообщение об ошибке
  return true;
};

// Функция для проверки тональности
export const validateTonality = (tonality, setTonalityValid) => {
  if(tonality === '') {
    setTonalityValid(false)
    return false
  }
  setTonalityValid(true)
  return true
}


// Функция для проверки валидности документов
export const validateDocuments = (documents, setDocuments) => {
  const numLimit = Number(documents)
  if(numLimit < 0 || numLimit > 100 || documents === ''){
    setDocuments(false)
    return false
  }
  setDocuments(true)
  return true
}
