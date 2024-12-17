import React, {useEffect, useState} from "react";
import './Header.css'

import logoHeader from '../../media/logo-header.svg';
import logoFooter from '../../media/logo-footer.svg';
import stick from '../../media/stick.svg';
import emptyPhoto from '../../photoUsers/emptyPhoto.jpg'
import loader from '../../media/loader.svg'
import burgerMenuOpen from '../../media/burger-menu-open.svg'
import burgerMenuClose from '../../media/burger-menu-close.svg'
import {Link, useNavigate} from "react-router-dom";
import {fetchWithToken} from "../../api/api";



const Header = ({isLoggedIn, setIsLoggedIn, accountInfo, setAccountInfo, handleLogout, loading, setLoading,
                    handleBurgerMenu, setHandleBurgerMenu, toggleMenu,}) => {
    // const [loading, setLoading] = useState(true)    // Состояние для лоадера
    const [isTokenExpired, setIsTokenExpired] = useState(false);
    const navigate = useNavigate(); // Хук для навигации
    const [menuOpen, setMenuOpen] = useState(false); // Управление состоянием меню


    useEffect(() => {
        const checkTokenExpiration = () => {
            const tokenExpire = new Date(localStorage.getItem('tokenExpire')).getTime();
            const currentTime = Date.now();
            // const accessToken = localStorage.getItem('accessToken')
            if (accountInfo) {
                console.log('Данные есть!', accountInfo)
            } else {
                console.log('Данных пока нет :(')
            }

            // Преверяем, не истёк ли токен
            if (currentTime > tokenExpire) {
                //Токен истёк, очищяем данные и перенаправляем на авторизацию
                // console.log('Токен истёк')
                setIsTokenExpired(true)
                navigate('/authorization');
            } else {
                setIsTokenExpired(false)  // Если токен не истёк
                // console.log('Токен не истёк')
                // console.log('tokenExpire', tokenExpire)
                // console.log('currentTime', currentTime)
                // console.log('accessToken', accessToken)
                // const maxNumber = Math.max(tokenExpire, currentTime)
                // console.log('Большее значение:', maxNumber === tokenExpire ? 'tokenExpire' : 'currentTime');


            }
            // console.log(isTokenExpired)
        };

        checkTokenExpiration()
    }, [accountInfo, navigate]);

    useEffect(() => {
        const savedToken = localStorage.getItem('accessToken');
        const savedAccountInfo = localStorage.getItem('accountInfo');
        console.log('savedAccountInfo', JSON.parse(savedAccountInfo));
        console.log('accountInfo', accountInfo)

        if (savedToken && savedAccountInfo && !accountInfo) {
            // setLoading(true);   // Включаем лоадер
            setAccountInfo(JSON.parse(savedAccountInfo));
            setIsLoggedIn(true);
            // setLoading(false);  // Выключаем лоадер
            // console.log('Новый accountInfo', JSON.parse(accountInfo));

        } else if (savedToken && !accountInfo) {
            setLoading(true)    // Включаем лоадер
            fetchWithToken('https://gateway.scan-interfax.ru/api/v1/account/info', savedToken)
                .then((accountInfo) => {
                    if (accountInfo) {
                        localStorage.setItem('accountInfo', JSON.stringify(accountInfo));
                        setAccountInfo(accountInfo);
                    }
                    setLoading(false);  // Выключаем лоадер
                })
                .catch((error) => {
                    console.error('Ошибка при загрузке данных', error);
                    setLoading(false);
            })

        } else {
            setLoading(false);  // Ничего не загружается (если нет токена)
        }
    }, [setAccountInfo, setIsLoggedIn, accountInfo, setLoading]); // Добавляем accountInfo, но используем проверку


    // useEffect(() => {
    //     const savedToken = localStorage.getItem('accessToken');
    //     if (savedToken && !accountInfo) {
    //         fetchWithToken('https://gateway.scan-interfax.ru/api/v1/account/info', savedToken)
    //             .then((dataFromServer) => {
    //                 const localUser = mockUsers.find(user => user.login === dataFromServer.login);
    //
    //                 const updatedAccountInfo = {
    //                     ...dataFromServer,
    //                     tariff: localUser?.tariff || null,
    //                     userPhoto: localUser?.userPhoto || null,
    //                 };
    //
    //                 setAccountInfo(updatedAccountInfo);
    //             });
    //     }
    // }, [accountInfo, setAccountInfo]);

    return(
        <div className={`global-header ${handleBurgerMenu ? 'open' : 'close'}`}>
            <header className="header">
                <div className="logo-header">
                    {window.innerWidth < 768 || handleBurgerMenu ?
                        (<img className={'logo'} src={logoFooter} alt="Логотип"/>) :
                        (<img className={'logo'} src={logoHeader} alt="Логотип"/>)
                    }
                </div>

                {/* Кнопка бургер меню */}
                <Link to={'/phone'}>
                <button className="burger-menu" onClick={toggleMenu}>
                        <img src={handleBurgerMenu ? burgerMenuClose : burgerMenuOpen} alt=""/>
                </button></Link>


                <div className={`navigation ${menuOpen ? 'open' : ''}`}>
                    <ul className="nav-list">
                        <Link to="/" className="list-item list-link">Главная</Link>
                        <li className="list-item"><a className="list-link" href="#">Тарифы</a></li>
                        <li className="list-item"><a className="list-link" href="#">FAQ</a></li>
                    </ul>
                </div>

                {isLoggedIn && !isTokenExpired ? (
                    <div className={`authorized ${menuOpen ? 'open' : ''}`}>
                        <div className="info-about-companies">
                            <p className="used-companies">Использовано
                                компаний: <span
                                    className="how-much-used-companies">{accountInfo?.eventFiltersInfo?.usedCompanyCount || '0'}</span>
                            </p>
                            <p className="limit-companies">Лимит по
                                компаниям: <span
                                    className="how-much-limit-companies">{accountInfo?.eventFiltersInfo?.companyLimit || '0'}</span>
                            </p>
                        </div>
                        <div className="info-about-user">
                            <div className="user-details">
                                <p className="user-name">{accountInfo?.fullName || 'Неизвестно'}</p>
                                <Link to="/" className="quit" onClick={handleLogout}>Выйти</Link>
                            </div>
                            <img src={accountInfo?.userPhoto || emptyPhoto} alt="userPhoto" className="photo-profile"/>
                        </div>
                    </div>
                ) : (
                    <div className={`my-office ${menuOpen ? 'open' : ''}`}>
                        <a className="sign-up" href="#">Зарегистрироваться</a>
                        <img src={stick} alt="stick"/>
                        <Link to="/authorization">
                            <button className="my-office-button"><span className="entrance">Войти</span></button>
                        </Link>
                    </div>
                )}
            </header>


        </div>
    )
}

export default Header;
