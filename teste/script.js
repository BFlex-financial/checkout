const lastproduct = document.querySelector('aside.products').lastElementChild
const valueElements = document.querySelectorAll('aside.products div#product div.value p.value span#value');
const totalValueContainer = document.querySelector('h1#totalValue span.value')
let values = Array.from(valueElements).map(el => parseFloat(el.textContent));
let totalValue = 0;

document.addEventListener('DOMContentLoaded', () => {
    calculateTotalValue(false, false, true)
})

const applyCouponBtn = document.querySelector('button.applyCouponBtn');
const applyBtn = document.querySelector('button.applyBtn');
const couponInputCont = document.querySelector('aside.coupon div.container');
const couponInput = document.querySelector('aside.coupon div.container input#applyCouponInput');
const couponAppliedName = document.querySelector('aside.coupon div.applied section.coupon aside.name p.appliedCouponName');
const couponAppliedPercentage = document.querySelector('aside.coupon div.applied div.container p.percentage span.value');
const couponAppliedAmount = document.querySelector('aside.coupon div.applied aside.valueOfDiscount p.value span.value');
const couponCloseApplied = document.querySelector('aside.coupon div.applied section.coupon aside.close');
const applying = document.querySelector('aside.coupon div.applying');
const applied = document.querySelector('aside.coupon div.applied');
const couponMessage = document.querySelector('aside.coupon p.message');

const coupons = {
    "name": "TESTE20",
    "percent": '20',
    "amount": 5.3
};

let appliedCoupon = null;
let currentCoupon = null;
let couponMessageIs = false;
let appliedCloseCouponBtnValid = true;
let applyCouponToggleValid = false;
let applyCouponInputBtnValid = true;
let couponInputValue = String;

document.addEventListener('mousedown', (event) => {
    const clickedElement = event.target;

    if (clickedElement) {
        const applyingSelector = `${applying.nodeName}.${[...applying.classList].join('.')}`;

        const clickedClasses = [...clickedElement.classList];
        const clickedElementSelector = clickedClasses.length > 0
            ? `${clickedElement.nodeName}.${clickedClasses.join('.')}`
            : `${clickedElement.nodeName}${clickedElement.id ? '#' + clickedElement.id : ''}`;

        let element = `${applyingSelector} ${clickedElementSelector}`;

        if (!document.querySelector(element)) {
            toggleCouponInputs(false);
        }

    }
});

couponInput.addEventListener('input', async () => {
    couponInput.value = couponInput.value.toUpperCase()
    if (couponMessageIs) {
        couponMessage.classList.remove('invalid')
    }

    if (couponInput.value == '') {
        applyBtn.classList.remove('active')
        await new Promise(resolve => setTimeout(resolve, 400));
        applyBtn.style.display = 'none';
        return
    }
    applyBtn.style.display = 'block';
    await new Promise(resolve => setTimeout(resolve, 100));
    applyBtn.classList.add('active')

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            apply();
        }
    });

})

applyCouponBtn.addEventListener('click', () => {
    toggleCouponInputs(true)
})

applyBtn.addEventListener('click', async () => {
    if (couponInput.value == '') {
        return
    }
    apply()
})

async function apply() {
    if (!applyCouponInputBtnValid) {
        return
    }
    applyCouponInputBtnValid = false;
    let verify = await verifyCouponInput()

    if (!verify) {
        couponMessage.classList.add('invalid')
        couponMessageIs = true;
        applyCouponInputBtnValid = true;
        return
    }

    currentCoupon = coupons;

    appliedCloseCouponBtnValid = true;
    couponMessage.classList.remove('invalid')
    let value = await calculateTotalValue(true, false, false).toString();
    couponAppliedName.textContent = couponInputValue;
    appliedCoupon = couponInput.value;
    couponInput.value = '';
    applying.classList.add('remove')
    applied.classList.add('first')
    await new Promise(resolve => setTimeout(resolve, 500));
    applied.classList.add('show')
    await new Promise(resolve => setTimeout(resolve, 500));

    animateNumbers(couponAppliedPercentage, currentCoupon.percent, false, false)
    animateNumbers(couponAppliedAmount, currentCoupon.amount, true, false)
    animateNumbers(totalValueContainer, value, true, false)
}

