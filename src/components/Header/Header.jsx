import React, {useEffect, useState} from "react";
import './Header.css'

import logoHeader from '../../media/logo-header.svg';
import stick from '../../media/stick.svg';
import cat from '../../media/cat.jpg';
import {Link} from "react-router-dom";
import {fetchWithToken} from "../../api/api";


const Header = ({isLoggedIn, setIsLoggedIn, accountInfo, setAccountInfo, handleLogout}) => {
    const [loading, setLoading] = useState(true)    // Состояние для лоадера


    useEffect(() => {
        // Проверяем есть ли токен и данные в localStorage
        const savedToken = localStorage.getItem('accessToken');
        const savedAccountInfo = localStorage.getItem('accountInfo');

        if (savedToken && savedAccountInfo) {
            // Если данные есть, парсим и устанавливаем в состояние
            setAccountInfo(JSON.parse(savedAccountInfo));   // Передаем данные об аккаунте в accountInfo
            setIsLoggedIn(true);    // Ставим флаг в true, что пользователь авторизован
            setLoading(false)   // Отключаем лоадер
        } else if (savedToken) {
            // Если токен есть, но нет информации о пользователе, делаем запрос для её получения
            fetchWithToken('https://gateway.scan-interfax.ru/api/v1/account/info', savedToken)
                .then((accountInfo) => {
                    if (accountInfo) {
                        localStorage.setItem('accountInfo', JSON.parse(accountInfo));   // Сохраняем в localStorage
                        setAccountInfo(accountInfo);    // Устанавливаем в состояние
                        setLoading(false);  // Отключаем лоадер
                    }
                });
        } else {
            setLoading(false);  // Если нет токена, отключаем лоадер
        }
    }, [setAccountInfo, setIsLoggedIn]);

    return(
        <>
            <header className="header">
                <div className="logo-header">
                    <img src={logoHeader} alt="Логотип"/>
                </div>

                <div className="navigation">
                    <ul className="nav-list">
                        <li className="list-item"><a className="list-link" href="#">Главная</a></li>
                        <li className="list-item"><a className="list-link" href="#">Тарифы</a></li>
                        <li className="list-item"><a className="list-link" href="#">FAQ</a></li>
                    </ul>
                </div>

                {isLoggedIn ? (
                    <div className="authorized">
                        {loading ? (
                            // Лоадер, если данные загружаются
                            <div className="info-about-companies">
                                <p className="loading-text">Загрузка информации...</p>
                            </div>
                        ) : (
                            // Информация о компаниях
                            <div className="info-about-companies">
                                <p className="used-companies">Использовано
                                    компаний: <span className="how-much-used-companies">{accountInfo?.eventFiltersInfo?.usedCompanyCount || '0'}</span></p>
                                <p className="limit-companies">Лимит по
                                    компаниям: <span className="how-much-limit-companies">{accountInfo?.eventFiltersInfo?.companyLimit || '0'}</span></p>
                            </div>
                        )}

                        <p className="user-name">Вася П.</p>
                        <img src={cat} alt="cat" className="photo-profile"/>

                        <Link to="/" className="quit" onClick={handleLogout}>Выйти</Link>
                    </div>
                ) : (
                    <div className="my-office">
                        <a className="sign-up" href="#">Зарегистрироваться</a>
                        <img src={stick} alt="stick"/>

                        <Link to="/authorization">
                            <button className="my-office-button"><span className="entrance">Войти</span></button>
                        </Link>
                    </div>
                )}
            </header>
        </>
    )
}

export default Header;
