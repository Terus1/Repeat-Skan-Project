import React from "react";
import './Footer.css'
import logoFooter from '../../media/logo-footer.svg'


const Footer = () => {

    return(
        <>
            <footer className="footer">

                <div className="div-logo-footer">
                    <img className={'logo-footer'} src={logoFooter} alt="Логотип"/>
                </div>

                <div className="info-address">
                    <p className="footer-info address">г. Москва, Цветной б-р, 40 <br/>
                        +7 495 771 21 11 <br/>
                        info@skan.ru
                    </p>

                    <p className="footer-info rights">Copyright. 2022</p>
                </div>

            </footer>
        </>
    )

}

export default Footer;
