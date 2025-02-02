let form = document.getElementById('paymentForm');
const serverURL = 'https://49cb-179-108-204-191.ngrok-free.app';
let checkout = {
    "id": "6584567"
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    let verifySelectedMethod = verifyChecked(undefined, true);
    console.log(`After submit the result of inputs is: ${verifySelectedMethod}`);
    if(verifySelectedMethod == "pix") {
        processPayment("pix", { literal: "123456", base64: "imagemEmBase64", id: "payment_id_pix" });
    } else if(verifySelectedMethod == "card") {
        processPayment("cartao", {
            nome: "Lucas Felix Silveira",
            rua: "Rua Exemplo",
            numero: "123",
            bairro: "Centro",
            cidade: "São Paulo",
            estado: "SP",
            cep: "01000-000",
            cpf: "12345678900",
            ano: "2026",
            mes: "12",
          });
    }
})

function processPayment(method, paymentData = {}) {
    function loop(payment_id) {
      fetch(`${serverURL}/payment/get/checkout/${checkout.id}/${payment_id}`, {
        method: 'GET',
        headers: { 'Content-type': 'application/json' },
      })
        .then(x => x.json())
        .then(res => {
          console.log(res);
          if (res.data.status !== "approved") {
            setTimeout(() => {
              loop(payment_id);
            }, 5000);
          } else {
            alert("Pagamento aprovado!");
          }
        });
    }
  
    if (method === "pix") {
      if (paymentData.literal) {
        pixInfo = `<div class="qr-code"><img src="data:image/png;base64,${paymentData.base64}"></div>`;
        literal = paymentData.literal;
        loop(paymentData.id);
      } else {
        fetch(`${api}/payment/create`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            'Authorization-key': 'Bearer NON_KEY',
          },
          body: JSON.stringify({
            amount: 0.21,
            method: "Checkout",
            checkout_id: checkout.id,
            payment_type: {
              currency: "BRL",
              method: "Pix",
              amount: 0.0,
              payer: {
                email: "user@gmail.com",
                identification: {
                  country: "Brazil",
                  number: "cpf",
                },
              },
            },
          }),
        })
          .then(x => x.json())
          .then(res => {
            pixInfo = `<div class="qr-code"><img src="data:image/png;base64,${res.data.qr_code.base64}"></div>`;
            literal = res.data.qr_code.literal;
            loop(res.data.payment_id);
          });
      }
    } else if (method === "card") {
      fetch(`${api}/payment/create`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization-key': 'Bearer NON_KEY',
        },
        body: JSON.stringify({
          amount: 0.21,
          method: "Checkout",
          checkout_id: checkout.id,
          payment_type: {
            method: "Card",
            amount: 0.0,
            payer: {
              full_name: paymentData.nome,
              email: "user@gmail.com",
              address: {
                pattern: "Brazil",
                street: paymentData.rua,
                number: paymentData.numero,
                neighborhood: paymentData.bairro,
                city: paymentData.cidade,
                federative_unity: paymentData.estado,
                cep: paymentData.cep,
              },
              identification: {
                country: "Brazil",
                number: paymentData.cpf,
              },
              currency: "BRL",
              expiration_year: paymentData.ano,
              expiration_month: paymentData.mes,
            },
          },
        }),
      })
        .then(x => x.json())
        .then(res => {
          if (res.code === 200) {
            alert("Pagamento aprovado");
          } else {
            alert("Pagamento negado.");
          }
        });
    } else {
      console.error("Método de pagamento inválido. Use 'pix' ou 'cartao'.");
    }
  }
  