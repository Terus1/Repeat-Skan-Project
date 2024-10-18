import React, {useEffect, useState} from "react";
import './Result.css';

import girlLookingFor from '../../media/girl-looking-for.svg';
import arrowIcon from '../../media/arrow-icon.svg';
import {useLocation} from "react-router-dom";

const Result = () => {
    // Получаем переданные данные через useLocation
    const location = useLocation();
    const { startDate, endDate, totalDocuments, riskFactors, histograms } = location.state || {};

    // Состояние для отслеживания текущего слайда
    const [currentIndex, setCurrentIndex] = useState(0);

    // Если данных нет, используем пустой массив (на случай ошибки)
    const data = histograms || [];

    // Определение количества видимых элементов на экране (например, 5)
    const itemsPerPage = 5;

    // Функция для прокрутки влево (без зацикливания)
    const scrollLeft = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - itemsPerPage);
        }
    };

    // Функция для прокрутки вправо (без зацикливания)
    const scrollRight = () => {
        if (currentIndex + itemsPerPage < data.length) {
            setCurrentIndex(currentIndex + itemsPerPage);
        }
    };

    // Отображение только нужной части данных
    const visibleData = data.slice(currentIndex, currentIndex + itemsPerPage);
    // Используем useEffect для вывода данных в консоль при загрузке компонента
    useEffect(() => {
            console.log("Ответ сервера:", startDate, endDate, totalDocuments, riskFactors, histograms);
    }, [startDate, endDate, totalDocuments, riskFactors, histograms]);
    return (
        <>
            <div className="head-result">
                <div className="head-text">
                    <p className="searching">Ищем. Скоро <br/> будут результаты</p>
                    <p className="be-patient">Поиск может занять некоторое время,<br/> просим сохранять терпение.</p>
                </div>

                <div className="head-picture">
                    <img src={girlLookingFor} alt="girl-looking-for"/>
                </div>
            </div>

            <div className="general-summary">
                <p className="text-general-summary">
                    Общая сводка
                </p>
                <p className="found-options">
                    Найдено "количество" вариантов
                </p>
                <p className="text-general-summary">
                    Общая сводка
                </p>
                <p className="found-options">
                    Найдено {totalDocuments || 0} вариантов
                </p>
                <p className="found-options">
                    Риски: {riskFactors || 0}
                </p>
                <p className="found-options">
                    Период: с {startDate} по {endDate}
                </p>
            </div>

            <div className="results">
                <div className="carousel-wrapper">
                    {/* Левая стрелка */}
                    <img src={arrowIcon} className="left-arrow" onClick={scrollLeft} alt={'left-arrow-icon'}/>

                    {/* Контейнер таблицы */}
                    <div className="table-container">
                        <div className="table-wrapper">

                            <table>
                            <thead>
                                <tr>
                                    <th className={'th-for-top-border-radius'}>Период</th>
                                    {visibleData.map((item) => (
                                        <td key={item.date}>{item.date}</td>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <th>Всего</th>
                                    {visibleData.map((item) => (
                                        <td key={item.date + '-total'}>{item.total}</td>
                                    ))}
                                </tr>
                                <tr>
                                    <th className={'th-for-bottom-border-radius'}>Риски</th>
                                    {visibleData.map((item) => (
                                        <td key={item.date + '-risks'}>{item.risks}</td>
                                    ))}
                                </tr>
                                </tbody>
                            </table>

                        </div>
                    </div>

                    {/* Правая стрелка */}
                    <img src={arrowIcon} className="right-arrow" onClick={scrollRight} alt={'right-arrow-icon'}/>
                </div>
            </div>
        </>
    )
};

export default Result;
