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
const center = page.createElement('div');
center.className = 'box';
  
/* Product info */
const product = page.createElement('div');
row.className = 'product';
    
  /* Product image */
  const thumbnail = page.createElement('div');
  thumbnail.className = 'thumbnail';
  thumbnail.style = `--img-url: '${products[0].data.thumbnail}'`
  product.appendChild(thumbnail);
  
  /* Info display */
  const info = page.createElement('div');

    const productName = page.createElement('p');
    const nameContent = products[0].data.name || "Uknown";
    const name = page.createTextNode(nameContent);
    productName.appendChild(name);

  product.appendChild(info);

center.appendChild(product);

/* Payment form */
const row = page.createElement('div');
row.className = 'row';

  const pixButton = page.createElement('button');
  pixButton.className = 'payment-form';
  pixButton.innerHTML = '<ion-icon name="grid" style="transform: rotateZ(45deg);"></ion-icon> Pix'
  row.appendChild(pixButton)

center.appendChild(pixButton);

/* Dynamic box */
const dynamicContent = page.createElement('div');
const buyButton = page.createElement('button');
buyButton.innerHTML = '<ion-icon name="cart"></ion-icon> Comprar agora'
buyButton.className = 'buy-button';
center.appendChild(dynamicContent);
center.appendChild(buyButton);
body.appendChild('center');