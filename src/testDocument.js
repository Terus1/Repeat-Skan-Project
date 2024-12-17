
export const testDocument = [{
  "ok": {
    "schemaVersion": "1.2",
    "id": "1:0JPQqdGM0JNWCdCzf2Jt0LHQotGV0ZUh0ZbRlBXCt0Je0JHQruKAnDcUXkZQ0YvQscKnehLRnNC1KtGK0Ll9BWLigLo/HXXCrhw=",
    "version": 1,
    "issueDate": "2019-11-06T09:44:00+03:00",
    "url": "https://www.vesti.ru/doc.html?id=3206990",
    "source": {
      "id": 3264,
      "groupId": 8388638,
      "name": "Вести.Ru (vesti.ru)",
      "categoryId": 7,
      "levelId": 1
    },
    "dedupClusterId": "2596EE21",
    "title": {
      "text": "Медведь напал на охотника в Приморье",
      "markup": "<?xml version=\"1.0\" encoding=\"utf-8\"?><scandoc><sentence>Медведь напал на охотника в <entity type=\"location\" local-id=\"6\">Приморье</entity>\r\n<data>\r\n<div>    <div><p></sentence></scandoc>"
    },
    "content": {
      "markup": "<?xml version=\"1.0\" encoding=\"utf-8\"?><scandoc><sentence><entity type=\"theme\" local-id=\"1\"><entity type=\"theme\" local-id=\"5\">Медведь напал на жителя <entity type=\"location\" local-id=\"6\">Приморья</entity>, пострадавший госпитализирован, - сообщает \"Вести: Приморье\" со ссылкой на <entity type=\"company\" local-id=\"0\">\"Интерфакс-Дальний Восток\"</entity>. </entity></entity></sentence><sentence>Сотрудники полиции проводят проверку по факту инцидента, связанного с нападением медведя на жителя <entity type=\"location\" local-id=\"7\">Уссурийска </entity>в лесу, в окрестностях <entity type=\"location\" local-id=\"8\">села Яконовка</entity>. </sentence><sentence><entity type=\"theme\" local-id=\"2\">Пострадавшего госпитализировали в реанимационное отделение городской больницы.</p>\r\n\r\n<p></entity></sentence><sentence>По данным медиков, он прооперирован, сейчас его жизни ничто не угрожает. </sentence><sentence><entity type=\"theme\" local-id=\"4\">Полицейские установили, что у мужчины есть разрешение на охоту, оружие должным образом зарегистрировано. </entity></sentence><sentence>Обстоятельства случившегося выясняются.</p>\r\n\r\n<p></sentence><sentence><entity type=\"theme\" local-id=\"3\">Напомним, ранее сообщалось, что в минувшие выходные в окрестностях <entity type=\"location\" local-id=\"7\">Уссурийска</entity>, в районе <entity type=\"location\" local-id=\"9\">села Кроуновка </entity>на охотника напал тигр, пострадавший госпитализирован.</p>\r\n</div>\r\n                                                    <div></entity></sentence><sentence>Текст:\r\n                                            ГТРК \"Владивосток\"\r\n                                        </div>\r\n                \r\n                \r\n                <div>\r\n\r\n                    \r\n                    \r\n                    \r\n                </div>\r\n            </div>\r\n</data>\r\n\r\n</sentence><br><img src=\"https://storage.scan-interfax.ru/images/1%3A0JPQqdGM0JNWCdCzf2Jt0LHQotGV0ZUh0ZbRlBXCt0Je0JHQruKAnDcUXkZQ0YvQscKn0KjQlsKu0K%2FSkdGXfOKAsF3QkjrRnCRmGCFFBybQoNGL0ZMhEFkC4oCYaNC9a9GO0KFYwqwOeNGO0JdUDGzihKJXTNC%2B0ZzRinE%3D\"></scandoc>"
    },
    "entities": {
      "companies": [{
        "suggestedCompanies": [{
          "sparkId": 5752,
          "inn": "7710137066",
          "ogrn": "1037739169335",
          "searchPrecision": "maxPrecision"
        }],
        "resolveInfo": {
          "resolveApproaches": ["activeVerified"]
        },
        "tags": ["inBusinessNews"],
        "isSpeechAuthor": false,
        "localId": 0,
        "name": "Интерфакс Восток",
        "entityId": 132248549,
        "isMainRole": true
      }],
      "people": [],
      "themes": [{
        "localId": 1,
        "name": "Медицина и здоровье",
        "entityId": 10873126,
        "tonality": "negative"
      }, {
        "localId": 2,
        "name": "Медицина и здоровье",
        "entityId": 10873126,
        "tonality": "negative"
      }, {
        "localId": 3,
        "name": "Медицина и здоровье",
        "entityId": 10873126,
        "tonality": "negative"
      }, {
        "localId": 4,
        "name": "Следствие и расследования",
        "entityId": 8543420,
        "tonality": "neutral"
      }, {
        "localId": 5,
        "name": "Социальные вопросы: контекстный негатив",
        "entityId": 180643234,
        "tonality": "negative",
        "participant": {
          "localId": 0,
          "type": "company"
        }
      }],
      "locations": [{
        "code": {
          "countryCode": "RUS",
          "regionCode": "05"
        },
        "localId": 6,
        "name": "Приморье",
        "isMainRole": true
      }, {
        "code": {
          "countryCode": "RUS",
          "regionCode": "05"
        },
        "localId": 7,
        "name": "Уссурийск",
        "isMainRole": false
      }, {
        "code": {
          "countryCode": "RUS",
          "regionCode": "05"
        },
        "localId": 8,
        "name": "село Яконовка",
        "isMainRole": false
      }, {
        "code": {
          "countryCode": "RUS",
          "regionCode": "05"
        },
        "localId": 9,
        "name": "село Кроуновка",
        "isMainRole": false
      }]
    },
    "attributes": {
      "isTechNews": false,
      "isAnnouncement": false,
      "isDigest": false,
      "influence": 352.0,
      "wordCount": 99,
      "coverage": {
        "value": 1402211.0,
        "state": "hasData"
      }
    },
    "language": "russian"
  }
}]
