import React, {useEffect, useState} from "react";
import './Result.css';

import girlLookingFor from '../../media/girl-looking-for.svg';
import arrowIcon from '../../media/arrow-icon.svg';
import {useLocation} from "react-router-dom";
import Document from "../Document/Document";

const Result = () => {

    // Получаем переданные данные через useLocation
    const location = useLocation();
    // console.log('location:', location.state)
    const { startDate, endDate, totalDocuments, riskFactors, histograms, documentIds } = location.state || {};
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
    const visibleTotalDocumentsData = totalDocumentsData ? totalDocumentsData.slice(currentIndex, currentIndex + itemsPerPage) : [];
    const visibleRiskFactorsData = riskFactorsData ? riskFactorsData.slice(currentIndex, currentIndex + itemsPerPage) : [];

    // console.log('visibleTotalDocumentsData', visibleTotalDocumentsData)
    // console.log('visibleRiskFactorsData', visibleRiskFactorsData)
    // Используем useEffect для вывода данных в консоль при загрузке компонента
    useEffect(() => {
            console.log("Ответ сервера:", startDate, endDate, totalDocuments, riskFactors, histograms);
    }, [startDate, endDate, totalDocuments, riskFactors, histograms]);

    // Отображение даты в нужном формате
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU'); // Форматирует дату как "DD.MM.YYYY"
    };


    const [loadedDocuments, setLoadedDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [documentsToShow, setDocumentsToShow] = useState(10);

    // Функция для запроса на загрузку документов
    const fetchDocuments = async (ids) => {
        const token = localStorage.getItem("accessToken");
        const response = await fetch('https://gateway.scan-interfax.ru/api/v1/documents', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('данные из /api/v1/documents', data)
            return data;
        } else {
            console.error("Ошибка при загрузке документов:", response.status);
            return [];
        }
    };

    // Загрузить первые 10 документов
    useEffect(() => {
        const loadInitialDocuments = async () => {
            setLoading(true);
            const initialIds = documentIds.slice(0, 10);
            const documents = await fetchDocuments(initialIds);
            setLoadedDocuments(documents);
            setLoading(false);
        };

        loadInitialDocuments();
    }, [documentIds]);

    // useEffect(() => {
    //     if (loadedDocuments.length > 0) {
    //         console.log('loadedDocuments', loadedDocuments)
    //     }
    // }, [loadedDocuments]);

    // Функция для загрузки дополнительных документов
    const loadMoreDocuments = async () => {
        setLoading(true);
        const nextIds = documentIds.slice(loadedDocuments.length, loadedDocuments.length + 10);
        const moreDocuments = await fetchDocuments(nextIds);
        setLoadedDocuments(prev => [...prev, ...moreDocuments]);
        setLoading(false);
    };


    return (
        <div className={'main'}>
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
                                    {visibleTotalDocumentsData.length > 0 ? (
                                        visibleTotalDocumentsData.map((item, index) => (
                                            <td className={'data-table'}
                                                key={index}>{item.date ? formatDate(item.date) : '-'}</td>
                                        ))
                                    ) : (
                                        <td className={'data-table'}>-</td>
                                    )}
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <th>Всего</th>
                                    {visibleTotalDocumentsData.length > 0 ? (
                                        visibleTotalDocumentsData.map((item, index) => (
                                            <td className={'data-table'}
                                                key={index}>{item.value || item.value === 0 ? String(item.value) : '-'}</td>
                                        ))
                                    ) : (
                                        <td className={'data-table'}>-</td>
                                    )}
                                </tr>
                                <tr>
                                    <th className={'th-for-bottom-border-radius'}>Риски</th>
                                    {visibleRiskFactorsData.length > 0 ? (
                                        visibleRiskFactorsData.map((item, index) => (
                                            <td className={'data-table'}
                                                key={index}>{item.value || item.value === 0 ? String(item.value) : '-'}</td>
                                        ))
                                    ) : (
                                        <td className={'data-table'}>-</td>
                                    )}
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
            <div className="results-documents">
                <p className={'head-list-of-documents'}>Список документов</p>
                {/*<Document loadedDocuments={loadedDocuments} formatDate={formatDate}/>*/}
                <div className="documents-container">
                    {loadedDocuments.length > 0 ? (
                        loadedDocuments.map((doc, index) => (
                            <div key={index} className={'document-item'}>
                                <Document loadedDocument={doc} formatDate={formatDate}/>
                            </div>
                        ))
                    ) : (
                        <p>Документы не найдены</p>
                    )}
                </div>


            </div>
            {/* Кнопка для загрузки дополнительных документов */}
            {loadedDocuments.length < documentIds.length && (
                <div className={'load-more-container'}>
                    <button className="load-more-button" onClick={loadMoreDocuments} disabled={loading}>
                        {loading ? "Загрузка..." : "Показать больше"}
                    </button>
                </div>

            )}
        </div>
    )
};

export default Result;
