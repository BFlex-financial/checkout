let cacheResorcesValid = false;
let DOMValid = false;
let versionEquals = false;
let version;
let startTime;
let cancel = false;
const errorTextContent = document.querySelector('section#error div.errorContent p.error');
const errorLoadingBars = document.querySelectorAll('div.bar');
const errorLoadedBar = document.querySelector('div.loadedBar');
const timingBar = document.querySelector('section#error div.errTiming');
const errMenu = document.querySelector('menu.error')

const resources = {
    local: {
        html: ['./index.html'],
        css: ['./style.css'],
        javascript: [
            './script.js',
            './languages.js',
            './form.js',
            './errors.js',
            './app.js',
            './teste.js'
        ],
        remove: [

        ]
    },
    external: {
        allowed: [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://get.geojs.io',
            'https://comidinhasdochef.com',
            'https://drogariasp.vteximg.com.br'
        ]
    }
}

class ServiceWorkerManager {
    #configs = {};
    #SW;
    #activePortIndex = 0;

    constructor(type) {
        if (!type || typeof type !== 'string') {
            console.warn('Type is required and should be a string:', type);
            this.#showError('Type is required and should be a string');
            cancel = true;
            return;
        }

        if (type === 'resources' || type === 'DOM') {
            version = Math.floor(Math.random() * 1000);
            this.#SW = `./resourcesSW.js`;
        } else {
            console.warn('Invalid type. Expected "resources" or "DOM".', typeof type);
            this.#showError('Invalid type. Expected "resources" or "DOM".');
            cancel = true;
            return;
        }

        if (cancel) return;

        (async () => {
            await this.#setupConfig(type);
            this.init(type, versionEquals);
        })();

        console.log('ServiceWorkerManager initialized');
    }

    async #setupConfig(type) {
        if (type === 'verify') {
            this.#configs = {
                message: 'Verify CACHE'
            }
        } else if (type === 'resources') {
            this.#configs = {
                scope: './',
                resources
            }
        } else if (type === 'DOM') {
            this.#configs = {
                scope: './',
                atributes: {
                    languages: [await getLanguage()]
                }
            }
        }
    }

    #handleMessaging(type) {
        if (navigator.serviceWorker.controller) {
            console.log('we have a service worker installed');
            console.log(this.#configs);

            const name = `APP_${type.toUpperCase()}`;
            console.log(name);

            const channel = new MessageChannel();
            const port1 = channel.port1;
            const port2 = channel.port2;

            this.port = port1;
            console.warn('Sending', this.#configs)

            navigator.serviceWorker.controller.postMessage({
                type: name,
                version: version,
                config: this.#configs,
            }, [port2]);

            port1.onmessage = (event) => {
                let data = event.data;
                let type = event.data.type;

                switch (type) {
                    case 'PORT_CONFIRMATION':
                        console.log('Active Port:', this.#activePortIndex);
                        this.#activePortIndex = event.data.port;
                        break;
                    case 'ERROR':
                        console.error('Error:', data.message);
                        this.#showError(data.message);
                        cancel = true;
                        break;
                    case 'VERSION_EQUALS':
                        console.warn('Versions equals:', version);
                        showDOMContent(data.content);
                        break
                    case 'DOM_CONFIRMATION':
                        showMessage(data.message)
                        break;
                    case 'DOM_CONTENT':
                        showMessage(data.message);
                        DOMValid = true;

                        if (cacheResorcesValid && DOMValid) {
                            console.warn('Cache resources and DOM content finished');
                            showDOMContent(data.content);
                        } else {
                            const checkReady = () => {
                                if (cacheResorcesValid && DOMValid) {
                                    showDOMContent(data.content);
                                    document.removeEventListener('cacheReady', checkReady);
                                }
                            };
                            document.addEventListener('cacheReady', checkReady);
                        }
                        break;

                    case 'CACHE_RESOURCES_FINISHED':
                        console.log('Cache resources finished');
                        cacheResorcesValid = true;
                        document.dispatchEvent(new Event('cacheReady'));
                        break;
                    default:
                        console.log('Unknow type:', type);
                }

                function showMessage(message) {
                    console.log('[Client] Menssage received:', message);
                }

                function showDOMContent(content) {
                    document.open();
                    document.write(content);
                    document.close();

                    console.log('[Client] DOM Content:', content);
                    console.warn(`Cache resources and DOM content finished in ${performance.now() - startTime} ms`);
                }

            };

            port1.onmessageerror = () => {
                console.log('[Client] Communication error');
                cancel = true;
                this.#showError('Communication error');
                return;
            };
        }
    }

    async init(type, versionEquals) {
        if (!('serviceWorker' in navigator) || versionEquals || cancel) {
            if (!('serviceWorker' in navigator)) {
                this.#showError('Service workers not supported.');
            } else if (cancel) {
                this.#showError('Execution stopped due to an error.');
            }
            return;
        }

        try {
            const registration = await navigator.serviceWorker.register(this.#SW, {
                scope: this.#configs.scope
            });

            this.#handleMessaging(type);

            const onUpdateFound = () => new Promise(resolve => {
                registration.addEventListener('updatefound', () => {
                    const installingWorker = registration.installing;
                    console.log('New service worker found:', installingWorker);

                    installingWorker.addEventListener('statechange', () => {
                        if (installingWorker.state === 'activated') {
                            resolve(installingWorker);
                        }
                    });
                });
            });

            const activatedWorker = await onUpdateFound();
            console.log('State changed to activated:', activatedWorker);

            if (navigator.serviceWorker.controller) {
                this.#reloadWithCache();
            }

            return registration;
        } catch (error) {
            cancel = true;
            console.error('Error registering Service Worker:', error);
            this.#showError(`Error registering Service Worker: ${error.message}`);
            throw error;
        }
    }

    async #showError(error) {
        setTimeout(() => {
            errorTextContent.textContent = error;
            document.body.classList.add('error');

            timingBar.classList.add('active');

            errorLoadingBars.forEach(bar => {
                setInterval(() => {
                    errorLoadedBar.classList.add('error');
                    bar.classList.toggle('error');
                }, 2000)
            })

            setTimeout(() => {
                timingBar.classList.remove('active');
                errMenu.classList.add('disabled');
                setTimeout(() => {
                    errMenu('menu.error').classList.remove('disabled');
                    errMenu('menu.error').classList.add('remove');
                }, 280)
            }, 2100)
        }, 0) //TODO - put 1000
    }

    #reloadWithCache() {
        console.warn('Reloading for active service worker');
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
}

const SWtypes = ['resources', 'DOM'];

(async () => {
    for (const type of SWtypes) {
        new ServiceWorkerManager(type);
        if (cancel) {
            console.warn(`Execution stopped due to an error with type: ${type}`);
            break;
        }
    }

    if (!cancel) {
        startTime = performance.now();
    }
})();

function getLanguage() {
    let lang = navigator.language || navigator.userLanguage
    return !lang || lang == undefined ? 'en' : lang;
}