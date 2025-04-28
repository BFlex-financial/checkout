let informationInputsContainer = document.querySelectorAll('section#main aside.pay section.container form aside.info aside');
let informationInputs = document.querySelectorAll('section#main aside.pay section.container form aside.info aside label input');
let informationInputsError = document.querySelectorAll('section#main aside.pay section.container form aside.info aside label p span.error');
let submitError = document.querySelector('section#main aside.pay section.container form aside.submit aside.error p');

informationInputsContainer.forEach(elem => {
    const classes = Array.from(elem.classList).join('.');
    const informationInputError = document.querySelector(`section#main aside.pay section.container form aside.info aside.${classes} label p span.error`);
    if (informationInputError) {
        informationInputError.classList.add(...elem.classList);
    }
});

function verifyInformationInputs(isSubmit, error) {
    if(isSubmit) {
        let elem = submitError;
        const errorContent = elem.querySelector('span.content');
        elem.classList.add('enabled');
        errorContent.textContent = 'O campo não pode estar vazio';
        clearErrors();
        return;
    }

    let isValid = true;

    informationInputsError.forEach(elem => {
        const paymentMethod = Array.from(elem.classList).find(c => c !== 'error');
        const errorContent = elem.querySelector('span.content');
        const input = elem.closest('aside').querySelector('input');
        
        elem.classList.remove('enabled');
        
        const value = input.value.trim();
        
        if (value === '') {
            elem.classList.add('enabled');
            errorContent.textContent = 'O campo não pode estar vazio';
            isValid = false;
            return
        } else if (value.length < 5) {
            elem.classList.add('enabled');
            errorContent.textContent = 'Deve conter pelo menos 5 caracteres';
            isValid = false;
            return
        }
        
        if (paymentMethod === 'name' && !/^[a-zA-ZÀ-ú\s]+$/.test(value)) {
            elem.classList.add('enabled');
            errorContent.textContent = 'Nome deve conter apenas letras';
            isValid = false;
            return
        } else if (paymentMethod === 'mail') {
            if (value.indexOf('@') === -1) {
                elem.classList.add('enabled');
                errorContent.textContent = 'O email deve conter o símbolo @';
                isValid = false;
                return
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                elem.classList.add('enabled');
                errorContent.textContent = 'Formato inválido (exemplo: nome@provedor.com)';
                isValid = false;
                return
            }
        }
    });

    return isValid;
}

function clearErrors() {
    informationInputsError.forEach(elem => {
        const errorContent = elem.querySelector('span.content');
        elem.classList.remove('enabled');
        if (errorContent) {
            errorContent.textContent = '';
        }
    });
}