couponCloseApplied.addEventListener('click', async () => {
    if (!appliedCloseCouponBtnValid) {
        return
    }

    currentCoupon = null;
    let value = await calculateTotalValue(false, false, false).toString();

    animateNumbers(totalValueContainer, value, true, false)
    animateNumbers(couponAppliedPercentage, 0, false, false)
    animateNumbers(couponAppliedAmount, 0, true, false)

    applied.classList.remove('show')
    await new Promise(resolve => setTimeout(resolve, 600));
    applied.classList.remove('first')
    await new Promise(resolve => setTimeout(resolve, 500));
    applying.classList.remove('remove')
    couponAppliedName.textContent = '';
    applyCouponInput.focus()

    appliedCloseCouponBtnValid = false;
    applyCouponToggleValid = true;
    applyCouponInputBtnValid = true;
})

function verifyCouponInput() {
    couponInputValue = couponInput.value;
    return couponInputValue === coupons.name;
}

async function toggleCouponInputs(btnValid) {

    couponInput.value = '';
    couponMessage.classList.remove('invalid')

    if (!btnValid && applyCouponToggleValid) {
        couponInputCont.classList.toggle('active');
        await new Promise(resolve => setTimeout(resolve, 500));
        couponInputCont.style.display = 'none';

        if (couponInput.value == '') {
            applyBtn.classList.remove('active')
            await new Promise(resolve => setTimeout(resolve, 400));
            applyBtn.style.display = 'none';
        }

        applyCouponBtn.style.display = 'block';
        await new Promise(resolve => setTimeout(resolve, 500));
        applyCouponBtn.classList.add('enabled')

        setTimeout(() => {
            applyCouponToggleValid = false;
        }, 200)
    } else if (btnValid && !applyCouponToggleValid) {
        applyCouponBtnValid = false;
        applyCouponToggleValid = true;
        couponInputCont.style.display = 'inline';
        applyCouponBtn.classList.remove('enabled')

        setTimeout(() => {
            applyCouponBtn.style.display = 'none';
            applyCouponBtnValid = true;
        }, 500)

        setTimeout(() => {
            couponInputCont.classList.toggle('active');
            setTimeout(() => {
                applyCouponInput.focus()
            }, 600)
        }, 400)
    }
}

function calculateTotalValue(coupon, pad, skip) {
    totalValue = 0;

    values.forEach(value => {
        totalValue += value
    });

    if (currentCoupon) {
        return totalValue - parseFloat(currentCoupon.amount)
    }

    if (!coupon) {
        animateNumbers(totalValueContainer, totalValue, pad, skip)
    }

    return totalValue
}

async function animateNumbers(elem, val, pad, skip) {
    let value = val.toString();
    let isDecimal = true;

    if (!value.includes('.')) {
        isDecimal = false;
        value = value.concat('.00')
    }

    let int = elem.firstElementChild;
    let decimal = elem.lastElementChild;
    let intValue = parseInt(value);
    let actualIntValue = parseInt(int.textContent) || 0;
    let floatValue = parseFloat(Array.from(value).splice(value.indexOf('.') + 1).join('').padEnd(2, '0'));
    let extracted = Array.from(decimal.innerHTML).splice(1, 3).join('');
    let actualFloatValue = parseFloat(extracted) || 0;
    let makePad = true;

    if (skip) {
        int.textContent = intValue;
        decimal.textContent = `.${floatValue}`;
        return;
    }

    if (!pad && floatValue == 0) {
        makePad = false
        decimal.innerText = '';
    }

    while (actualIntValue != intValue || actualFloatValue != floatValue) {
        await new Promise(resolve => setTimeout(resolve, 30));
        if (actualIntValue != intValue) {
            if (actualIntValue < intValue) {
                actualIntValue++
                int.textContent = actualIntValue;
            } else {
                actualIntValue--
                int.textContent = actualIntValue;
            }
        }

        if (actualFloatValue != floatValue && makePad) {
            if (actualFloatValue < floatValue) {
                actualFloatValue++
                decimal.textContent = `.${actualFloatValue.toString().padEnd(2, '0')}`;
            } else {
                actualFloatValue--
                decimal.textContent = `.${actualFloatValue.toString().padEnd(2, '0')}`;
            }
        }
    }
}

// inputs payment methods

const paymentInputsMethods = ['card', 'pix']
const paymentMethodsOptions = document.querySelectorAll('aside.methods aside.selector div.option');
const paymentMethodsInputs = document.querySelectorAll('aside.methods aside.selector div.option label input');
const paymentMethodsInputError = document.querySelector(`section#main aside.pay section.container form aside.methods p span.error`);
const paymentMethodsErrorContent = document.querySelector(`section#main aside.pay section.container form aside.methods p span.error span.content`);
let anyPaymentMethodInputIsChecked = false;
let selectedPaymentMethodInputIs;

