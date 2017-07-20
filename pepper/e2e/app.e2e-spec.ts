import { PepperPage } from './app.po';

describe('pepper App', () => {
  let page: PepperPage;

  beforeEach(() => {
    page = new PepperPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
