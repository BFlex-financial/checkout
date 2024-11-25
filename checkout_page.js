const api = "http://127.0.0.1:8080"
const page = document;
const head = page.querySelector('head');
const body = page.querySelector('body');

/* titulo */
const titleElement = page.createElement('title');
const titleContent = `BFlex payment - Checkout - ${checkout.name}`;
const titleNode = page.createTextNode(titleContent);
titleElement.appendChild(titleNode);
head.appendChild(titleElement);

/* favicon */
const faviconElement = page.createElement('link');
faviconElement.rel = 'shortcut icon';
faviconElement.href = 'https://BFlex-financial.github.io/checkout/favicon.png'
head.appendChild(faviconElement);

/* div */
body.style = "width: 100vw; min-height: 100vh; display: flex; align-items: center; justify-content: center;";
const center = page.createElement('div');
center.className = 'box';
  
/* Product info */
const product = page.createElement('div');
product.className = 'product';
    
  /* Product image */
  const thumbnail = page.createElement('img');
  thumbnail.className = 'thumbnail';
  thumbnail.src = checkout.thumbnail;
  product.appendChild(thumbnail);
  
  /* Info display */
  const info = page.createElement('div');
    const align = page.createElement('div');

      const productName = page.createElement('p');
      const nameContent = checkout.name || "Uknown";
      const name = page.createTextNode(nameContent);
      productName.appendChild(name);
      productName.className = 'name'
      align.appendChild(productName)

      const productDescription = page.createElement('p');
      const descriptionContent = checkout.description || "Uknown";
      const description = page.createTextNode(descriptionContent);
      productDescription.appendChild(description);
      productDescription.className = 'description'
      align.appendChild(productDescription)

    info.appendChild(align);
  product.appendChild(info);

center.appendChild(product);

/* Payment form */
const row = page.createElement('div');
row.className = 'row';

  const pixButton = page.createElement('button');
  pixButton.className = 'payment-form';
  pixButton.innerHTML = '<ion-icon name="grid" style="transform: rotateZ(45deg);"></ion-icon> Pix'
  row.appendChild(pixButton)
  pixButton.onclick = () => renderDynamic('Pix');

  const cardButton = page.createElement('button');
  cardButton.className = 'payment-form';
  cardButton.innerHTML = '<ion-icon name="card"></ion-icon> Card'
  row.appendChild(cardButton)
  cardButton.onclick = () => renderDynamic('Card');

  const googleButton = page.createElement('button');
  googleButton.className = 'payment-form';
  googleButton.innerHTML = '<ion-icon name="logo-google"></ion-icon> GPay'
  row.appendChild(googleButton)
  googleButton.onclick = () => renderDynamic('GPay');

center.appendChild(row);

/* Dynamic box */
const dynamicContent = page.createElement('div');
dynamicContent.className = 'dynamic-content'
center.appendChild(dynamicContent);

/* Buy button */ 
const buyButton = page.createElement('button');
buyButton.innerHTML = '<ion-icon name="cart"></ion-icon> Comprar agora'
buyButton.className = 'buy-button';
center.appendChild(buyButton);

body.appendChild(center);

renderDynamic('Pix');

/* functions */

var pixInfo = '<div class="qr-code" style="display: none;"></div>';
var literal = '';
function renderDynamic(method) {
  const dyn = page.querySelector('.dynamic-content');
  switch(method) {
    case 'Pix': {
      dyn.innerHTML = `
        <input class="email" type="email" placeholder="Seu melhor Email">
        <input class="cpf"   type="number" placeholder="Seu CPF">
        ${pixInfo || ''}
        <button onclick="generate()"> <ion-icon name="qr-code-outline"></ion-icon> Gerar Pix </button>
      `;
      break;
    }
    default: {
      dyn.innerHTML = '';
      break;
    }
  }
}

let gen = true;
function generate() {
  if( gen ) gen = !gen;
  else return;

  fetch(`${api}/payment/create`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'Authorization-key': 'Bearer NON_KEY'
    },
    body: JSON.stringify({
      "amount": 0.21,
      "method": "Checkout",
      "checkout_id": checkout.id,
      "payment_type": {
        "method": "Pix",
        "payer_email": page.querySelector(".email").value,
        "payer_cpf": page.querySelector(".cpf").value,
        "amount": 12.0
      }
    })
  }).then(x => x.json()).then((res) => {
    pixInfo = `<div class="qr-code"><img src="data:image/png;base64,${res.data.qr_code.base64}"></div>`;
    literal = res.data.qr_code.literal;
    renderDynamic('Pix');
  })
}