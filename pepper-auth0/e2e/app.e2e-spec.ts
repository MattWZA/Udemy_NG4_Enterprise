import { PepperAuth0Page } from './app.po';

describe('pepper-auth0 App', () => {
  let page: PepperAuth0Page;

  beforeEach(() => {
    page = new PepperAuth0Page();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
