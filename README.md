# archivestra
Программный комплекс для:
* распознавания рукописного текста на документах с помощью Yandex Cloud Vision OCR и отправки результата в БД;
* поиска по БД и просмотра SVG-изображений документов с текстовым слоем.

# Что нужно для развёртывания своего экземпляра приложения?
В [Yandex Cloud](https://console.yandex.cloud/) понадобится 4 продукта:
* Container Registry - для хранения Docker-образов;
* Serverless Containers - для запуска микросервиса;
* Vision OCR - для распознавания рукописного текста;
* Managed Service for YDB - для хранения распознанного текста.

Ну и аккаунт в GitHub.

# Какие ключи понадобятся?
Понадобятся сразу 2 ключа:
* api-key.yaml - нужен для отправки изображений в Yandex Cloud Vision OCR;
* key.json - нужен для отправки распознанного текста в БД.

Каждый из них может быть получен через CLI Yandex Cloud. Помимо этого, нужно будет поколдовать над сервисным аккаунтом и его ролями. Всего нужно 4 роли:
* container-registry.images.puller;
* ydb.editor;
* ai.vision.user;
* ydb.viewer.

# Как развернуть свой экземпляр 
Читайте документацию:
* https://yandex.cloud/ru/docs/cli/quickstart#install
* https://yandex.cloud/ru/docs/vision/quickstart
* https://yandex.cloud/ru/docs/ydb/quickstart
* https://yandex.cloud/ru/docs/container-registry/quickstart/
* https://yandex.cloud/ru/docs/serverless-containers/quickstart/