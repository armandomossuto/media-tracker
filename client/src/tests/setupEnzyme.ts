
const myGlobal: any = global;

import * as Enzyme from 'enzyme';

import * as Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

myGlobal.fetch = require('node-fetch');
