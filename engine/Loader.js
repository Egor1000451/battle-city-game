;(function () { // самовызывающаяся функция
    'use strict'; // Стандарт
    
    // Загружает файлы с сервера
    class Loader {
        constructor() {
            // Очередь загрузки
            this.loadOrder = {
                images: [],
                jsons: []
            }
            // Готовые ресурсы
            this.resources = {
                images: [],
                jsons: []
            }
        }

        // Загрузить изображения по указанному пути в очередь загрузки
        addImage(name, src) {
            this.loadOrder.images.push({ name, src });
        }
        
        // Загрузить Json файлы по указанному пути в очередь загрузки
        addJson(name, address) {
            this.loadOrder.jsons.push({ name, address });
        }

        // Загрузка из очереди в ресурсы
        load(callback) {
            const promises = [];

            // Загрузка изображений
            for (const imageData of this.loadOrder.images) {
                const { name, src } = imageData;

                const promise = Loader
                    .loadImage(src)
                    .then(image => {
                        this.resources.images[name] = image; // загрузка в ресурсы

                        if (this.loadOrder.images.includes(imageData)) {
                            const index = this.loadOrder.images.indexOf(imageData);
                            this.loadOrder.images.splice(index, 1); // удаление из очереди
                        }
                    });
                promises.push(promise);
            }

            // Загрузка json файлов
            for (const jsonData of this.loadOrder.jsons) {
                const { name, address } = jsonData;

                const promise = Loader
                    .loadJson(address)
                    .then(json => {
                        this.resources.jsons[name] = json;  // загрузка в ресурсы

                        if (this.loadOrder.jsons.includes(jsonData)) {
                            const index = this.loadOrder.jsons.indexOf(jsonData);
                            this.loadOrder.jsons.splice(index, 1); // удаление из очереди
                        }
                    });
                promises.push(promise);
            }

            Promise.all(promises).then(callback);
        }

        // Статическая загрузка изображений
        static loadImage(src) {
            return new Promise((resolve, reject) => {
                try {
                    const image = new Image;
                    image.onload = () => resolve(image);
                    image.src = src;
                }
                catch (err) {
                    reject(err);
                }
            });
        }

        // Статическая загрузка json файлов
        static loadJson(address) {
            return new Promise((resolve, reject) => {
                fetch(address)
                    .then(result => result.json())
                    .then(result => resolve(result))
                    .catch(err => reject(err));
            });
        }
    }

    // namespace
    window.GameEngine = window.GameEngine || {}
    window.GameEngine.Loader = Loader;

})();