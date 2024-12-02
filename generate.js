fetch("https://f176-179-108-204-191.ngrok-free.app/api/checkout/create", {
  headers: {
    'Content-type': 'application/json',
    "Authorization-key": "Bearer admin"
  },
  method: 'POST',
  body: JSON.stringify({
  method: 'Checkout',
  amount: 0.01,
  title: 'Teste',
  description: 'Produto de teste',
  thumbnail: 'https://imgur.com/PKX5vWd.png',
  single_use: true,
  products: [
    {
      type: 'Custom',
      data: {
        price: 0.01,
        thumbnail: 'https://img.jpg',
        name: 'Produto 1.',
        description: 'Produto de ID 1'
      }
    }
  ]
})
}).then(x => x.json()).then(x => console.log(x));