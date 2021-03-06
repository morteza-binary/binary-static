import { expect }  from 'chai';
import { mount }   from 'enzyme';
import React       from 'react';
import VerticalTab from '../vertical-tab.jsx';

describe('<VerticalTab />', () => {
    const valid_tab_items = [
        {
            icon: () => <svg />,
            label: 'Label 1',
            value: () => <svg />
        },
        {
            icon: () => <svg />,
            label: 'Label 2',
            value: () => <svg />
        }
    ];
    it('should render single div', () => {
        const wrapper = mount(<VerticalTab list={valid_tab_items}
        />);
        expect(wrapper.find('div.vertical-tab').length).to.be.equal(1);
    });

    it('should switch between open tabs', () => {
        const wrapper = mount(<VerticalTab list={valid_tab_items} />);
        expect(wrapper.find('div.vertical-tab__content').length).to.be.equal(1);
        expect(wrapper.find('div.vertical-tab__header').length).to.be.equal(2);
    })
});
