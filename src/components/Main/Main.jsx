import React, {useState} from "react";
import './Main.css'


import bigIconSwitchMan from '../../media/big-icon-switch-man.svg'
import arrowIcon from '../../media/arrow-icon.svg'
import groupClock from '../../media/group-clock.svg'
import groupLoupe from "../../media/group-loupe.svg"
import groupShield from "../../media/group-shield.svg"
import groupManSitting from "../../media/group-man-sitting.svg"
import beginnerIcon from "../../media/beginner-icon.svg"
import targetIcon from "../../media/target-icon.svg"
import businessIcon from "../../media/business-icon.svg"
import greenCheckMark from '../../media/green_check_mark.svg'
import {Link} from "react-router-dom";


export const Main = ({isLoggedIn}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const tariff = JSON.parse(localStorage.getItem('accountInfo')).tariff
    console.log(tariff === 'business')

    // Массив элементов карусели
    const elements = [
        <div className="carousel-item">
            <img src={groupClock} alt="clock"/>
        </div>,
        <div className="carousel-item">
            <img src={groupLoupe} alt="loupe"/>
        </div>,
        <div className="carousel-item">
            <img src={groupShield} alt="shield-icon"/>
        </div>,
    ];

    // Функция для обработки клика вправо
    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % elements.length);
    };

    // Функция для обработки клика влево
    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex - 1 + elements.length) % elements.length
        );
    };

    // Получение 3 элементов для отображения, в цикле
    const getVisibleElements = () => {
        return [
            elements[currentIndex],
            elements[(currentIndex + 1) % elements.length],
            elements[(currentIndex + 2) % elements.length],
        ];
    };


    return (
        <>
            <main className="main">
                <div className="upper-part-site">
                    <div className="site-about">
                        <h1 className="site-h1">
                            сервис по поиску<br/>
                            публикаций<br/>
                            о компании<br/>
                            по его ИНН
                        </h1>

                        <p className="small-text">
                            Комплексный анализ публикаций, получение данных <br/> в формате PDF на электронную
                            почту.
                        </p>

                        {isLoggedIn ? (
                                <Link to={"/search"}>
                                    <button className={'request-data'}>Запросить данные</button>
                                </Link>
                            )
                            : (
                                <></>
                            )
                        }

                    </div>

                    <div className="div-big-icon-switch-man">
                        <img className="big-icon-switch-man" src={bigIconSwitchMan} alt="icon"/>
                    </div>
                </div>

                <div className="why-are-we">
                    <p className="p-why-are-we">почему именно мы</p>

                    <div className="carousel-position">
                        <img className="arrow-nav-left" src={arrowIcon} alt="arrow-left-icon" onClick={handlePrev}/>

                        <div className="carousel-container">
                            <div className="carousel-track">
                                {getVisibleElements().map((element, index) => (
                                    <div className="carousel-slide" key={index}>
                                        {element}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <img className="arrow-nav-right" src={arrowIcon} alt="arrow-right-icon"
                             onClick={handleNext}/>
                    </div>
                </div>

                <div className="man-sitting">
                    <img src={groupManSitting} alt="man-sitting"/>
                </div>

                <div className="block-our-tariffs">
                    <p className="text-our-tariffs">наши тарифы</p>

                    <div className="list-of-tariffs">


                        <div className={`beginner grid-item 
                        ${tariff === 'beginner' ? 'active-beginner-tariff': ''}                 
                        `}>
                            <div className="tariff-header-beginner">
                                <div className="head-tariff-beginner">
                                    <p className="name-of-tariff">Beginner</p>
                                    <p className="shortly">Для небольшого исследования</p>
                                </div>

                                <div className="beginner-icon">
                                    <img src={beginnerIcon} alt="beginner-icon"/>

                                </div>
                            </div>

                            <div className="tariff-body-beginner">
                                <div className="div-new-price">
                                    <p className="new-price">799 ₽</p>
                                </div>
                                <div className="div-old-price">
                                    <p className="old-price">
                                        <del>1200 ₽</del>
                                    </p>
                                </div>

                                {tariff === 'beginner' ? (
                                    <div className="current-tariff">
                                        <p className="text-current-tariff">Текущий тариф</p>
                                    </div>
                                ) : (
                                    <></>
                                )}

                                <p className="monthly">или 150 ₽/мес. при рассрочке на 24 мес.</p>

                                <div className="div-tariff-includes">
                                    <p className={'text-tariff-includes'}>В тариф входит:</p>
                                    <div className="body-tariff-includes">
                                        <img src={greenCheckMark} alt="green-check-mark"
                                             className={'green-check-mark-1'}/>
                                        <p className={'text-in-body-tariff-includes-1'}>Безлимитная история
                                            запросов</p>

                                        <img src={greenCheckMark} alt="green-check-mark"
                                             className={'green-check-mark-2'}/>
                                        <p className={'text-in-body-tariff-includes-2'}>Безопасная сделка</p>

                                        <img src={greenCheckMark} alt="green-check-mark"
                                             className={'green-check-mark-3'}/>
                                        <p className={'text-in-body-tariff-includes-3'}>Поддержка 24/7</p>

                                    </div>

                                </div>

                                <div className="beginner-button">
                                    {tariff === 'beginner' ? (
                                        <button className="to-personal-acc">Перейти в личный кабинет</button>
                                    ) : (
                                        <button className="more-white">Подробнее</button>
                                    )}

                                </div>
                            </div>

                        </div>
                        {/*=============================================================================================================*/}
                        <div className={`pro grid-item 
                        ${tariff === 'pro' ? 'active-pro-tariff' : ''}               
                        `}>
                            <div className="tariff-header-pro">
                                <div className="head-tariff-pro">
                                    <p className="name-of-tariff">Pro</p>
                                    <p className="shortly">Для HR и фрилансеров</p>
                                </div>

                                <div className="pro-icon">
                                    <img src={targetIcon} alt="target-icon"/>

                                </div>
                            </div>
                            <div className="tariff-body-beginner">
                                <div className="div-new-price">
                                    <p className="new-price">1299 ₽</p>

                                </div>
                                <div className="div-old-price">
                                    <p className="old-price">
                                        <del>2600 ₽</del>
                                    </p>
                                </div>
                                {tariff === 'pro' ? (
                                    <div className="current-tariff">
                                        <p className="text-current-tariff">Текущий тариф</p>
                                    </div>
                                ) : (
                                    <></>
                                )}

                                <p className="monthly">или 279 ₽/мес. при рассрочке на 24 мес.</p>
                                <div className="div-tariff-includes">
                                    <p className={'text-tariff-includes'}>В тариф входит:</p>
                                    <div className="body-tariff-includes">
                                        <img src={greenCheckMark} alt="green-check-mark"
                                             className={'green-check-mark-1'}/>
                                        <p className={'text-in-body-tariff-includes-1'}>Все пункты тарифа
                                            Beginner</p>

                                        <img src={greenCheckMark} alt="green-check-mark"
                                             className={'green-check-mark-2'}/>
                                        <p className={'text-in-body-tariff-includes-2'}>Экспорт истории</p>

                                        <img src={greenCheckMark} alt="green-check-mark"
                                             className={'green-check-mark-3'}/>
                                        <p className={'text-in-body-tariff-includes-3'}>Рекомендации по
                                            приоритетам</p>

                                    </div>
                                </div>

                                <div className="pro-button">
                                    {tariff === 'pro' ? (
                                        <button className="to-personal-acc">Перейти в личный кабинет</button>
                                    ) : (
                                        <button className="more-white">Подробнее</button>
                                    )}

                                </div>
                            </div>

                        </div>

                        <div className={`business grid-item ${tariff === 'business' ? 'active-business-tariff' : ''} `}>
                            <div className="tariff-header-business">
                                <div className="head-tariff-business">
                                    <p className="name-of-tariff-business">Business</p>
                                    <p className="shortly-business">Для корпоративных клиентов</p>
                                </div>

                                <div className="business-icon">
                                    <img src={businessIcon} alt="business-icon"/>
                                </div>
                            </div>

                            <div className="tariff-body-beginner">
                                <div className="div-new-price">
                                    <p className="new-price">2379 ₽</p>

                                </div>
                                <div className="div-old-price">
                                    <p className="old-price">
                                        <del>3700 ₽</del>
                                    </p>
                                </div>
                                {tariff === 'business' ? (
                                    <div className="current-tariff">
                                        <p className="text-current-tariff">Текущий тариф</p>
                                    </div>
                                ) : (
                                    <></>
                                )}

                                <div className="div-tariff-includes">
                                    <p className={'text-tariff-includes'}>В тариф входит:</p>
                                    <div className="body-tariff-includes">
                                        <img src={greenCheckMark} alt="green-check-mark"
                                             className={'green-check-mark-1'}/>
                                        <p className={'text-in-body-tariff-includes-1'}>Все пункты тарифа Pro</p>

                                        <img src={greenCheckMark} alt="green-check-mark"
                                             className={'green-check-mark-2'}/>
                                        <p className={'text-in-body-tariff-includes-2'}>Безлимитное количество
                                            запросов</p>

                                        <img src={greenCheckMark} alt="green-check-mark"
                                             className={'green-check-mark-3'}/>
                                        <p className={'text-in-body-tariff-includes-3'}>Приоритетная поддержка</p>

                                    </div>
                                </div>


                                <div className="business-button">
                                    {tariff === 'business' ? (
                                        <button className="to-personal-acc">Перейти в личный кабинет</button>
                                    ) : (
                                        <button className="more-white">Подробнее</button>
                                    )}

                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </main>
        </>
    )
}
