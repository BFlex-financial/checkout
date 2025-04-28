let cacheResorcesValid = false;
let DOMValid = false;
let versionEquals = false;
let version;
let startTime;

const resources = {
    local: {
        css: ['./style.css'],
        javascript: [
            './script.js',
            './languages.js',
            './form.js',
            './errors.js',
            './app.js',
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
        if (!type && typeof type !== 'string') return console.warn('Type is required and should be a string', type);

        if (type === 'resources' || 'DOM') {
            version = 1;
            this.#SW = './resourcesSW.js';
        } else {
            return console.warn('Invalid type. Expected "resources" or "DOM".');
        }

        (async () => {
            await this.#setupConfig(type);
            this.init(type, versionEquals);
        })()

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
                resources: {
                    local: {
                        css: resources.local.css,
                        javascript: resources.local.javascript,
                        remove: resources.local.remove
                    },
                    external: {
                        allowed: resources.external.allowed
                    }
                }
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
                    console.log('[Client] DOM Content:', content);
                    console.warn(`Cache resources and DOM content finished in ${performance.now() - startTime} ms`);
                    document.write(content[0]);
                }
            };

            port1.onmessageerror = () => {
                console.log('[Client] Communication error');
            };
        }
    }

    async init(type, versionEquals) {
        if ('serviceWorker' in navigator && !versionEquals) {
            try {
                const registration = await navigator.serviceWorker.register(this.#SW, {
                    scope: this.#configs.scope
                });
                this.#handleMessaging(type);

                registration.addEventListener('updatefound', () => {
                    const installingWorker = registration.installing;
                    console.log('New service worker found:', installingWorker);
                    installingWorker.addEventListener('statechange', () => {
                        console.log('state change:', installingWorker);
                        if (installingWorker.state === 'activated') {
                            if (navigator.serviceWorker.controller) {
                                this.#reloadWithCache();
                            }
                        }
                    });
                });

                return registration;
            } catch (error) {
                console.error('Erro ao registrar service worker:', error);
            }
        } else {
            console.log('Service workers não são suportados.');
        }
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
    await SWtypes.forEach(type => {
        new ServiceWorkerManager(type);
    })

    startTime = performance.now();
})();

function getLanguage() {
    let lang = navigator.language || navigator.userLanguage
    return !lang || lang == undefined ? 'en' : lang;
}