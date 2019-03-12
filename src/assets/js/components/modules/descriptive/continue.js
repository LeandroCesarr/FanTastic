import doT from 'dot'; // eslint-disable-line
import Chart from 'chart.js';
import Order from '../common/order';
import Moda from '../common/moda';

class Continue {
  constructor(vet, name) {
    this.vet = vet;
    this.dataModa = [];
    this.At = null;
    this.k = [];
    this.result = null;
    this.intervalNumber = null;
    this.name = name;
    this.simpleFrequencyPercentage = [];
    this.accumulatedFrequncy = [];
    this.accumulatedFrequncyPercentage = [];
    this.dynamicTable = [];
    this.canvasHolder = document.querySelector('[data-canvas]');
    this.continueTemplate = doT.template('<table style="text-align:center" border="1"><tr><th>Classes</th><th>{{=it.name}}</th><th>Frequenca Simples</th><th>Frequenca Relativa</th><th>Frequenca Acumulada</th><th>Frequenca Acumulada %</th></tr>{{~it.dynamicTable :value:index}}<tr><td>{{=value.class}}</td><td>{{=value.valorInicial}} - {{=value.valorFinal}}</td><td>{{=value.cont}}</td><td>{{=value.fr}}</td><td>{{=value.fa}}</td><td>{{=value.fac}}</td></tr>{{~}}</table>');
    this.continueResult = '';
    this.vetInterval = [];
    this.setup();
  }

  setup() {
    this.oraganizedArray();
    this.amplitude();
    this.classes();
    this.valueInterval();
    this.createModa();
    this.interval();
    this.generateFrequency();
    this.media();
    this.moda();
    this.mediana();
    this.createTable();
    this.createChart();
  }

  oraganizedArray() {
    this.vet = Order.create(this.vet, 'crescent').getResult();
  }

  amplitude() {
    this.At = this.vet[this.vet.length - 1] - this.vet[0];
  }

  classes() {
    this.K = [parseInt(Math.sqrt(this.vet.length))-1,parseInt(Math.sqrt(this.vet.length)),parseInt(Math.sqrt(this.vet.length))+1]; // eslint-disable-line
  }

  valueInterval() {
    let D = this.At + 1;
    let i = 0;
    while (i === 0) {
      for (let j = 0; j < 3; j += 1) {
        if (D % this.K[j] === 0) {
          this.intervalNumber = D / this.K[j];
          i += 1;
          break;
        }
      }
      D += 1;
    }
  }

  createModa() {
    let x = this.vet[0];
    let y = null;
    while (x <= this.vet[this.vet.length - 1]) {
      y = x + this.intervalNumber;
      for (let i = 0; i < this.vet.length; i += 1) {
        if ((this.vet[i] >= x) && (this.vet[i] < y)) {
          this.dataModa = Moda.create(this.vet).getResult();
        }
      }
      x += this.intervalNumber;
    }
  }

  interval() {
    let valorInicial = this.dataModa[0].number;
    let cont = this.dataModa[0].cont;
    let valorFinal = valorInicial + this.intervalNumber;

    for (let i = 1; i < this.dataModa.length; i += 1) {
      if (this.dataModa[i].number >= valorFinal) {
        const obj = new Object(); // eslint-disable-line
        obj.valorInicial = valorInicial;
        obj.valorFinal = valorFinal;
        obj.cont = cont;
        this.vetInterval.push(obj);
        valorInicial = valorFinal;
        valorFinal = valorInicial + this.intervalNumber;
        cont = this.dataModa[i].cont;
      } else if (this.dataModa[i].number < valorFinal) {
        cont += this.dataModa[i].cont;
      }
    }
    const obj = new Object(); // eslint-disable-line
    obj.valorInicial = valorInicial;
    obj.valorFinal = valorFinal;
    obj.cont = cont;
    this.vetInterval.push(obj);
  }

  generateFrequency() {
    let cont = 0;

    for (let i = 0; i < this.vetInterval.length; i += 1) {
      this.simpleFrequencyPercentage[i] = ((this.vetInterval[i].cont / this.vet.length) * 100).toFixed(2); // eslint-disable-line
      this.accumulatedFrequncy[i] = this.vetInterval[i].cont + cont;
      this.accumulatedFrequncyPercentage[i] = ((this.accumulatedFrequncy[i] / this.vet.length) * 100).toFixed(2); // eslint-disable-line
      cont = this.vetInterval[i].cont + cont;
    }
  }

  media() {
    let mediaparcial = null;
    for (let i = 0; i < this.vetInterval.length; i += 1) {
      mediaparcial += ((this.vetInterval[i].valorFinal + this.vetInterval[i].valorInicial) / 2) * this.vetInterval[i].cont; // eslint-disable-line
    }

    const media = mediaparcial / this.vet.length;
    console.log (media); //eslint-disable-line
  }

  moda() {
    let maior = null;
    let posicao = null;
    for (let i = 0; i < this.vetInterval.length; i += 1) {
      if (this.vetInterval[i].cont > maior) {
        maior = this.vetInterval[i].cont;
        posicao = i;
      }
    }
    const moda = (this.vetInterval[posicao].valorFinal + this.vetInterval[posicao].valorInicial) / 2; // eslint-disable-line
  }

  mediana() {
    const posicao = this.vet.length / 2;
    let I = null;
    let find = null;
    let facAnt = null;
    for (let i = 0; i < this.vet.length; i += 1) {
      if (posicao == i) { // eslint-disable-line
        const aux = this.vet[i];
        for (let j = 0; j < this.vetInterval.length; j += 1) {
          if ((aux >= this.vetInterval[j].valorInicial) && (aux < this.vetInterval[j].valorFinal)) {
            I = this.vetInterval[j].valorInicial;
            find = this.vetInterval[j].cont;
            if (j - 1 < 0) {
              facAnt = 0;
            } else {
              facAnt = this.vetInterval[j - 1].cont;
            }
          }
        }
      }
    }
    const mediana = (I + ((posicao - facAnt) / find) * this.intervalNumber).toFixed(3); //eslint-disable-line
    console.log(mediana); //eslint-disable-line
  }

  createTable() {
    for (let i = 0; i < this.vetInterval.length; i += 1) {
      const obj = {
        class: i + 1,
        valorInicial: this.vetInterval[i].valorInicial,
        valorFinal: this.vetInterval[i].valorFinal,
        cont: this.vetInterval[i].cont,
        fr: this.simpleFrequencyPercentage[i],
        fa: this.accumulatedFrequncy[i],
        fac: this.accumulatedFrequncyPercentage[i],
      };

      this.dynamicTable.push(obj);
    }

    this.continueResult = this.continueTemplate({ name: this.name, dynamicTable: this.dynamicTable }); // eslint-disable-line
  }

  createChart() {
    const labelsName = [];
    const canvas = document.createElement('canvas');
    this.canvasHolder.innerHTML = '';

    this.vetInterval.forEach((obj, index) => { labelsName[index] = `de ${obj.valorInicial} até ${obj.valorFinal}`; });

    const continueChart = new Chart(canvas, { // eslint-disable-line
      type: 'bar',
      data: {
        labels: labelsName,
        datasets: [{
          label: '',
          data: this.simpleFrequencyPercentage,
        }],
      },
    });

    this.canvasHolder.appendChild(canvas);
  }

  getResult() {
    return this.continueResult;
  }
}


export default{
  create(vet, name) {
    return new Continue(vet, name);
  },
};

export const Class = Continue;
