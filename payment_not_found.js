const page = document;
const head = page.querySelector("head");
const body = page.querySelector("body");

/* titulo da pagina */
const titleElement = page.createElement("title");
const titleContent = `Payment not found`;
const titleNode = page.createTextNode(titleContent);
head.appendChild(titleElement);

