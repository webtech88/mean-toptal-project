import { browser, by, element } from 'protractor';

export class RegisterPage {
  navigateTo() {
    return browser.get('/login');
  }

  getRegisterFormTitle() {
    return element(by.css('.register-form h2')).getText();
  }
}
