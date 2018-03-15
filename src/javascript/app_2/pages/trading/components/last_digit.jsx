import React from 'react';
import Dropdown from './form/dropdown.jsx';
import { FieldHeader } from './elements/field_headers.jsx';
import { connect } from '../store/connect';
import { localize } from '../../../../_common/localize';

const last_digit_numbers = [...Array(10).keys()].map(number => ({
    text : number,
    value: number,
}));

const LastDigit = ({
    last_digit,
    onChange,
}) =>  (
    <fieldset>
        <FieldHeader
            header={localize('Last Digit Prediction')}
            icon='digits'
            tooltip={localize('Text for Last Digits goes here.')}
        />
        <Dropdown
            list={last_digit_numbers}
            value={last_digit}
            name='last_digit'
            onChange={onChange}
        />
    </fieldset>
);

export default connect(
    ({trade}) => ({
        last_digit: trade.last_digit,
        onChange  : trade.handleChange,
    })
)(LastDigit);
