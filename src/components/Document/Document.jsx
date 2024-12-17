import React, {useEffect, useRef, useState} from "react";
import './Document.css';

const Document = ({ loadedDocument, formatDate }) => {
    const doc = loadedDocument?.ok;
    const contentRef = useRef(null); // Ссылка на div-content
    const [img, setImg] = useState([]);

    useEffect(() => {
        if (doc) {
            console.log('Loaded document', doc);
            const markup = doc.content.markup;

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
                truncateTextToFit(contentRef.current, parseXML(doc.content.markup));
            }
        }
    }, [doc]);

    // Следим за обновлением img и выводим его в консоль
    useEffect(() => {
        console.log('Updated img state:', img);
    }, [img]);

    const parseXML = (xmlString) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlString, "text/xml");

        return Array.from(xml.getElementsByTagName("sentence")).map((sentence) => {
            const rawText = sentence.innerHTML;
            return rawText
                .replace(/<[^>]*>/g, "") // Удаление всех тегов
                .replace(/&lt;br&gt;/g, "\n") // Замена <br> на перенос строки
                .replace(/&lt;[^&]*&gt;/g, "") // Удаление оставшихся спецсимволов
                .trim();
        });
    };

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
                <div className="div-image-of-document">
                    <img className={'image-of-document'} src={img} alt=""/>
                </div>

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