paymentMethodsOptions.forEach(option => {
    let elem = option.classList.toString().toLocaleLowerCase();

    paymentInputsMethods.forEach(method => {
        let verify = elem.search(method);

        if (verify == -1) {
            return;
        }

        let getThisLabel = document.querySelector(`aside.methods aside.selector div.option.${method} label`);
        let getThisInput = document.querySelector(`aside.methods aside.selector div.option.${method} input`);

        getThisLabel.htmlFor = `${method}RadioInput`;
        getThisInput.id = `${method}RadioInput`;
        getThisInput.classList.add(method);
    })
})

paymentMethodsInputs.forEach(elem => {
    elem.addEventListener(("change"), () => {
        verifyChecked(elem, true)
    })
})

function verifyChecked(elem, mode) {
    paymentMethodsInputError.classList.remove('enabled')

    if (mode) {
        paymentMethodsInputs.forEach(elem => {
            elem.classList.remove('marked')
            selectedPaymentMethodInputIs = undefined;
            elem.checked = false;
        })

        anyPaymentMethodInputIsChecked = true;
        elem.classList.add('marked')
        selectedPaymentMethodInputIs = elem;
        elem.checked = true;
    }

    let inputClasses;
    let methodName;

    try {
        inputClasses = selectedPaymentMethodInputIs.classList.value;
    } catch(err) {
        paymentMethodsInputError.classList.add('enabled');
        paymentMethodsErrorContent.textContent = 'Nenhum método selecionado';
        inputClasses = false;
        return inputClasses;
    }

    paymentInputsMethods.forEach(method => {
        let verify = inputClasses.search(method);

        if (verify == -1) {
            return;
        }

        return methodName = method;
    })

    return methodName;
}

// Set country

let countries = [];

let userCountry;

const excludedRegions = [
    "Europe",
    "Asia",
    "Africa",
    "Oceania"
];

const excludedCountries = [
    "Bolivia",
    "Chile",
    "Colombia",
    "Ecuador",
    "Paraguay",
    "Peru",
    "Suriname",
    "Uruguay",
    "Venezuela"
];

let countriesByRegion = {
    SouthAmerica: [
        "Argentina", "Bolivia", "Brazil", "Chile", "Colombia",
        "Ecuador", "Paraguay", "Peru", "Suriname", "Uruguay", "Venezuela"
    ],

    NorthAmerica: [
        "United States", "Canada", "Mexico"
    ],

    Europe: [
        "United Kingdom", "Germany", "France", "Italy",
        "Spain", "Portugal", "Netherlands", "Sweden",
        "Norway", "Denmark"
    ],

    Asia: [
        "China", "Japan", "India", "South Korea", "Indonesia",
        "Saudi Arabia", "Turkey", "Thailand", "Vietnam", "Malaysia"
    ],

    Africa: [
        "Nigeria", "Egypt", "South Africa", "Kenya", "Morocco",
        "Ethiopia", "Ghana", "Algeria", "Uganda", "Tanzania"
    ],

    Oceania: [
        "Australia", "New Zealand", "Fiji", "Papua New Guinea",
        "Samoa", "Tonga", "Vanuatu", "Solomon Islands",
        "Micronesia", "Palau"
    ],

    Exit: ["exit"]
};

for (let region in countriesByRegion) {
    if (excludedRegions.includes(region)) {
        continue;
    }

    let countries = countriesByRegion[region].sort();

    countries.forEach(countryName => {
        if (excludedCountries.includes(countryName)) {
            return;
        }

        if (
            region === "SouthAmerica" ||
            region === "NorthAmerica" ||
            region === "Europe" ||
            region === "Asia" ||
            region === "Africa" ||
            region === "Oceania" ||
            region === "Exit"
        ) {
            add(countryName, region);
        } else {
            console.error(`The region "${region}" does not exist. Please check the region name and try again.`);
        }
    });
}

function add(value, region) {
    if (region === "Exit") {
        countries.sort()
        return;
    }

    countries.push(value.toLowerCase())
}
console.log(`selected countries:`)
console.log(countries)

fetch('https://get.geojs.io/v1/ip/country.json')
    .then(response => response.json())
    .then(json => {
        userCountry = json.name.toLowerCase();
        console.warn(json)
        verifyCountry()
    })
    .catch(error => {
        userCountry = 'brazil';
        console.warn('Erro ao tentar verificar país do usuário: ', error);
        console.warn('País padrao foi selecionado: ', userCountry)
    });

function verifyCountry() {
    if (countries.includes(userCountry)) {
        console.log('País do usuário:', userCountry);
        return;
    }

    userCountry = 'brazil';
    console.warn('País do usuário nao encontrado na lista país padrao selecionado:', userCountry);
}