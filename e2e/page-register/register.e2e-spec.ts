import { browser, by, element } from 'protractor';
import { RegisterPage } from './register.po';
import { AppPage } from '../app.po';

describe('Register Page', () => {
  let page: RegisterPage;
  let appPage: AppPage;

  beforeEach(() => {
    page = new RegisterPage();
    appPage = new AppPage();
  });

  it('should render register page and display name of form as Register', () => {
    page.navigateTo();
    element(by.cssContainingText('a', 'Register')).click();
    expect(page.getRegisterFormTitle()).toEqual("Register");
  });

  it('should go login page if the user click cancel button', () => {
    element(by.cssContainingText('a', 'Cancel')).click().then(() => {
        browser.waitForAngular();
        expect(browser.driver.getCurrentUrl()).toMatch('/login');
    });
  });

  it('should register some infos', () => {
    page.navigateTo();
    element(by.cssContainingText('a', 'Register')).click();

    appPage.sendValuetoForm('first_name', appPage.getRandomString(5));
    appPage.sendValuetoForm('last_name', appPage.getRandomString(5));
    appPage.sendValuetoForm('email', appPage.getRandomEmail());
    appPage.sendValuetoForm('password', '123456789');
    appPage.sendValuetoForm('confirm_password', '123456789');

    element(by.buttonText('Register')).click().then(() => {
        browser.waitForAngular();
        expect(browser.driver.getCurrentUrl()).toMatch('/login');
    });
  });
});
