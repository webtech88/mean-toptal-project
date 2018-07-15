import { browser, by, element } from 'protractor';
import { LoginPage } from './login.po';
import { AppPage } from '../app.po';

describe('Login Page', () => {
  let page: LoginPage;
  let appPage: AppPage;

  beforeEach(() => {
    page = new LoginPage();
    appPage = new AppPage();
  });

  it('should render login page and display name of form as Login', () => {
    page.navigateTo();
    expect(page.getLoginFormTitle()).toEqual("Login");
  });

  it('should login with admin account', () => {
    page.navigateTo();
    appPage.sendValuetoForm('email', 'admin@piao.com');
    appPage.sendValuetoForm('password', '123456789');

    expect(appPage.getElementByName('email').getAttribute('value')).toEqual('admin@piao.com');
    expect(appPage.getElementByName('password').getAttribute('value')).toEqual('123456789');

    element(by.buttonText('Login')).click().then(() => {
        browser.waitForAngular();
        expect(browser.driver.getCurrentUrl()).toMatch('/dashboard');
    });    
  });

});
