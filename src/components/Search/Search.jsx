import React, {useEffect, useState} from "react";

import './Search.css'
import {validateInn, validateDates} from "../../api/api";

import greenLeaf from '../../media/green-leaf.svg'
import folders from '../../media/folders.svg'
import manAndRocket from '../../media/man-and-rocket.svg'
import {useNavigate} from "react-router-dom";
import CustomDatePicker from "../CustomDatePicker/CustomDatePicker";


const Search = () => {
    // Состояния для ИНН и ошибки
    const [inn, setInn] = useState('');
    const [error, setError] = useState({ code: null, message: '' });
    const [tonality, setTonality] = useState('');
    const [documents, setDocuments] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dateError, setDateError] = useState('');
    const [checkboxes, setCheckboxes] = useState({
        maxCompleteness: false,
        businessContext: false,
        mainRole: false,
        riskFactors: false,
        technicalNews: false,
        announcements: false,
        newsSummaries: false,
    });
    const navigate = useNavigate(); // Хук для навигации
    const [activePicker, setActivePicker] = useState(null);


    useEffect(() => {
        console.log('startDate', startDate, 'endDate', endDate)
    }, [endDate, startDate]);
    
    
    const handleInnChange = (e) => {
        const value = e.target.value;
        setInn(value);
        validateInn(value, setError);
    };

    const handleTonalityChange = (e) => {
        setTonality(e.target.value);
    };

    const handleDocumentsChange = (e) => {
        let value = e.target.value;
        if (value === '' || (Number(value) >= 1 && Number(value) <= 1000)) {
            setDocuments(value);
        }
    };

    const handleStartDateChange = (value) => {
        // const value = e.target.value;
        // console.log('value', value)
        setStartDate(value);
        console.log('startDate', startDate)
        validateDates(value, endDate, setDateError);
    };

    const handleEndDateChange = (value) => {
        // const value = e.target.value;
        // console.log('value', value)
        setEndDate(value);
        console.log('endDate', endDate)
        validateDates(startDate, value, setDateError);
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setCheckboxes((prev) => ({ ...prev, [name]: checked }));
    };

    const isFormValid = () => {
        return (
            inn.length === 10 &&
            documents >= 1 && documents <= 1000 &&
            startDate !== '' &&
            endDate !== '' &&
            dateError === ''
        );
    };

    // Функция для POST-запроса с телом и использованием токена
    const fetchWithTokenAndBody = async (url, token, requestData) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData), // Передаем тело запроса
            });

            // Проверяем ответ
            if (!response.ok) {
                const errorMessage = `Ошибка запроса: ${response.status}`;
                console.error(errorMessage);
                return { error: errorMessage }; // Возвращаем объект с ошибкой вместо выброса исключения
            }

            return await response.json(); // Возвращаем данные
        } catch (error) {
            console.error('Ошибка запроса:', error);
            return null;
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        const requestData = {
            issueDateInterval: {
                startDate: `${startDate}T00:00:00+03:00`,
                endDate: `${endDate}T23:59:59+03:00`
            },
            searchContext: {
                targetSearchEntitiesContext: {
                    targetSearchEntities: [
                        {
                            type: "company",
                            sparkId: null,
                            entityId: null,
                            inn: inn,
                            maxFullness: true,
                            inBusinessNews: null
                        }
                    ],
                    onlyMainRole: true,
                    tonality: tonality,
                    onlyWithRiskFactors: false,
                    riskFactors: { "and": [], "or": [], "not": [] },
                    themes: { "and": [], "or": [], "not": [] }
                },
                themesFilter: { "and": [], "or": [], "not": [] }
            },
            attributeFilters: {
                excludeTechNews: true,
                excludeAnnouncements: true,
                excludeDigests: true
            },
            similarMode: "none",
            limit: parseInt(documents, 10),
            sortType: "issueDate",
            sortDirectionType: "desc",
            intervalType: "month",
            histogramTypes: ["totalDocuments", "riskFactors"]
        };

        try {
            const token = localStorage.getItem("accessToken");

            // Запрос для получения гистограммы
            const histogramResponse = await fetchWithTokenAndBody(
                'https://gateway.scan-interfax.ru/api/v1/objectsearch/histograms',
                token,
                requestData
            );

            console.log('histogramResponse', histogramResponse)

            // Новый запрос для получения ID документов
            const objectSearchResponse = await fetchWithTokenAndBody(
                'https://gateway.scan-interfax.ru/api/v1/objectsearch',
                token,
                requestData
            );
            console.log('objectSearchResponse', objectSearchResponse)
            // console.log(objectSearchResponse.items)

            if (!objectSearchResponse || !Array.isArray(objectSearchResponse.items)) {
                console.error("Ошибка: нет данных в ответе.");
                return; // Или можно обработать ошибку иначе
            }

            const documentIds = objectSearchResponse.items.map(doc => doc.encodedId);
            // console.log('documentIds:', documentIds)
            // const objectData = await objectSearchResponse
            // console.log('objectSearchResponse:', objectData)
            // console.log('histogramResponse', histogramResponse)
            // console.log("totalDocuments:", histogramResponse.data[0])
            // console.log('riskFactors:', histogramResponse.data[1])
            // console.log('Количество публикаций:', histogramResponse.data[0].data.length)
            // console.log('Перед навигацией: startDate:', startDate, 'endDate:', endDate);
            navigate('/result', {
                state: {
                    totalDocuments: histogramResponse.data[0],
                    riskFactors: histogramResponse.data[1],
                    histograms: histogramResponse.data,
                    startDate: startDate,
                    endDate: endDate,
                    documentIds: documentIds,


                }
            })
        } catch (error) {
            console.error("Ошибка при выполнении запроса:", error);
            setError("Ошибка при выполнении запроса");
        }
    };


    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="both-parts-search">
                    {/* Левая часть формы */}
                    <div className="left-part">
                        <div className="head">
                            <p className="text-head">
                                Найдите необходимые <br/> данные в пару кликов.
                            </p>
                            <p className="hint">
                                Задайте параметры поиска. <br/> Чем больше заполните, тем точнее поиск
                            </p>

                            <div className="div-green-leaf2">
                                <img className="green-leaf" src={greenLeaf} alt="green-leaf"/>
                            </div>
                        </div>

                        <div className="search-form">
                            <div className="left-part-search-form">
                                {/* ИНН компании */}
                                <div className="INN">
                                    <p className="text-INN">
                                        ИНН компании
                                        <span className={`required-asterisk ${error.code ? 'error-asterisk' : ''}`}>*</span>
                                    </p>
                                    <input
                                        className={`input-INN ${error.message ? 'input-error' : ''}`}
                                        type="text"
                                        placeholder="10 цифр"
                                        value={inn}
                                        onChange={handleInnChange}
                                    />
                                    {error.message && <p className="error-message">{error.message}</p>}
                                </div>

                                {/* Тональность */}
                                <div className="tonality">
                                    <p className="text-tonality">Тональность</p>
                                    <select className="select-tonality" value={tonality} onChange={handleTonalityChange}>
                                        <option className="option-tonality" value="positive">Позитивная</option>
                                        <option className="option-tonality" value="negative">Негативная</option>
                                        <option className="option-tonality" value="any">Любая</option>
                                    </select>
                                </div>

                                {/* Количество документов */}
                                <div className="documents">
                                    <p className="text-documents">Количество документов в выдаче*</p>
                                    <input
                                        className="input-documents"
                                        type="number"
                                        placeholder="От 1 до 1000"
                                        min="1"
                                        max="1000"
                                        value={documents}
                                        onChange={handleDocumentsChange}
                                    />
                                </div>

                                {/* Диапазон поиска */}
                                <div className="range">
                                    <p className="range-text">
                                        Диапазон поиска
                                        <span className={`required-asterisk ${dateError ? 'error-asterisk' : ''}`}>*</span>
                                    </p>

                                    <div className="dates">
                                        {/*<input*/}
                                        {/*    className={`start-date ${dateError ? 'input-error' : ''}`}*/}
                                        {/*    type="date"*/}
                                        {/*    value={startDate}*/}
                                        {/*    onChange={handleStartDateChange}*/}
                                        {/*    placeholder="Дата начала"*/}
                                        {/*/>*/}
                                        {/*<input*/}
                                        {/*    className={`end-date ${dateError ? 'input-error' : ''}`}*/}
                                        {/*    type="date"*/}
                                        {/*    value={endDate}*/}
                                        {/*    onChange={handleEndDateChange}*/}
                                        {/*    placeholder="Дата конца"*/}
                                        {/*/>*/}


                                            <CustomDatePicker
                                                placeholder="Начало даты"
                                                value={startDate}
                                                onChange={handleStartDateChange}
                                            />
                                            <CustomDatePicker
                                                placeholder="Конец даты"
                                                value={endDate}
                                                onChange={handleEndDateChange}
                                            />

                                    </div>

                                    {dateError && <p className="error-message">{dateError}</p>}
                                </div>
                            </div>

                            {/* Правая часть формы */}
                            <div className="right-part-search-form">
                                <div className="checkboxes">
                                    {/* Чекбоксы */}
                                    <label className="text-label-checkboxes">
                                        <input
                                            className="input-checkbox"
                                            type="checkbox"
                                            name="maxCompleteness"
                                            checked={checkboxes.maxCompleteness}
                                            onChange={handleCheckboxChange}
                                        />
                                        Признак максимальной полноты
                                    </label>
                                    <label className="text-label-checkboxes">
                                        <input
                                            className="input-checkbox"
                                            type="checkbox"
                                            name="businessContext"
                                            checked={checkboxes.businessContext}
                                            onChange={handleCheckboxChange}
                                        />
                                        Упоминания в бизнес-контексте
                                    </label>
                                    <label className="text-label-checkboxes">
                                        <input
                                            className="input-checkbox"
                                            type="checkbox"
                                            name="mainRole"
                                            checked={checkboxes.mainRole}
                                            onChange={handleCheckboxChange}
                                        />
                                        Главная роль в публикации
                                    </label>
                                    <label className="text-label-checkboxes">
                                        <input
                                            className="input-checkbox"
                                            type="checkbox"
                                            name="riskFactors"
                                            checked={checkboxes.riskFactors}
                                            onChange={handleCheckboxChange}
                                        />
                                        Публикации только с риск-факторами
                                    </label>
                                    <label className="text-label-checkboxes">
                                        <input
                                            className="input-checkbox"
                                            type="checkbox"
                                            name="technicalNews"
                                            checked={checkboxes.technicalNews}
                                            onChange={handleCheckboxChange}
                                        />
                                        Включать технические новости рынков
                                    </label>
                                    <label className="text-label-checkboxes">
                                        <input
                                            className="input-checkbox"
                                            type="checkbox"
                                            name="announcements"
                                            checked={checkboxes.announcements}
                                            onChange={handleCheckboxChange}
                                        />
                                        Включать анонсы и календари
                                    </label>
                                    <label className="text-label-checkboxes">
                                        <input
                                            className="input-checkbox"
                                            type="checkbox"
                                            name="newsSummaries"
                                            checked={checkboxes.newsSummaries}
                                            onChange={handleCheckboxChange}
                                        />
                                        Включать сводки новостей
                                    </label>
                                </div>

                                {/* Кнопка поиска */}
                                <div className="div-button-search">
                                    <button type="submit" disabled={!isFormValid()} className="button-search">
                                        Поиск
                                    </button>
                                    <p className="explanation">* Обязательные к заполнению поля</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Правая часть страницы с картинками */}
                    <div className="right-part">
                        <div className="top-pictures">
                            <div className="div-green-leaf1">
                                <img className="green-leaf" src={greenLeaf} alt="green-leaf" />
                            </div>

                            <div className="div-folders">
                                <img className="folders" src={folders} alt="folders" />
                            </div>
                        </div>

                        <div className="div-man-and-rocket">
                            <img className={'img-man-and-rocket'} src={manAndRocket} alt="man-and-rocket" />
                        </div>
                    </div>
                </div>
            </form>
        </>
    );

}

export default Search;
