import React, { useEffect, useState } from "react";
import './Header.css';

import logoHeader from '../../media/logo-header.svg';
import logoFooter from '../../media/logo-footer.svg'
import stick from '../../media/stick.svg';
import emptyPhoto from '../../photoUsers/emptyPhoto.jpg';
import {Link, useLocation, useNavigate} from "react-router-dom";
import { fetchWithToken } from "../../api/api";
import openBurgerMenu from '../../media/burger-menu.svg';
import closeBurgerMenu from '../../media/closeBurgerMenu.svg'

const Header = ({ isLoggedIn, setIsLoggedIn, accountInfo, setAccountInfo, handleLogout,
                    toggleMenu, isMenuOpen, handleBurgerMenuClick, toggleWhite}) => {
    const [loading, setLoading] = useState(true); // Состояние для лоадера
    const [isTokenExpired, setIsTokenExpired] = useState(false);
    const navigate = useNavigate(); // Хук для навигации


    useEffect(() => {
        const checkTokenExpiration = () => {
            const tokenExpire = new Date(localStorage.getItem('tokenExpire')).getTime();
            const currentTime = Date.now();

            if (currentTime > tokenExpire) {
                setIsTokenExpired(true);
                navigate('/authorization');
            } else {
                setIsTokenExpired(false);
            }
        };

        checkTokenExpiration();
    }, [accountInfo, navigate]);

    useEffect(() => {
        const savedToken = localStorage.getItem('accessToken');
        const savedAccountInfo = localStorage.getItem('accountInfo');
        if (savedToken && savedAccountInfo && !accountInfo) {
            setAccountInfo(JSON.parse(savedAccountInfo));
            setIsLoggedIn(true);
            setLoading(false);
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
    }, [setAccountInfo, setIsLoggedIn, accountInfo]);

    return (
        <>
            <header className={`header`}>
                <div className="logo-header">
                    <Link to='/'><img className="logo-header" src={!isMenuOpen ? logoHeader : logoFooter} alt="Логотип"
                    /> </Link>
                </div>

                <div className="navigation">
                <ul className="nav-list">
                        <Link to="/" className="list-item list-link">Главная</Link>
                        <li className="list-item">
                            <a className="list-link" href="#" onClick={(e) => e.preventDefault()}>Тарифы</a>
                        </li>
                        <li className="list-item">
                            <a className="list-link" href="#" onClick={(e) => e.preventDefault()}>FAQ</a>
                        </li>
                    </ul>
                </div>

                {isLoggedIn && !isTokenExpired ? (
                    <div className="authorized">
                        {loading ? (
                            <div className="info-about-companies">
                                <p className="loading-text">Загрузка информации...</p>
                            </div>
                        ) : (
                            <div className={`info-about-companies ${isMenuOpen ? 'info-close' : ''}`}>
                                <p className="used-companies">
                                    Использовано компаний:
                                    <span className="how-much-used-companies">
                                        {accountInfo?.eventFiltersInfo?.usedCompanyCount || '0'}
                                    </span>
                                </p>
                                <p className="limit-companies">
                                    Лимит по компаниям:
                                    <span className="how-much-limit-companies">
                                        {accountInfo?.eventFiltersInfo?.companyLimit || '0'}
                                    </span>
                                </p>
                            </div>
                        )}

                        <div className="burger-menu" onClick={handleBurgerMenuClick}>
                            {!isMenuOpen ? (
                                <Link to={"/burger"}><img src={!isMenuOpen ? openBurgerMenu : closeBurgerMenu}
                                                          alt="burger-menu"/></Link>
                            ) : (<Link to={"/"}><img src={!isMenuOpen ? openBurgerMenu : closeBurgerMenu}
                                                           alt="burger-menu"/></Link>)}



                        </div>

                        {/*{isMenuOpen && (*/}
                        {/*    <div className="burger-menu-modal">*/}
                        {/*        <div className="menu-content">*/}
                        {/*            <button className="close-button" onClick={toggleMenu}>×</button>*/}
                        {/*            <ul className="menu-list">*/}
                        {/*                <li><Link to="/" onClick={toggleMenu}>Главная</Link></li>*/}
                        {/*                <li><a href="#" onClick={(e) => { e.preventDefault()}}>Тарифы</a></li>*/}
                        {/*                <li><a href="#" onClick={(e) => { e.preventDefault()}}>FAQ</a></li>*/}
                        {/*            </ul>*/}
                        {/*            <div className="menu-actions">*/}
                        {/*                <a className="sign-up" href="#">Зарегистрироваться</a>*/}
                        {/*                <Link to="/authorization" onClick={toggleMenu}>*/}
                        {/*                    <button className="my-office-button">*/}
                        {/*                        <span>Войти</span>*/}
                        {/*                    </button>*/}
                        {/*                </Link>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*)}*/}

                        <div className="info-about-user">
                            <div className="user-details">
                                <p className="user-name">{accountInfo?.fullName || 'Неизвестно'}</p>
                                <Link to="/" className="quit" onClick={handleLogout}>Выйти</Link>
                            </div>
                            <img src={accountInfo.userPhoto || emptyPhoto} alt="userPhoto" className="photo-profile" />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="burger-menu">
                            <img src={openBurgerMenu} alt="burger-menu" />
                        </div>
                        <div className="my-office">
                            <a className="sign-up" href="#">Зарегистрироваться</a>
                            <img src={stick} alt="stick" />
                            <Link to="/authorization">
                                <button className="my-office-button">
                                    <span className="entrance">Войти</span>
                                </button>
                            </Link>
                        </div>
                    </>
                )}
            </header>
        </>
    );
};

export default Header;
