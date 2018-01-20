
const expect = require('chai').expect;
const Page = require('../lib/page');

describe('Page', () => {

  it('validates when constructed', () => {
    const noName = () => new Page({});
    const noRender = () => new Page({name: 'a'});

    const nameNotString = () => new Page({name: 123, render: () => {}});
    const renderNotFn = () => new Page({name: 'a', render: 123});

    expect(noName).to.throw();
    expect(noRender).to.throw();
    expect(nameNotString).to.throw();
    expect(renderNotFn).to.throw();
  });

});

