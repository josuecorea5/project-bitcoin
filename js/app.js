const cryptocurrenciesSelect = document.querySelector('#criptomonedas');
const currencySelect = document.querySelector('#moneda');
const form = document.querySelector('#formulario');
const resultQuotation = document.querySelector('#resultado');

const objSearch = {
  moneda: '',
  criptomoneda: ''
}


const getCryptocurrencies = cryptocurrency => new Promise(resolve => {
  resolve(cryptocurrency);
})
document.addEventListener('DOMContentLoaded', () => {
  consultCryptocurrencies();
  form.addEventListener('submit',sendForm);
  cryptocurrenciesSelect.addEventListener('change', readValue);
  currencySelect.addEventListener('change', readValue);
})

function consultCryptocurrencies() {
  const URL = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

  fetch(URL)
    .then(response => response.json())
    .then(data => getCryptocurrencies(data.Data))
    .then(cryptocurrencies => selectCryptocurrencies(cryptocurrencies))
    .catch(error => console.log(error))
}

function selectCryptocurrencies(cryptocurrency) {
  cryptocurrency.forEach(crypto => {
    const { FullName, Name } = crypto.CoinInfo;
    const option = document.createElement('option');
    option.value = Name;
    option.textContent = FullName; 
    cryptocurrenciesSelect.appendChild(option);
  });
}

function readValue(e) {
  objSearch[e.target.name] = e.target.value;
}

function sendForm(e) {
  e.preventDefault()
  const { moneda, criptomoneda } = objSearch;
  if(moneda === '' || criptomoneda === '') {
    showAlert('Ambos campos son obligatorios');
    return;
  }
  consultAPI();
}

function showAlert(message) {
  const existError = document.querySelector('.error');
  if(!existError) {
    const divMessage = document.createElement('div');
  
    divMessage.classList.add('error');
    divMessage.textContent = message;
    form.appendChild(divMessage);
  
    setTimeout(() => {
      divMessage.remove();
    }, 3000);
  }
}

function consultAPI() {
  const { moneda, criptomoneda } = objSearch;
  const URL = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  showSpinner();

  fetch(URL)
    .then(response => response.json())
    .then(data => showQuotationHTML(data.DISPLAY[criptomoneda][moneda]))
}

function showQuotationHTML(quotation) {
  cleanHTML();
  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = quotation;
  const price = document.createElement('p');
  price.classList.add('precio');
  price.innerHTML = `El precio es: <span>${PRICE}</span>`;

  const highDay = document.createElement('p');
  highDay.innerHTML = `<p>Precion más alto: <span>${HIGHDAY}</span></p>`;

  const lowDay = document.createElement('p');
  lowDay.innerHTML = `<p>Precion más bajo: <span>${LOWDAY}</span></p>`;

  const change24Hour = document.createElement('p');
  change24Hour.innerHTML = `<p>Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p>`;

  const lastUpdate = document.createElement('p');
  lastUpdate.innerHTML = `<p>Última actualización: <span>${LASTUPDATE}</span></p>`;

  resultQuotation.appendChild(price);
  resultQuotation.appendChild(highDay);
  resultQuotation.appendChild(lowDay);
  resultQuotation.appendChild(change24Hour);
  resultQuotation.appendChild(lastUpdate);
}

function cleanHTML() {
  while(resultQuotation.firstChild){
    resultQuotation.removeChild(resultQuotation.firstChild)
  }
}

function showSpinner() {
  form.reset();
  cleanHTML();
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');

  spinner.innerHTML = `
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  `;
  resultQuotation.appendChild(spinner);
}