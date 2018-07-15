import { browser, by, element } from 'protractor';

export class LoginPage {
  navigateTo() {
    return browser.get('/login');
  }

  getLoginFormTitle() {
    return element(by.css('.login-form h2')).getText();
  }
}
