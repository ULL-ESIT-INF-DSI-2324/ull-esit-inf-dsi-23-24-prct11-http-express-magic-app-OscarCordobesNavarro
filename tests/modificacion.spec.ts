import 'mocha';
import {expect} from 'chai';

// Ejemplo de tests promesas
// import {weatherInfoPromises} from '../src/asyncFunctionsPromises.js';

// describe('Asynchronous function weatherInfoPromises tests', () => {
//   it('weatherInfoPromises should get weather information', () => {
//     return weatherInfoPromises('Tenerife, Spain').then((data) => {
//       expect(data.body.location.name).to.be.equal('Tenerife');
//     });
//   });

//   it('weatherInfoPromises should provide an error', () => {
//     return weatherInfoPromises('12wherever').catch((err) => {
//       expect(err).to.be.equal('request_failed');
//     });
//   });
// });