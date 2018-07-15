import { browser, by, element } from 'protractor';
import { DashboardPage } from './dashboard.po';
import { AppPage } from '../app.po';

describe('Dashboard Page', () => {
  let page: DashboardPage;
  let appPage: AppPage;

  beforeEach(() => {
    page = new DashboardPage();
    appPage = new AppPage();
  });

  it('should render dashboard page and display name of table as Timezones', () => {
    page.navigateTo();
    appPage.goLogin().then(() => {
        browser.waitForAngular();
        expect(browser.driver.getCurrentUrl()).toMatch('/dashboard');
        expect(page.getDashboardTitle()).toEqual("Timezones");
    });    
  });

  it('should display timezone list', () => {
    expect(page.getTableHeader()).toContain("Name City Timezone Difference To GMT Current Time");
  });
});
