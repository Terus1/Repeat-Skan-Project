import React, {useEffect, useState} from "react";
import './Result.css';

import girlLookingFor from '../../media/girl-looking-for.svg';
import arrowIcon from '../../media/arrow-icon.svg';
import {useLocation} from "react-router-dom";

const Result = () => {
    // Получаем переданные данные через useLocation
    const location = useLocation();
    console.log('location:', location.state)
    const { startDate, endDate, totalDocuments, riskFactors, histograms } = location.state || {};
    console.log('Переданные данные startDate:', startDate,
        'endDate:', endDate,
        'totalDocuments:', totalDocuments,
        'riskFactors:', riskFactors,
        'histograms:', histograms)

    // Проверяем, есть ли данные и выделяем их по типу
    const totalDocumentsData = histograms && histograms[0] && histograms[0].histogramType === 'totalDocuments'
        ? histograms[0].data
        : [];

    const riskFactorsData = histograms && histograms[1] && histograms[1].histogramType === 'riskFactors'
        ? histograms[1].data
        : [];

    // Состояние для отслеживания текущего слайда
    const [currentIndex, setCurrentIndex] = useState(0);

    // Если данных нет, используем пустой массив (на случай ошибки)
    const data = histograms || [];

    // Определение количества видимых элементов на экране (например, 5)
    const itemsPerPage = 5;

    // Общая длина данных
    const maxLength = Math.max(totalDocumentsData.length, riskFactorsData.length);

    // Функция для прокрутки влево (без зацикливания)
    const scrollLeft = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - itemsPerPage);
        }
    };

    // Функция для прокрутки вправо (без зацикливания)
    const scrollRight = () => {
        if (currentIndex + itemsPerPage < maxLength) {
            setCurrentIndex(currentIndex + itemsPerPage);
        }
    };

    // Отображение только нужной части данных
    const visibleTotalDocumentsData = totalDocumentsData.slice(currentIndex, currentIndex + itemsPerPage);
    const visibleRiskFactorsData = riskFactorsData.slice(currentIndex, currentIndex + itemsPerPage);

    console.log('visibleTotalDocumentsData', visibleTotalDocumentsData)
    console.log('visibleRiskFactorsData', visibleRiskFactorsData)
    // Используем useEffect для вывода данных в консоль при загрузке компонента
    useEffect(() => {
            console.log("Ответ сервера:", startDate, endDate, totalDocuments, riskFactors, histograms);
    }, [startDate, endDate, totalDocuments, riskFactors, histograms]);


    // Отображение даты в нужном формате
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU'); // Форматирует дату как "DD.MM.YYYY"
    };


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
                    Найдено {histograms[0].data.length} вариантов
                </p>
                <p className="found-options">
                    Риски: {riskFactors.data.value || 0}
                </p>
                <p className="found-options">
                    Период: с {startDate} по {endDate}
                </p>
            </div>

            <div className="results">
                <div className="carousel-wrapper">
                    {/* Левая стрелка */}
                    <img
                        src={arrowIcon}
                        className={`left-arrow ${currentIndex === 0 ? 'disabled' : ''}`} // Добавляем класс disabled, если достигнут край
                        onClick={scrollLeft}
                        alt={'left-arrow-icon'}
                    />

                    {/* Контейнер таблицы */}
                    <div className="table-container">
                        <div className="table-wrapper">

                            <table>
                                <thead>
                                <tr>
                                <th className={'th-for-top-border-radius'}>Период</th>
                                    {visibleTotalDocumentsData.map((item, index) => (
                                        <td className={'data-table'} key={index}>{item.date ? formatDate(item.date) : '-'}</td>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <th>Всего</th>
                                    {visibleTotalDocumentsData.map((item, index) => (
                                        <td className={'data-table'} key={index}>{item.value || item.value === 0 ? String(item.value) : '-'}</td>
                                    ))}
                                </tr>
                                <tr>
                                    <th className={'th-for-bottom-border-radius'}>Риски</th>
                                    {visibleRiskFactorsData.map((item, index) => (
                                        <td className={'data-table'} key={index}>{item.value || item.value === 0 ? String(item.value) : '-'}</td>
                                    ))}
                                </tr>
                                </tbody>
                            </table>

                        </div>
                    </div>

                    {/* Правая стрелка */}
                    <img
                        src={arrowIcon}
                        className={`right-arrow ${currentIndex + itemsPerPage >= maxLength ? 'disabled' : ''}`} // Добавляем класс disabled, если достигнут край
                        onClick={scrollRight}
                        alt={'right-arrow-icon'}
                    />
                </div>
            </div>
        </>
    )
};

export default Result;
