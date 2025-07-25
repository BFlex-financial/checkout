let CACHE_VERSION;
let CACHE_NAME;
let ALLOWED_DOMAINS = [];

let resourcesToCache = [];
let CSSresources = [];
let JSresources = [];
let removeResources = [];
let DOMLanguagesRequested = [];
let allowDOM = false;
let DOMs = [];
let lastDOM;
let cssContent;

class DOMGenerator {
  static async makeDOM(language, style) {
    let htmlObj = {
      head: `
          <!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width='device-width', initial-scale=1.0">
  <title>Checkout</title>
</head>
      `,
      style: `
      <style>${style}</style>
      `,
      body: `<body>
<section id="main">
      <aside class="info">
          <section class="cont">
              <aside class="valueinfo">
                  <p id="info">Valor Total</p>
                  <h1 id="totalValue"><span id="coin">R&#36;</span><span class="value"><span class="int">0</span><span
                              class="decimal">.00</span></span></h1>
              </aside>

              <aside class="products">
                  <div id="product">
                      <section class="details">
                          <img src="https://comidinhasdochef.com/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/2020/04/Miojo-no-Microondas-Simples.jpg.webp"
                              alt="">
                          <div class="container">
                              <span class="value">
                                  <div class="details">
                                      <p class="name">Miojo</p>
                                      <p class="description">Nissin</p>
                                  </div>
                                  <button class="quantity">Quantidade <span class="quantityNumber">1</span> <svg
                                          viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                          <path
                                              d="M6.34317 7.75732L4.92896 9.17154L12 16.2426L19.0711 9.17157L17.6569 7.75735L12 13.4142L6.34317 7.75732Z"
                                              fill="currentColor" />
                                      </svg></button>
                              </span>
                          </div>
                      </section>

                      <div class="value">
                          <p class="value"><span id="coin">R&#36;</span><span id="value">10.00</span></p>
                          <p class="unity">Unidade<span class="container"><span id="coin">R&#36;</span><span
                                      id="value">10.00</span></span></p>
                      </div>
                  </div>

                  <div id="product">
                      <section class="details">
                          <img src="https://drogariasp.vteximg.com.br/arquivos/ids/435164-1000-1000/641693---energetico-monster-energy-473ml-spal.jpg?v=637496168469870000"
                              alt="">
                          <div class="container">
                              <span class="value">
                                  <div class="details">
                                      <p class="name">Monster</p>
                                      <p class="description">Monster</p>
                                  </div>
                                  <button class="quantity">Quantidade <span class="quantityNumber">2</span> <svg
                                          viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                          <path
                                              d="M6.34317 7.75732L4.92896 9.17154L12 16.2426L19.0711 9.17157L17.6569 7.75735L12 13.4142L6.34317 7.75732Z"
                                              fill="currentColor" />
                                      </svg></button>
                              </span>
                          </div>
                      </section>

                      <div class="value">
                          <p class="value"><span id="coin">R&#36;</span><span id="value">16.50</span></p>
                          <p class="unity">Unidade<span class="container"><span id="coin">R&#36;</span><span
                                      id="value">8.00</span></span></p>
                      </div>
                  </div>
              </aside>

              <aside class="calculation">
                  <aside class="coupon removable">
                      <div class="applying">
                          <button class="applyCouponBtn enabled">Aplicar cupom</button>
                          <div class="container">
                              <input placeholder="Aplicar cupom" autocomplete="off" maxlength="16" type="text"
                                  id="applyCouponInput">
                              <div class="apply">
                                  <button class="applyBtn">Apply</button>
                              </div>
                          </div>
                          <p class="message">Cupom inválido</p>
                      </div>
                      <div class="applied removable">
                          <div class="container">
                              <section class="coupon">
                                  <div class="cont">
                                      <aside class="symbol">
                                          <svg xmlns="http://www.w3.org/2000/svg"
                                              xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="mdi-tag"
                                              width="24" height="24" viewBox="0 0 24 24">
                                              <path
                                                  d="M5.5,7A1.5,1.5 0 0,1 4,5.5A1.5,1.5 0 0,1 5.5,4A1.5,1.5 0 0,1 7,5.5A1.5,1.5 0 0,1 5.5,7M21.41,11.58L12.41,2.58C12.05,2.22 11.55,2 11,2H4C2.89,2 2,2.89 2,4V11C2,11.55 2.22,12.05 2.59,12.41L11.58,21.41C11.95,21.77 12.45,22 13,22C13.55,22 14.05,21.77 14.41,21.41L21.41,14.41C21.78,14.05 22,13.55 22,13C22,12.44 21.77,11.94 21.41,11.58Z" />
                                          </svg>
                                      </aside>
                                      <aside class="name">
                                          <p class="appliedCouponName"></p>
                                      </aside>
                                  </div>
                                  <aside class="close">
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"
                                          xmlns="http://www.w3.org/2000/svg">
                                          <path
                                              d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
                                              fill="currentColor" />
                                      </svg>
                                  </aside>
                              </section>
                              <p class="percentage"><span class="cont"><span class="value"><span
                                              class="int">0</span><span class="decimal">.00</span></span>&#x25;</span>
                                  off
                              </p>
                          </div>
                          <aside class="valueOfDiscount">
                              <p class="value">-<span id="coin">R&#36;</span><span class="value"><span
                                          class="int">0</span><span class="decimal">.00</span></span></p>
                          </aside>
                      </div>
                  </aside>
              </aside>
          </section>
      </aside>
      <aside class="pay">
          <section class="container">
              <section class="payment">
                  <aside class="google">
                      <button class="googlepay"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 512 512" id="Layer_1" version="1.1" viewBox="0 0 512 512" xml:space="preserve"><g><path class="red" d="M42.4,145.9c15.5-32.3,37.4-59.6,65-82.3c37.4-30.9,80.3-49.5,128.4-55.2c56.5-6.7,109.6,4,158.7,33.4   c12.2,7.3,23.6,15.6,34.5,24.6c2.7,2.2,2.4,3.5,0.1,5.7c-22.3,22.2-44.6,44.4-66.7,66.8c-2.6,2.6-4,2.4-6.8,0.3   c-64.8-49.9-159.3-36.4-207.6,29.6c-8.5,11.6-15.4,24.1-20.2,37.7c-0.4,1.2-1.2,2.3-1.8,3.5c-12.9-9.8-25.9-19.6-38.7-29.5   C72.3,169,57.3,157.5,42.4,145.9z" fill="currentColor"/><path class="green" d="M126,303.8c4.3,9.5,7.9,19.4,13.3,28.3c22.7,37.2,55.1,61.1,97.8,69.6c38.5,7.7,75.5,2.5,110-16.8   c1.2-0.6,2.4-1.2,3.5-1.8c0.6,0.6,1.1,1.3,1.7,1.8c25.8,20,51.7,40,77.5,60c-12.4,12.3-26.5,22.2-41.5,30.8   c-43.5,24.8-90.6,34.8-140.2,31C186.3,501.9,133,477.5,89,433.5c-19.3-19.3-35.2-41.1-46.7-66c10.7-8.2,21.4-16.3,32.1-24.5   C91.6,329.9,108.8,316.9,126,303.8z" fill="currentColor"/><path class="blue" d="M429.9,444.9c-25.8-20-51.7-40-77.5-60c-0.6-0.5-1.2-1.2-1.7-1.8c8.9-6.9,18-13.6,25.3-22.4   c12.2-14.6,20.3-31.1,24.5-49.6c0.5-2.3,0.1-3.1-2.2-3c-1.2,0.1-2.3,0-3.5,0c-40.8,0-81.7-0.1-122.5,0.1c-4.5,0-5.5-1.2-5.4-5.5   c0.2-29,0.2-58,0-87c0-3.7,1-4.7,4.7-4.7c74.8,0.1,149.6,0.1,224.5,0c3.2,0,4.5,0.8,5.3,4.2c6.1,27.5,5.7,55.1,2,82.9   c-3,22.2-8.4,43.7-16.7,64.5c-12.3,30.7-30.4,57.5-54.2,80.5C431.6,443.8,430.7,444.3,429.9,444.9z" fill="currentColor"/><path class="yellow" d="M126,303.8c-17.2,13.1-34.4,26.1-51.6,39.2c-10.7,8.1-21.4,16.3-32.1,24.5C34,352.1,28.6,335.8,24.2,319   c-8.4-32.5-9.7-65.5-5.1-98.6c3.6-26,11.1-51,23.2-74.4c15,11.5,29.9,23.1,44.9,34.6c12.9,9.9,25.8,19.7,38.7,29.5   c-2.2,10.7-5.3,21.2-6.3,32.2c-1.8,20,0.1,39.5,5.8,58.7C125.8,301.8,125.9,302.8,126,303.8z" fill="currentColor"/></g></svg>Pay</button>
                  </aside>

                  <aside class="divider">
                      <hr>
                      <p>OU</p>
                  </aside>

                  <form action="form.js" id="paymentForm" novalidate>
                      <aside class="info">
                          <aside class="name">
                              <label for="fullName">
                                  <p>Nome<span class="error"><span class="svg"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px"
                                      y="0px" viewBox="0 0 25.765 25.765" style="enable-background:new 0 0 25.765 25.765;" xml:space="preserve">
                                      <g>
                                          <path
                                              d="M25.244,20.433L14.459,2.984c-0.868-1.404-2.28-1.408-3.15,0L0.522,20.433   c-1.165,1.885-0.315,3.402,1.889,3.402h20.944C25.559,23.835,26.405,22.312,25.244,20.433z M12.884,20.835c-0.553,0-1-0.447-1-1   s0.447-1,1-1c0.554,0,1,0.447,1,1S13.437,20.835,12.884,20.835z M13.884,15.838c0,0.544-0.446,0.997-1,0.997   c-0.556,0-1-0.446-1-0.997V9.832c0-0.544,0.447-0.997,1-0.997c0.557,0,1,0.446,1,0.997V15.838z" />
                                      </g>
                                  </svg></span><span class="content"></span></span></p>
                                  <input type="text" id="fullName">
                              </label>
                          </aside>

                          <aside class="mail">
                              <label for="fullMail">
                                  <p>Email<span class="error"><span class="svg"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px"
                                      y="0px" viewBox="0 0 25.765 25.765" style="enable-background:new 0 0 25.765 25.765;" xml:space="preserve">
                                      <g>
                                          <path
                                              d="M25.244,20.433L14.459,2.984c-0.868-1.404-2.28-1.408-3.15,0L0.522,20.433   c-1.165,1.885-0.315,3.402,1.889,3.402h20.944C25.559,23.835,26.405,22.312,25.244,20.433z M12.884,20.835c-0.553,0-1-0.447-1-1   s0.447-1,1-1c0.554,0,1,0.447,1,1S13.437,20.835,12.884,20.835z M13.884,15.838c0,0.544-0.446,0.997-1,0.997   c-0.556,0-1-0.446-1-0.997V9.832c0-0.544,0.447-0.997,1-0.997c0.557,0,1,0.446,1,0.997V15.838z" />
                                      </g>
                                  </svg></span><span class="content"></span></span></p>
                                  <input type="email" id="fullMail">
                              </label>
                          </aside>

                          <aside class="cpf">
                              <label for="fullCpf">
                                  <p>CPF<span class="error"><span class="svg"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px"
                                      y="0px" viewBox="0 0 25.765 25.765" style="enable-background:new 0 0 25.765 25.765;" xml:space="preserve">
                                      <g>
                                          <path
                                              d="M25.244,20.433L14.459,2.984c-0.868-1.404-2.28-1.408-3.15,0L0.522,20.433   c-1.165,1.885-0.315,3.402,1.889,3.402h20.944C25.559,23.835,26.405,22.312,25.244,20.433z M12.884,20.835c-0.553,0-1-0.447-1-1   s0.447-1,1-1c0.554,0,1,0.447,1,1S13.437,20.835,12.884,20.835z M13.884,15.838c0,0.544-0.446,0.997-1,0.997   c-0.556,0-1-0.446-1-0.997V9.832c0-0.544,0.447-0.997,1-0.997c0.557,0,1,0.446,1,0.997V15.838z" />
                                      </g>
                                  </svg></span><span class="content"></span></span></p>
                                  <input type="number" id="fullCPF">
                              </label>
                          </aside>
                      </aside>

                      <aside class="methods">
                          <p>Métodos de pagamento<span class="error"><span class="svg"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px"
                              y="0px" viewBox="0 0 25.765 25.765" style="enable-background:new 0 0 25.765 25.765;" xml:space="preserve">
                              <g>
                                  <path
                                      d="M25.244,20.433L14.459,2.984c-0.868-1.404-2.28-1.408-3.15,0L0.522,20.433   c-1.165,1.885-0.315,3.402,1.889,3.402h20.944C25.559,23.835,26.405,22.312,25.244,20.433z M12.884,20.835c-0.553,0-1-0.447-1-1   s0.447-1,1-1c0.554,0,1,0.447,1,1S13.437,20.835,12.884,20.835z M13.884,15.838c0,0.544-0.446,0.997-1,0.997   c-0.556,0-1-0.446-1-0.997V9.832c0-0.544,0.447-0.997,1-0.997c0.557,0,1,0.446,1,0.997V15.838z" />
                              </g>
                          </svg></span><span class="content"></span></span></p>
                          <aside class="selector">
                              <div class="option card">
                                  <label>
                                      <input type="radio">
                                      <div class="info">
                                          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                              style="enable-background:new 0 0 48 48;" version="1.1" viewBox="0 0 48 48" xml:space="preserve">
                                              <g id="Icons">
                                                  <g>
                                                      <path
                                                          d="M38.62744,34.90911H9.37245c-1.21976,0-2.20851-0.98886-2.20851-2.20851v-17.4011    c0-1.21976,0.98875-2.20862,2.20862-2.20862h29.25477c1.21987,0,2.20873,0.98886,2.20873,2.20873v17.40088    C40.83606,33.92026,39.8472,34.90911,38.62744,34.90911z"
                                                          style="fill:#F9F9F9;" />
                                                      <rect height="3.43589" style="fill:#383838;" width="33.67212" x="7.16394" y="18.76018" />
                                                      <path
                                                          d="    M38.62744,34.90911H9.37245c-1.21976,0-2.20851-0.98886-2.20851-2.20851v-17.4011c0-1.21976,0.98875-2.20862,2.20862-2.20862    h29.25477c1.21987,0,2.20873,0.98886,2.20873,2.20873v17.40088C40.83606,33.92026,39.8472,34.90911,38.62744,34.90911z"
                                                          style="fill:none;stroke:#303030;stroke-width:0.8;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" />
                                                      <line
                                                          style="fill:none;stroke:#303030;stroke-width:0.8;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;"
                                                          x1="7.16394" x2="40.60214" y1="18.76018" y2="18.76018" />
                                                      <line
                                                          style="fill:none;stroke:#303030;stroke-width:0.8;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;"
                                                          x1="40.59009" x2="7.34546" y1="22.19606" y2="22.19606" />
                                                      <line
                                                          style="fill:none;stroke:#303030;stroke-width:0.8;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;"
                                                          x1="10.25618" x2="18.5883" y1="30.87183" y2="30.87183" />
                                                      <line
                                                          style="fill:none;stroke:#303030;stroke-width:0.8;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;"
                                                          x1="10.25618" x2="13.83698" y1="28.18824" y2="28.18824" />
                                                  </g>
                                              </g>
                                          </svg>
                                          <p>Crédito ou Débito</p>
                                      </div>
                                  </label>
                              </div>
                              <div class="option pix">
                                  <label>
                                      <input type="radio">
                                      <div class="info">
                                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
                                              <path
                                                  d="M242.4 292.5C247.8 287.1 257.1 287.1 262.5 292.5L339.5 369.5C353.7 383.7 372.6 391.5 392.6 391.5H407.7L310.6 488.6C280.3 518.1 231.1 518.1 200.8 488.6L103.3 391.2H112.6C132.6 391.2 151.5 383.4 165.7 369.2L242.4 292.5zM262.5 218.9C256.1 224.4 247.9 224.5 242.4 218.9L165.7 142.2C151.5 127.1 132.6 120.2 112.6 120.2H103.3L200.7 22.76C231.1-7.586 280.3-7.586 310.6 22.76L407.8 119.9H392.6C372.6 119.9 353.7 127.7 339.5 141.9L262.5 218.9zM112.6 142.7C126.4 142.7 139.1 148.3 149.7 158.1L226.4 234.8C233.6 241.1 243 245.6 252.5 245.6C261.9 245.6 271.3 241.1 278.5 234.8L355.5 157.8C365.3 148.1 378.8 142.5 392.6 142.5H430.3L488.6 200.8C518.9 231.1 518.9 280.3 488.6 310.6L430.3 368.9H392.6C378.8 368.9 365.3 363.3 355.5 353.5L278.5 276.5C264.6 262.6 240.3 262.6 226.4 276.6L149.7 353.2C139.1 363 126.4 368.6 112.6 368.6H80.78L22.76 310.6C-7.586 280.3-7.586 231.1 22.76 200.8L80.78 142.7H112.6z" />
                                          </svg>
                                          <p>Pix</p>
                                      </div>
                                  </label>
                              </div>
                          </aside>
                      </aside>

                      <aside class="submit">
                          <aside class="error">
                              <p><span class="error"><span class="svg"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px"
                                  y="0px" viewBox="0 0 25.765 25.765" style="enable-background:new 0 0 25.765 25.765;" xml:space="preserve">
                                  <g>
                                      <path
                                          d="M25.244,20.433L14.459,2.984c-0.868-1.404-2.28-1.408-3.15,0L0.522,20.433   c-1.165,1.885-0.315,3.402,1.889,3.402h20.944C25.559,23.835,26.405,22.312,25.244,20.433z M12.884,20.835c-0.553,0-1-0.447-1-1   s0.447-1,1-1c0.554,0,1,0.447,1,1S13.437,20.835,12.884,20.835z M13.884,15.838c0,0.544-0.446,0.997-1,0.997   c-0.556,0-1-0.446-1-0.997V9.832c0-0.544,0.447-0.997,1-0.997c0.557,0,1,0.446,1,0.997V15.838z" />
                                  </g>
                              </svg></span><span class="content">Pagamento recusado</span></span></p>
                          </aside>
                          <button type="submit">Pay</button>
                      </aside>
                  </form>
              </section>
          </section>
      </aside>
  </section>
  <script src="script.js"></script>
  <script src="errors.js"></script>
  <script src="form.js"></script>
  </body>
</html>`,
      generate() {
        return (this.head + this.style + this.body).replace(/\s+/g, ' ').trim();
      }
    }

    return htmlObj.generate()
  }
}

