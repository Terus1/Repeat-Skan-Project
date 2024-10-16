import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import './Authorization.css'
import {fetchWithToken, loginAndFetch} from "../../api/api";

import peopleCarryingKey from '../../media/people-carrying-key.svg'
import lock from '../../media/lock.svg'
import googleButton from '../../media/google-button.svg'
import yandexButton from '../../media/yandex-button.svg'
import facebookButton from '../../media/facebook-button.svg'


const Authorization = ({setIsLoggedIn, setAccountInfo}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Хук для навигации

    // Проверка на заполнение полей
    const isFormValid = username !== '' && password !== '';

    // Функция для входа в аккаунт
    const handleLogin = async () => {
        try {
            await loginAndFetch(username, password, setIsLoggedIn, setAccountInfo, navigate);
        } catch (error) {
            console.error("Ошибка при выполнении loginAndFetch:", error);
        }
    };


    return (
        <>
            <div className="both-parts">
                <div className="left-part-authorization">
                    <p className="text-authorization">
                        Для оформления подписки<br/>
                        на тариф, необходимо<br/>
                        авторизоваться.
                    </p>

                    <div className="div-people-carrying-key">
                        <img src={peopleCarryingKey} alt="people-carrying-key-icon"/>
                    </div>
                </div>

                <div className="right-part-authorization">

                    <div className="container-entrance">
                        <div className="div-lock">
                            <img src={lock} alt="lock"/>
                        </div>
                        <div className="log-reg-tabs">
                            <div className="div-log-tab">
                                <a href="#" className="log-tab">Войти</a>
                                <div className="hr-log-tab-enter"/>
                            </div>

                            <div className="div-reg-tab">
                                <a href="#" className="reg-tab">Зарегистрироваться</a>
                                <div className="hr-log-tab-registration"/>
                            </div>

                        </div>

                        <div className="body-entrance">

                            <div className="log-or-number">
                                <p className="text-log-or-number">Логин или номер телефона:</p>
                                <input type="text" className="input-log-or-number" value={username} onChange={(e) => setUsername(e.target.value)}/>
                            </div>

                            <div className="password">
                                <p className="text-password">Пароль:</p>
                                <input type="password" className="input-password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                            </div>

                            <div className="div-button-entrance">
                                <button disabled={!isFormValid} className="button-entrance" onClick={handleLogin}>Войти</button>
                            </div>

                            <div className="recover-password">
                                <a href="#" className={'text-recover-password'}> Восстановить пароль </a>
                            </div>

                            <div className="log-in-using">
                                <p className="text-log-in-using">Войти через:</p>
                                <img className="site-button-google" src={googleButton} alt="google-button"/>
                                <img className="site-button-facebook" src={yandexButton} alt="facebook-button"/>
                                <img className="site-button-yandex" src={facebookButton} alt="yandex-button"/>
                            </div>

                        </div>


                    </div>
                </div>
            </div>
        </>
    )
}


export default Authorization;
