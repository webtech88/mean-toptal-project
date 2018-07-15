import { browser, by, element } from 'protractor';
import { UsersPage } from './users.po';
import { AppPage } from '../app.po';

describe('Users Page', () => {
  let page: UsersPage;
  let appPage: AppPage;
  let user: any;

  beforeEach(() => {
    page = new UsersPage();
    appPage = new AppPage();
    this.user = {
        first_name: appPage.getRandomString(5),
        last_name: appPage.getRandomString(5),
        email: appPage.getRandomEmail(),
        password: '123456789',
        confirm_password: '123456789',
        role: 'user'
    }
  });

  it('should render Users page and display name of table as Users', () => {
    browser.get('/login');
    appPage.goLogin().then(() => {
        browser.waitForAngular();
        page.navigateTo();
        expect(page.getUsersTitle()).toEqual("Users");
    });    
  });

  it('should add new user and display added user in list', () => {
    element(by.cssContainingText('a', 'Add User')).click().then(() => {
        browser.waitForAngular();
        expect(browser.driver.getCurrentUrl()).toMatch('/users/new');
        expect(element(by.css('.create-user-form h2')).getText()).toEqual('New User');

        appPage.sendValuetoForm('first_name', this.user.first_name);
        appPage.sendValuetoForm('last_name', this.user.last_name);
        appPage.sendValuetoForm('email', this.user.email);
        appPage.sendValuetoForm('password', this.user.password);
        appPage.sendValuetoForm('confirm_password', this.user.confirm_password);
        element(by.name('role')).element(by.cssContainingText('option', this.user.role)).click();

        element(by.buttonText('Save')).click().then(() => {
            browser.waitForAngular();
            expect(browser.driver.getCurrentUrl()).toMatch('/users');
            expect(page.getLastRowData()).toContain(this.user.first_name);
        });
    });
  });

  it('should reset the password', () => {
    const lastEl = element.all(by.tagName('tr')).last();
    lastEl.element(by.css('.fa-key')).click().then(() => {
        browser.waitForAngular();
        expect(element(by.css('.reset-user-form h2')).getText()).toEqual('Reset Password');

        appPage.sendValuetoForm('password', this.user.password);
        appPage.sendValuetoForm('confirm_password', this.user.confirm_password);

        element(by.buttonText('Save')).click().then(() => {
            browser.waitForAngular();
            expect(browser.driver.getCurrentUrl()).toMatch('/users');
        });
    });
  });

  it('should edit the user', () => {
    const lastEl = element.all(by.tagName('tr')).last();
    lastEl.element(by.css('.fa-pencil')).click().then(() => {
        browser.waitForAngular();
        expect(element(by.css('.create-user-form h2')).getText()).toEqual('Edit User');
        
        appPage.sendValuetoForm('first_name', '-test');

        element(by.buttonText('Save')).click().then(() => {
            browser.waitForAngular();
            expect(browser.driver.getCurrentUrl()).toMatch('/users');
            expect(lastEl.all(by.tagName('td')).get(1).getText()).not.toEqual(this.user.first_name);
        });
    });
  });

  it('should delete the user', () => {
    const lastEl = element.all(by.tagName('tr')).last();
    
    lastEl.element(by.css('.fa-trash')).click()
    const alertDialog = browser.switchTo().alert();
    expect(alertDialog.accept).toBeDefined();
    alertDialog.accept().then(() => {
        browser.waitForAngular();
        expect(lastEl.all(by.tagName('td')).get(1).getText()).not.toEqual(this.user.first_name+'-test');

        lastEl.element(by.css('.fa-trash')).click()
        const alertDialog = browser.switchTo().alert();
        expect(alertDialog.accept).toBeDefined();
        alertDialog.accept().then(() => {
            browser.waitForAngular();
            expect(lastEl.all(by.tagName('td')).get(1).getText()).not.toEqual(this.user.first_name+'-test');
        });
    });
  });
});