self.addEventListener('install', () => {
  self.skipWaiting();
})

self.addEventListener('message', (ev) => {
  const { type } = ev.data;
  const ports = ev.ports;

  if (!type) return console.error('Type not found');

  if (type == 'APP_RESOURCES') {
    const port = ports[0];
    if (!port) return console.error('Port not found');

    port.postMessage({
      type: 'PORT_CONFIRMATION',
      port: 'port2'
    });

    const { version, config } = ev.data;
    ev.waitUntil(
      (async () => {
        if (version !== CACHE_VERSION) {
          console.log('Versions not equals:', version);
          console.log('Current version:', CACHE_VERSION);

          await caches.keys().then(key => {
            return key.forEach(cache => {
              caches.delete(cache);
            })
          }).catch(err => {
            console.error('Error deleting cache:', err);
          });

          await findArraysInObject(config);

          CACHE_VERSION = version;
          CACHE_NAME = `BFlex_checkout_v${CACHE_VERSION}`;
          console.log('New version:', CACHE_VERSION);

          resourcesToCache.push(...CSSresources, ...JSresources);

          console.log(resourcesToCache)
          console.log(removeResources)

          removeResources.forEach(async file => {
            try {
              const response = await fetch(file, { method: 'HEAD' });
              if (!response.ok) {
                console.warn('File not found:', file);
                if (resourcesToCache.indexOf(file) !== -1) {
                  resourcesToCache.splice(resourcesToCache.indexOf(file), 1);
                }
              }
            } catch (error) {
              console.error('Error checking file:', file, error);
              if (resourcesToCache.indexOf(file) !== -1) {
                resourcesToCache.splice(resourcesToCache.indexOf(file), 1);
              }
            }
          });
          console.log('Resources to cache after removing:', resourcesToCache);

          try {
            const cache = await caches.open(CACHE_NAME);

            const validResources = await Promise.all(
              resourcesToCache.map(async (resource) => {
                try {
                  const response = await fetch(resource, { method: 'HEAD' });
                  return response.ok ? resource : null;
                } catch (error) {
                  console.error('Invalid resource:', resource, error);
                  return null;
                }
              })
            ).then(results => results.filter(Boolean));

            console.log('Resources to cache:', validResources);

            await cache.addAll(validResources)
              .then(() => {
                console.log('Successfully cached:', validResources);
              })
              .catch(err => {
                console.error('Failed to cache');
                if (err instanceof AggregateError) {
                  for (const error of err.errors) {
                    console.error('-', error.request.url || error.message);
                  }
                } else {
                  console.error('-', err.request?.url || err.message);
                }
              });

            getFileContentFromCache('style.css').then(text => {
              cssContent = text;
            });
            console.log(CACHE_NAME)

            port.postMessage({
              type: 'CACHE_RESOURCES_FINISHED',
              message: 'Cache updated successfully',
            });

            allowDOM = true;

            resourcesToCache = [];
            removeResources = [];
          } catch (err) {
            console.error('Cache operation failed:', err);
            port.postMessage({
              type: 'ERROR',
              message: 'Cache operation failed',
            });
          }
          return;
        }

        if (!lastDOM || typeof lastDOM !== 'string') {
          port.postMessage({
            type: 'ERROR',
            message: 'LastDOM invalid',
          });

          console.error('LastDOM invalid, wipping and reloading cache');
          await caches.keys().then(key => {
            return key.forEach(cache => {
              caches.delete(cache);
            })
          })
          return;
        }

        port.postMessage({
          type: 'VERSION_EQUALS',
          content: lastDOM
        })
      })()
    );
  } else if (type === 'APP_DOM') {
    const { config } = ev.data;
    const port = ports[0];
    if (!port || typeof config !== 'object') return console.error('Port not found or invalid atributes', !config ? ev.data : port);

    port.onmessage = (event) => {
      console.log('[Service Worker] Recebido:', event.data);
    };

    port.postMessage({
      type: 'DOM_CONFIRMATION',
      message: 'DOM request received'
    });

    console.warn('DOM request received:', ev.data);

    ev.waitUntil(
      (async () => {
        try {
          console.log('DOM request received:', config);
          await findArraysInObject(config);
          console.log('Languages requested:', DOMLanguagesRequested);

          if (!allowDOM) {
            await new Promise(resolve => {
              const checkAllowDOM = () => {
                if (allowDOM) {
                  resolve();
                } else {
                  setTimeout(checkAllowDOM, 100);
                }
              };
              checkAllowDOM();
            });
          }

          console.warn(`allowDOM: ${allowDOM}`)

          await DOMLanguagesRequested.forEach(async lang => {
            const htmlContent = DOMGenerator.makeDOM(lang, cssContent);
            await htmlContent.then(content => {
              DOMs.push(content);
            });
          });

          lastDOM = DOMs[0];

          port.postMessage({
            type: 'DOM_CONTENT',
            message: 'The DOM is ready',
            content: lastDOM
          })

          DOMLanguagesRequested = [];
          DOMs = [];
        } catch (err) {
          port.postMessage({
            type: 'ERROR',
            message: 'DOM operation failed',
          });
        }
      })()
    );
  }
})


