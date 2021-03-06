import { expect }                       from 'chai';
import React                            from 'react';
import { isDigitContract, getDigitInfo} from '../digits';

describe('Digits', () => {
    describe('isDigitContract', () => {
        it('should return true if contract is digits', () => {
            expect(isDigitContract('DIGITMATCH')).to.eql(true);
        });

        it('should return false if contract is not digits', () => {
            expect(isDigitContract('CALLPUT')).to.eql(false);
        });
    });

    describe('getDigitInfo', () => {
        it('should return {} when entry_tick_time is not in contract_info', () => {
            const contract_info = {};
            expect(getDigitInfo({}, contract_info)).to.deep.eql({});
        });
        it('should return empty object if entry_tick_time and current_spot_time of contract are both in digits_info', () => {
            const contract_info = {
                entry_tick_time: 1544707342,
                entry_tick: 123,
                current_spot_time: 1544707344,
            };
            const digits_info = {
                1544707342: {
                    digit: 7,
                },
                1544707344: {
                    digit: 6,
                },
            };
            expect(getDigitInfo(digits_info, contract_info)).to.be.empty;
        });
        it('should return desired object with inputs and when current_spot_time is not in digits info', () => {
            const contract_info = {
                entry_tick_time: 1544707342,
                entry_tick: 123.99,
                current_spot_time: 10000000,
                current_spot: 456.99,
                exit_tick_time: 10000001,
                contract_type: 'DIGITMATCH',
                barrier: 9
            };
            const digits_info = {
                1544707342: {
                    digit: 7,
                    spot: 456.99,
                },
                1544707344: {
                    digit: 6,
                    spot: 456.99,
                },
            };
            expect(getDigitInfo(digits_info, contract_info)).to.deep.eql({
                10000000: {
                    digit: 9,
                    spot: 456.99,
                }
            });
        });
        it('should return desired object with inputs and when current_spot_time and entry_tick_time are not in digits info', () => {
            const contract_info = {
                entry_tick_time: 20000000,
                entry_tick: 123.77,
                current_spot_time: 10000000,
                current_spot: 456.99,
                exit_tick_time: 10000001,
                contract_type: 'DIGITMATCH',
                barrier: 8
            };
            const digits_info = {
                1544707342: {
                    digit: 7,
                },
                1544707344: {
                    digit: 6,
                },
            };
            expect(getDigitInfo(digits_info, contract_info)).to.deep.eql({
                10000000: {
                    digit: 9,
                    spot: 456.99,
                },
                20000000: {
                    digit: 7,
                    spot: 123.77,
                }
            });
        });
    });
});