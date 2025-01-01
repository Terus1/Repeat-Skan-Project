import React, { useState, useRef } from "react";
import "./CustomDatePicker.css";

const CustomDatePicker = ({ placeholder, value, onChange, isActive, setActive }) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(value || "");
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const calendarRef = useRef(null);

    const handleDateClick = (year, month, day) => {
        const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        setSelectedDate(formattedDate);
        onChange(formattedDate);
        setShowCalendar(false);
    };

    const toggleCalendar = () => setShowCalendar((prev) => !prev);

    const handleMonthChange = (direction) => {
        if (direction === "prev") {
            if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear((prev) => prev - 1);
            } else {
                setCurrentMonth((prev) => prev - 1);
            }
        } else if (direction === "next") {
            if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear((prev) => prev + 1);
            } else {
                setCurrentMonth((prev) => prev + 1);
            }
        }
    };

    const handleYearChange = (e) => {
        setCurrentYear(Number(e.target.value));
    };

    const renderCalendar = () => {
        const today = new Date(); // Текущая дата
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Количество дней в текущем месяце
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // Первый день месяца
        const emptyDays = Array.from({ length: firstDayOfMonth }, () => null); // Пустые ячейки для дня недели
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1); // Массив всех дней месяца

        // Фильтруем дни, чтобы исключить те, что в будущем
        const validDays = days.filter((day) => {
            const date = new Date(currentYear, currentMonth, day);
            return date <= today; // Оставляем только дни, которые не в будущем
        });

        return (
            <div className="calendar">
                <div className="calendar-header">
                    <button
                        className="month-button"
                        onClick={() => handleMonthChange("prev")}
                        disabled={
                            currentYear === today.getFullYear() &&
                            currentMonth === today.getMonth()
                        } // Запрещаем переключение на следующий месяц, если он содержит только будущие даты
                    >
                        &lt;
                    </button>
                    <span>
                    {new Date(currentYear, currentMonth).toLocaleString("default", {
                        month: "long",
                    })}{" "}
                        <select
                            value={currentYear}
                            onChange={handleYearChange}
                            className="year-selector"
                        >
                        {Array.from({ length: today.getFullYear() - 1900 + 1 }, (_, i) => {
                            const year = 1900 + i; // Годы от 1900 до текущего
                            return (
                                <option
                                    key={i}
                                    value={year}
                                    disabled={year > today.getFullYear()} // Исключаем будущие годы
                                >
                                    {year}
                                </option>
                            );
                        })}
                    </select>
                </span>
                    <button
                        className="month-button"
                        onClick={() => handleMonthChange("next")}
                        disabled={
                            currentYear > today.getFullYear() ||
                            (currentYear === today.getFullYear() &&
                                currentMonth >= today.getMonth())
                        } // Блокируем переключение на будущее
                    >
                        &gt;
                    </button>
                </div>
                <div className="calendar-days">
                    {emptyDays.map((_, i) => (
                        <div key={`empty-${i}`} className="calendar-day empty" />
                    ))}
                    {validDays.length > 0 ? (
                        validDays.map((day) => (
                            <div
                                key={day}
                                className="calendar-day"
                                onClick={() => handleDateClick(currentYear, currentMonth, day)}
                            >
                                {day}
                            </div>
                        ))
                    ) : (
                        <div className="calendar-day no-days">No available days</div>
                    )}
                </div>
            </div>
        );
    };


    return (
        <div className="custom-date-picker" ref={calendarRef}>
            <input
                type="text"
                className="date-input"
                value={selectedDate}
                onClick={toggleCalendar}
                placeholder={placeholder || "Select a date"}
                readOnly
            />
            {showCalendar && renderCalendar()}
        </div>
    );
};

export default CustomDatePicker;
