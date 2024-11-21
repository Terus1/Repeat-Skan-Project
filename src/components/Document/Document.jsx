import React, {useEffect} from "react";
import './Document.css';


const Document = ({loadedDocument, formatDate}) => {

    const doc = loadedDocument?.ok

    useEffect(() => {

        if (doc) {
            console.log('Loaded document', doc)
        }
    }, [loadedDocument]);


    const parseXML = (xmlString) => {
        // Используем DOMParser для парсинга XML
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlString, "text/xml");

        // Преобразуем XML в массив предложений
        const sentences = Array.from(xml.getElementsByTagName("sentence")).map((sentence) => {
            const rawText = sentence.innerHTML;
            // Убираем все теги и HTML спецсимволы
            const cleanedText = rawText
                .replace(/<[^>]*>/g, "")          // Убирает все теги
                .replace(/&lt;br&gt;/g, "\n")     // Заменяет <br> на перенос строки
                .replace(/&lt;[^&]*&gt;/g, "")    // Убирает оставшиеся спецсимволы в теге
                .trim();                          // Убирает лишние пробелы

            return cleanedText;
        });

        return sentences;
    };

    // Функция для правильного склонения слова "слово"
    function getWordForm(count) {
        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;

        if (lastDigit === 1 && lastTwoDigits !== 11) {
            return `${count} слово`;
        } else if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) {
            return `${count} слова`;
        } else {
            return `${count} слов`;
        }
    }

    return (
        <div className="div-document">
            <div className="top-information">
                <p className="date">{formatDate(doc.issueDate)}</p>
                <p className="source">{doc.source.name}</p>
            </div>

            <div className="div-head-of-document">
                <p className="head-of-document">{doc.title.text}</p>
            </div>

            <div className="div-tag">
                {doc.attributes.isTechNews &&
                    !doc.attributes.isAnnouncement &&
                    !doc.attributes.isAnnouncementisDigest && (
                        <p className="head-tag">Технические новости</p>
                    )}

                {!doc.attributes.isTechNews &&
                    doc.attributes.isAnnouncement &&
                    !doc.attributes.isAnnouncementisDigest && (
                        <p className="head-tag">Анонсы и события</p>
                    )}

                {!doc.attributes.isTechNews &&
                    !doc.attributes.isAnnouncement &&
                    doc.attributes.isAnnouncementisDigest && (
                        <p className="head-tag">Сводки новостей</p>
                    )}
            </div>

            <div className="div-content">
                <p className="document-content">
                    {parseXML(doc.content.markup).map((sentence, i) => (
                        <p key={i}>{sentence}</p>
                    ))}
                </p>
            </div>

            <div className="div-read-in-source">
                <button className="button-read-in-source">Читать в источнике</button>
            </div>

            <div className="div-number-of-words">
                <p className="text-number-of-words">
                    {getWordForm(doc.attributes.wordCount)}
                </p>
            </div>
        </div>
    );
};

export default Document;
