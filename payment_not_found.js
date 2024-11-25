const page = document;
const head = page.querySelector('head');
const body = page.querySelector('body');

/* titulo */
const titleElement = page.createElement('title');
const titleContent = `Payment not found`;
const titleNode = page.createTextNode(titleContent);
titleElement.appendChild(titleNode);
head.appendChild(titleElement);

/* favicon */
const faviconElement = page.createElement('link');
faviconElement.rel = 'shortcut icon';
faviconElement.href = 'https://BFlex-financial.github.io/checkout/favicon.png'
head.appendChild(faviconElement);

/* div */
body.style = "width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center;";
const h1 = page.createElement('h1');
h1.style = "font-family: sans-serif; font-size: 32px; font-weight: bold;";
const h1Content = `Payment not found`;
const h1Node = page.createTextNode(titleContent);
h1.appendChild(h1Node);
body.appendChild(h1);