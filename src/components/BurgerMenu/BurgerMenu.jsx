import './BurgerMenu.css'
import {Link} from "react-router-dom";

const BurgerMenu = ({toggleMenu}) => {
    return (
        <div className="burger-main">
            <ul className="list-menu">
                <li className={'item-list-menu'}><Link className={'link-item-list-menu'} to={'/'} onClick={toggleMenu}>Главная</Link></li>
                <li className={'item-list-menu'}><a className={'link-item-list-menu'} href="#">Тарифы</a></li>
                <li className={'item-list-menu'}><a className={'link-item-list-menu'}  href="#">FAQ</a></li>
            </ul>

            <ul className="control-panel">
                <a className={'burger-reg'} href="#">Зарегистрироваться</a>
                <Link to={'/authorization'}><button className={'burger-entrance'} onClick={toggleMenu}>Войти</button></Link>
            </ul>

        </div>

    )
}


export default BurgerMenu;
