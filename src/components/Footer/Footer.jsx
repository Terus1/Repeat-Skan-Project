import React from "react";
import './Footer.css'
import logoFooter from '../../media/logo-footer.svg'


const Footer = () => {

    return(
        <div className={'footer-content'}>
            <footer className="footer">

                <div className="logo-footer">
                    <img src={logoFooter} alt="Логотип"/>
                </div>

                <div className="info-address">
                    <p className="footer-info">г. Москва, Цветной б-р, 40 <br/>
                        +7 495 771 21 11 <br/>
                        info@skan.ru
                    </p>

                    <p className="footer-info">Copyright. 2022</p>
                </div>

            </footer>
        </div>
    )

}

export default Footer;
