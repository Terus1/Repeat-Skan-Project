import './Phone.css'
import {Link} from "react-router-dom";
import React from "react";


export const Phone = () => {
    return (
        <div className={'main-phone'}>
            <div className="burger-content">
                    <p className={'text-burger-content'}>Главная</p>
                <p className={'text-burger-content'}>Тарифы</p>
                <p className={'text-burger-content'}>FAQ</p>
            </div>

            <div className={'reg-or-log'}>
                <a href="#" className={'reg'}>Зарегистрироваться</a>
                <Link to={'/authorization'}>
                    <button className="my-office-button"><span className="entrance">Войти</span></button>
                </Link>
            </div>
        </div>
    )
}
