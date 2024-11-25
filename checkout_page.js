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

  const specials = page.querySelectorAll('.special') || [];
  specials.forEach(item => item.remove());

  switch(method) {
    case 'Pix': {
      dyn.innerHTML = `
        <input class="field email" type="email" placeholder="Seu melhor Email">
        <input class="field cpf"   type="number" placeholder="Seu CPF">
        ${pixInfo || ''}
        <button class="qr_code_btn" onclick="generate()"> <ion-icon name="qr-code-outline"></ion-icon> ${
          literal ? 'Copiar Pix' : 'Gerar Pix'
        } </button>
      `;
      page.querySelector('.field.email').focus();
      createSpecial('cpf')
      page.querySelector('.field.cpf').onfocus = () => special('cpf');
      createSpecial('email')
      page.querySelector('.field.email').onfocus = () => special('email');
      break;
    }
    case 'Card': {
      dyn.innerHTML = `
        <input class="field number" type="number" placeholder="Numero">
        <input class="field name"   type="text" placeholder="Nome do titular">
        <input class="field email"  type="email" placeholder="Seu melhor Email">
        <input class="field cpf"    type="number" placeholder="Seu CPF">
        <input class="field cvv"    type="number" placeholder="CVV" min="100" max="999">
        <input class="field data"   type="text" placeholder="Validade">
        ${pixInfo || ''}
        <button class="qr_code_btn" onclick="generate()"> <ion-icon name="qr-code-outline"></ion-icon> ${
          literal ? 'Copiar Pix' : 'Gerar Pix'
        } </button>
      `;

      createSpecial('number')
      page.querySelector('.field.number').focus();
      createSpecial('cpf')
      page.querySelector('.field.cpf').onfocus = () => special('cpf');
      createSpecial('email')
      page.querySelector('.field.email').onfocus = () => special('email');
      createSpecial('data')
      page.querySelector('.field.data').onfocus = () => special('data');
      createSpecial('number')
      page.querySelector('.field.number').onfocus = () => special('number');
      break;
    }
    default: {
      dyn.innerHTML = '';
      break;
    }
  }
}

function special(type) {
  switch(type) {
    case 'cpf': {
      const cpf = page.querySelector('.special.cpf');
      const field = page.querySelector('.field.cpf');

      cpf.focus();
      let stop = false;
      cpf.onblur = () => { stop = true; }
      
      const cpf_len = '00000000000'.length;
      while(! stop ) {
        const len = cpf.value.length;
        
        if( len > cpf_len )
          cpf.value = cpf.value.slice(0,cpf_len)

        const val = cpf.value;
        if( len >= 9 ) 
          field.value = `${val.slice(0,3)}.${val.slice(4,6)}.${val.slice(7,9)}-${val.slice(10,11)}`;
        else if( len >= 6 ) 
          field.value = `${val.slice(0,3)}.${val.slice(4,6)}.${val.slice(7,9)}`;
        else if( len >= 3 ) 
          field.value = `${val.slice(0,3)}.${val.slice(4,6)}`;
        else if( len >= 0 ) 
          field.value = `${val.slice(0,3)}`;
      }

      cpf.onblur = () => {}
    }
  }
}

function createSpecial(field) {
  const div = page.createElement('div');
  div.className = 'special';
  const nField = page.createElement('input');
  div.classList.add('special');
  div.classList.add('field');
  div.appendChild(nField); 
  body.appendChild(div);
} 

function isValidCpf(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');

  if( cpf.length !== 11 || /^(\d)\1+$/.test(cpf) ) {
    return false;
  }

  const calcularDigito = (base, fatorInicial) => {
    let soma = 0;
    let i = 0;
    for(; i < base.length; i++ ) {
      soma += parseInt(base[i]) * (fatorInicial - i);
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  // Calcula os dois dígitos verificadores
  const base = cpf.slice(0, 9); // Primeiros 9 dígitos
  const digito1 = calcularDigito(base, 10);
  const digito2 = calcularDigito(base + digito1, 11);

  // Verifica se os dígitos calculados coincidem com os do CPF informado
  return cpf === base + digito1.toString() + digito2.toString();
}

let gen = true;
function generate() {
  const email = page.querySelector(".email").value;
  if(! email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/) ) 
    return alert("Email invalido");
  
  const cpf = page.querySelector(".cpf").value;
  if(! isValidCpf(cpf) ) 
    return alert("CPF invalido");

  if( gen ) gen = !gen;
  else {
    navigator.clipboard.writeText(literal);
    return;
  };

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
        "payer_email": email,
        "payer_cpf": cpf,
        "amount": 12.0
      }
    })
  }).then(x => x.json()).then((res) => {
    pixInfo = `<div class="qr-code"><img src="data:image/png;base64,${res.data.qr_code.base64}"></div>`;
    literal = res.data.qr_code.literal;
    renderDynamic('Pix');
  })
}