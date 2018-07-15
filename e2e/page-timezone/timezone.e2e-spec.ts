import { browser, by, element } from 'protractor';
import { TimezonePage } from './timezone.po';
import { AppPage } from '../app.po';

describe('Timezone Page', () => {
  let page: TimezonePage;
  let appPage: AppPage;
  let timezone: any;

  beforeEach(() => {
    page = new TimezonePage();
    appPage = new AppPage();
    this.timezone = {
        name: 'test',
        city: 'test'
    }
  });

  it('should render Timezones page and display name of table as Timezones', () => {
    appPage.goLogin().then(() => {
        browser.waitForAngular();
        page.navigateTo();
        expect(page.getTimezoneTitle()).toEqual("Timezones");
    });    
  });

  it('should add new timezone and display added timezone in list', () => {
    element(by.cssContainingText('a', 'Add Timezone')).click().then(() => {
        browser.waitForAngular();
        expect(browser.driver.getCurrentUrl()).toMatch('/timezones/new');
        expect(element(by.css('.create-timezone-form h2')).getText()).toEqual('New Timezone');

        element(by.cssContainingText('a', 'Cancel')).click().then(() => {
            browser.waitForAngular();
            expect(browser.driver.getCurrentUrl()).toMatch('/timezones');
        });
    });
  });

  it('should edit the timezone', () => {
  });

  it('should delete the timezone', () => {
  });
});
