import { validateEmail } from './index';

it('validateEmail', () => {
    expect(validateEmail('aSADSAD')).toEqual(false);
    expect(validateEmail(null)).toEqual(false);
    expect(validateEmail('asds.adssds@adsds.asdsd')).toEqual(true);
    expect(validateEmail('asds.adssds@adsds')).toEqual(false);
    expect(validateEmail('asds@adsds.sdfsdf')).toEqual(true);
    expect(validateEmail('asds+2323@adsds.sdfsdf')).toEqual(true);
    expect(validateEmail('@adsds.sdfsdf')).toEqual(false);
});
