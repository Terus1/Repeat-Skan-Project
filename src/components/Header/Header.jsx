import React, {useEffect, useState} from "react";
import './Header.css'

import logoHeader from '../../media/logo-header.svg';
import stick from '../../media/stick.svg';
import emptyPhoto from '../../photoUsers/emptyPhoto.jpg'
import {Link, useNavigate} from "react-router-dom";
import {fetchWithToken} from "../../api/api";



const Header = ({isLoggedIn, setIsLoggedIn, accountInfo, setAccountInfo, handleLogout}) => {
    const [loading, setLoading] = useState(true)    // Состояние для лоадера
    const [isTokenExpired, setIsTokenExpired] = useState(false);
    const navigate = useNavigate(); // Хук для навигации

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
            setAccountInfo(JSON.parse(savedAccountInfo));
            setIsLoggedIn(true);
            setLoading(false);
            console.log('Новый accountInfo', JSON.parse(accountInfo));
        } else if (savedToken && !accountInfo) {
            fetchWithToken('https://gateway.scan-interfax.ru/api/v1/account/info', savedToken)
                .then((accountInfo) => {
                    if (accountInfo) {
                        localStorage.setItem('accountInfo', JSON.stringify(accountInfo));
                        setAccountInfo(accountInfo);
                        setLoading(false);
                    }
                });
        } else {
            setLoading(false);
        }
    }, [setAccountInfo, setIsLoggedIn, accountInfo]); // Добавляем accountInfo, но используем проверку

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

                {isLoggedIn && !isTokenExpired ? (
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
                        <div className="info-about-user">
                            <div className="user-details">
                                <p className="user-name">{accountInfo?.fullName || 'Неизвестно'}</p>
                                <Link to="/" className="quit" onClick={handleLogout}>Выйти</Link>
                            </div>
                            <img src={accountInfo.userPhoto || emptyPhoto} alt="userPhoto" className="photo-profile"/>
                        </div>

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
