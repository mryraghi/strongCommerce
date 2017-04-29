import { StrongCommercePage } from './app.po';

describe('strong-commerce App', function() {
  let page: StrongCommercePage;

  beforeEach(() => {
    page = new StrongCommercePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