self.addEventListener('fetch', (ev) => {
  console.log('Your fetch is', ev.request.url)
  ev.respondWith(
    caches.match(ev.request)
      .then(response => {
        return response || fetch(ev.request);
      })
      .catch(() => {
        if (ev.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      })
  );
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  clients.claim();
});

function findArraysInObject(obj, path = '') {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const currentPath = path ? `${path}.${key}` : key;

      if (Array.isArray(value)) {
        console.log('Array encontrado:', currentPath, value);
        if (currentPath.toLowerCase().includes('resources')) {
          if (currentPath.toLowerCase().includes('local')) {
            if (!currentPath.toLowerCase().includes('remove')) {
              value.forEach(file => {
                let fileName = file.split('/').pop().split('.');
                console.log(fileName)
                if (resourcesToCache.indexOf(file) === -1 && fileName.length > 1) {
                  console.warn(`File extension ${fileName[1]}`)
                  if (fileName[1].includes('js')) {
                    JSresources.push(file);
                  } else if (fileName[1].includes('css')) {
                    CSSresources.push(file);
                  } else {
                    resourcesToCache.push(file);
                  }
                } else if (fileName.length === 1) {
                  console.warn('File extension missing:', file);
                  return
                }
              })
            } else {
              value.forEach(file => {
                let fileName = file.split('/').pop().split('.');
                console.log(fileName)
                if (removeResources.indexOf(file) === -1 && fileName.length > 1) {
                  removeResources.push(file);
                } else if (fileName.length === 1) {
                  console.warn('File extension missing:', file);
                  return
                }
              })
            }
          } else if (currentPath.toLowerCase().includes('external') && currentPath.toLowerCase().includes('allowed')) {
            value.forEach(file => {
              if (ALLOWED_DOMAINS.indexOf(file) === -1) {
                ALLOWED_DOMAINS.push(file);
              }
            })
          }
        } else if (currentPath.toLowerCase().includes('languages')) {
          value.forEach(lang => {
            let language = lang.toLowerCase().split('/').pop().split('.').join('');
            if (DOMLanguagesRequested.indexOf(language) === -1) {
              DOMLanguagesRequested.push(language);
            }
          })
        } else {
          console.error("Array don't allowed:", currentPath, value);
        }
      } else if (typeof value === 'object' && value !== null) {
        findArraysInObject(value, currentPath);
      }
    }
  }
}

function getFileContentFromCache(file) {
  return caches.open(CACHE_NAME).then(cache => {
    return cache.match(file).then(response => {
      if (response) {
        return response.text().then(content => {
          return content;
        });
      } else {
        console.error('Error on match file:', file)
      }
    });
  })
}