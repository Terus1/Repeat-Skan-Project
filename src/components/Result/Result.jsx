import React, { useEffect, useState } from "react";
import './Result.css';

import girlLookingFor from '../../media/girl-looking-for.svg';
import arrowIcon from '../../media/arrow-icon.svg';
import loader from '../../media/loader.svg';
import { useLocation } from "react-router-dom";
import Document from "../Document/Document";

const Result = () => {
    const location = useLocation();
    const { startDate, endDate, totalDocuments, riskFactors, histograms, documentIds } = location.state || {};
    const totalDocumentsData = histograms && histograms[0] && histograms[0].histogramType === 'totalDocuments' ? histograms[0].data : [];
    const riskFactorsData = histograms && histograms[1] && histograms[1].histogramType === 'riskFactors' ? histograms[1].data : [];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5); // Начальное количество элементов на странице
    const [loadedDocuments, setLoadedDocuments] = useState([]);
    const [loading, setLoading] = useState(false);

    const maxLength = Math.max(totalDocumentsData.length, riskFactorsData.length);

    // Определение количества элементов на странице в зависимости от ширины окна
    const updateItemsPerPage = () => {
        const width = window.innerWidth;
        if (width >= 2000) {
            setItemsPerPage(10); // Например, на больших экранах показываем 10 элементов
        } else if (width >= 1700) {
            setItemsPerPage(8); // На средних экранах 8 элементов
        } else if (width >= 1500) {
            setItemsPerPage(6); // На маленьких экранах показываем 5 элементов
        } else if (width >= 879) {
            setItemsPerPage(4)
        } else {
            setItemsPerPage(1)
        }
    };

    // Обработчик изменения размера окна
    useEffect(() => {
        updateItemsPerPage(); // Обновляем количество элементов при монтировании компонента
        window.addEventListener('resize', updateItemsPerPage); // Добавляем слушатель события resize

        // Очистка при размонтировании компонента
        return () => {
            window.removeEventListener('resize', updateItemsPerPage);
        };
    }, []);

    // Функции для прокрутки влево и вправо
    const scrollLeft = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - itemsPerPage);
        }
    };

    const scrollRight = () => {
        if (currentIndex + itemsPerPage < maxLength) {
            setCurrentIndex(currentIndex + itemsPerPage);
        }
    };

    // Отображение только нужной части данных
    const visibleTotalDocumentsData = totalDocumentsData ? totalDocumentsData.slice(currentIndex, currentIndex + itemsPerPage) : [];
    const visibleRiskFactorsData = riskFactorsData ? riskFactorsData.slice(currentIndex, currentIndex + itemsPerPage) : [];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

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
            return data;
        } else {
            console.error("Ошибка при загрузке документов:", response.status);
            return [];
        }
    };

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

    const loadMoreDocuments = async () => {
        setLoading(true);
        const nextIds = documentIds.slice(loadedDocuments.length, loadedDocuments.length + 10);
        const moreDocuments = await fetchDocuments(nextIds);
        setLoadedDocuments((prev) => [...prev, ...moreDocuments]);
        setLoading(false);
    };

    return (
        <div className={'main-result'}>

            <div className="head-result">
                <div className="head-text">
                    <p className="searching">Ищем. Скоро <br/> будут результаты</p>
                    <p className="be-patient">Поиск может занять некоторое время,<br/> просим сохранять терпение.</p>
                </div>

                <div className="head-picture">
                    <img className={'girl-looking-for'} src={girlLookingFor} alt="girl-looking-for"/>
                </div>
            </div>

            <div className="general-summary">
                <p className="text-general-summary">Общая сводка</p>
                <p className="found-options">
                    Найдено {histograms[0].data.length} вариантов
                </p>
            </div>

            <div className="results">
                <div className="carousel-wrapper">
                    {/* Левая стрелка */}
                    <img
                        src={arrowIcon}
                        className={`left-arrow ${currentIndex === 0 ? 'disabled' : ''}`}
                        onClick={scrollLeft}
                        alt={'left-arrow-icon'}
                    />

                    {window.innerWidth > 879 ?
                        (<>
                            {!loading ? (
                            <div className="table-container">
                                <div className="table-wrapper">
                                    <table className={'table'}>
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
                                            <th className={'th-for-total'}>Всего</th>
                                            {visibleTotalDocumentsData.length > 0 ? (
                                                visibleTotalDocumentsData.map((item, index) => (
                                                    <td className={'data-table'} key={index}>
                                                        {item.value || item.value === 0 ? String(item.value) : '-'}
                                                    </td>
                                                ))
                                            ) : (
                                                <td className={'data-table'}>-</td>
                                            )}
                                        </tr>
                                        <tr>
                                            <th className={'th-for-bottom-border-radius'}>Риски</th>
                                            {visibleRiskFactorsData.length > 0 ? (
                                                visibleRiskFactorsData.map((item, index) => (
                                                    <td className={'data-table'} key={index}>
                                                        {item.value || item.value === 0 ? String(item.value) : '-'}
                                                    </td>
                                                ))
                                            ) : (
                                                <td className={'data-table'}>-</td>
                                            )}
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className={'table-container'}>
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th className="th-for-top-border-radius">Период</th>
                                        <td className="tg-d9lh" colSpan="14" rowSpan="3">
                                            <div className="loader-container">
                                                <img className={'loader'} src={loader} alt="loader"/>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="">Всего</th>
                                    </tr>
                                    <tr>
                                        <th className="th-for-bottom-border-radius">Риски</th>
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                        )}
                        </>)
                        :
                        (<>
                            <table className="table">
                                <thead>
                                <tr>
                                    <th className="th-for-top-border-radius-mini">Период</th>
                                    <th className="th-for-total">Всего</th>
                                    <th className="th-for-risks">Риски</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className="th-for-bottom-border-radius-mini">
                                        {visibleTotalDocumentsData.length > 0 ? (
                                            visibleTotalDocumentsData.map((item, index) => (
                                                <td className={'data-table'}
                                                    key={index}>{item.date ? formatDate(item.date) : '-'}</td>
                                            ))
                                        ) : (
                                            <td className={'data-table'}>-</td>
                                        )}
                                    </td>
                                    <td className="tg-0pky">
                                        {visibleTotalDocumentsData.length > 0 ? (
                                            visibleTotalDocumentsData.map((item, index) => (
                                                <td className={'data-table'} key={index}>
                                                    {item.value || item.value === 0 ? String(item.value) : '-'}
                                                </td>
                                            ))
                                        ) : (
                                            <td className={'data-table'}>-</td>
                                        )}
                                    </td>
                                    <td className="tg-0pky">
                                        {visibleRiskFactorsData.length > 0 ? (
                                            visibleRiskFactorsData.map((item, index) => (
                                                <td className={'data-table'} key={index}>
                                                    {item.value || item.value === 0 ? String(item.value) : '-'}
                                                </td>
                                            ))
                                        ) : (
                                            <td className={'data-table'}>-</td>
                                        )}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </>)}


                    {/* Правая стрелка */}
                    <img
                        src={arrowIcon}
                        className={`right-arrow ${currentIndex + itemsPerPage >= maxLength ? 'disabled' : ''}`}
                        onClick={scrollRight}
                        alt={'right-arrow-icon'}
                    />
                </div>
            </div>

            <div className="results-documents">
                <p className={'head-list-of-documents'}>Список документов</p>
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

            {loadedDocuments.length < documentIds.length && (
                <div className={'load-more-container'}>
                    <button className="load-more-button" onClick={loadMoreDocuments} disabled={loading}>
                        {loading ? (
                            <img className={'loader'} src={loader} alt="loader"/>
                        ) : (
                            "Показать больше"
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Result;
