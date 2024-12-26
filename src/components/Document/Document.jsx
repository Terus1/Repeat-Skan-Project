import React, {useEffect, useRef, useState} from "react";
import './Document.css';

const Document = ({ loadedDocument, formatDate }) => {
    const doc = loadedDocument?.ok;
    const contentRef = useRef(null); // Ссылка на div-content
    const [img, setImg] = useState([]);

    useEffect(() => {
        if (doc) {

            console.log('Loaded document', doc);

            let markup = doc.content.markup;

            // Удаляем ссылки с определённым href
            const unwantedLinkPattern = /<a[^>]*href="https:\/\/www\.interfax\.ru\/business\/998265[^"]*"[^>]*>.*?<\/a>/g;
            markup = markup.replace(unwantedLinkPattern, "");

            // Регулярное выражение для поиска src внутри img
            const imageTags = markup.match(/<img [^>]*src="([^"]*)"/g) || [];
            const imageUrls = imageTags.map(tag => {
                const match = tag.match(/src="([^"]*)"/); // Извлекаем значение src
                return match ? match[1] : null; // Берём URL или null, если не найден
            }).filter(url => url !== null); // Убираем возможные null

            console.log('Extracted image URLs:', imageUrls);
            setImg(imageUrls); // Сохраняем только массив URL

            // Выполняем обрезку текста после загрузки документа
            if (contentRef.current) {
                truncateTextToFit(contentRef.current, parseXML(markup));

            }
        }
    }, [doc]);


    // // Следим за обновлением img и выводим его в консоль
    // useEffect(() => {
    //     console.log('Updated img state:', img);
    // }, [img]);

    // Функция для удаления всех тегов
    const parseXML = (xmlString) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlString, "text/xml");

        return Array.from(xml.getElementsByTagName("sentence")).map((sentence) => {
            let rawText = sentence.innerHTML;

            // Удаляем все теги <a> вместе с их содержимым
            rawText = rawText.replace(/<a[^>]*>.*?<\/a>/g, "");

            // Заменяем HTML-коды (например, &lt; и &gt;) на символы
            rawText = rawText
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&amp;/g, "&")
                .replace(/&quot;/g, '"')
                .replace(/&#039;/g, "'");

            // Удаляем все оставшиеся HTML-теги
            rawText = rawText.replace(/<[^>]*>/g, "");

            return rawText.trim();
        });
    };


    // Функция для правильного заполнения контейнера предложениями
    const truncateTextToFit = (container, sentences) => {
        let truncatedText = "";
        const maxHeight = container.clientHeight;

        // Очищаем контейнер перед вычислениями
        container.innerHTML = "";

        for (let i = 0; i < sentences.length; i++) {
            const nextSentence = sentences[i];
            truncatedText += `<p class="document-text">${nextSentence}</p>`; // Добавляем следующее предложение

            container.innerHTML = truncatedText; // Обновляем содержимое контейнера

            // Проверяем, превышена ли высота контейнера
            if (container.scrollHeight > maxHeight) {
                // Убираем последнее предложение, если оно не помещается
                truncatedText = truncatedText.replace(
                    `<p class="document-text">${nextSentence}</p>`,
                    ""
                );
                break;
            }
        }

        // Устанавливаем обрезанный текст в контейнер
        container.innerHTML = truncatedText;
    };

    // Функция для правильного склонения слова "слово"
    const getWordForm = (count) => {
        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;

        if (lastDigit === 1 && lastTwoDigits !== 11) {
            return `${count} слово`;
        } else if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) {
            return `${count} слова`;
        } else {
            return `${count} слов`;
        }
    };

    return (
        <div className="div-document">
            <div className="top-information">
                <p className="date">{formatDate(doc.issueDate)}</p>
                {doc.url ? (
                    <a href={doc.url} target={"_blank"} rel="noopener noreferrer" className="source">{doc.source.name}</a>
                ) : (
                    <p className={'source'}>{doc.source.name}</p>
                )}
            </div>

            <div className="div-head-of-document">
                <p className="head-of-document">{doc.title.text}</p>
                {img.length > 0 ? (
                    <div className="div-image-of-document">
                        <img className={'image-of-document'} src={img[0]} alt="image-of-document"/>
                    </div>
                ) : <></>}


            </div>


            {doc.attributes.isTechNews &&
                !doc.attributes.isAnnouncement &&
                !doc.attributes.isAnnouncementisDigest && (
                    <div className="div-tag">
                        <p className="head-tag">Технические новости</p>
                    </div>
                )}

            {!doc.attributes.isTechNews &&
                doc.attributes.isAnnouncement &&
                !doc.attributes.isAnnouncementisDigest && (
                    <div className="div-tag">
                        <p className="head-tag">Анонсы и события</p>
                    </div>
                )}

            {!doc.attributes.isTechNews &&
                !doc.attributes.isAnnouncement &&
                doc.attributes.isAnnouncementisDigest && (
                    <div className="div-tag">
                        <p className="head-tag">Сводки новостей</p>
                    </div>
                )}




            <div className="div-content" ref={contentRef}>
                {/* Контейнер для текста, будет обновляться через truncateTextToFit */}

            </div>

            <div className="div-read-in-source">
                <button
                    className="button-read-in-source"
                    onClick={() => {
                        if (doc.url) {
                            window.open(doc.url, "_blank", "noopener,noreferrer");
                        }
                    }}
                    disabled={!doc.url}
                >
                    Читать в источнике
                </button>
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
