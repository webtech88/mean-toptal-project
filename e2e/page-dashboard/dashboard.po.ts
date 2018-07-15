import { browser, by, element, promise, ElementFinder, ElementArrayFinder } from 'protractor';

export class DashboardPage {
  navigateTo() {
    return browser.get('/login');
  }

  getDashboardTitle() {
    return element(by.css('h2')).getText();
	}
	
	getTimezoneTable():ElementFinder {
		return element(by.css('.timezone'));
	}

  getTableHeader(): promise.Promise<string> {
    return this.getTimezoneTable().all(by.tagName('tr')).get(0).getText();
	}
	
	/*Table Data */ 
	getTable():ElementFinder {
		return this.getTable().element(by.css('table'));
	}

	getTableRow(): ElementArrayFinder {
		return this.getTimezoneTable().all(by.tagName('tr'));
	}

	getFirstRowData(): promise.Promise<string> {
			return this.getTableRow().get(1).getText();
	}

	getLastRowData(): promise.Promise<string> {
			return this.getTableRow().last().getText();
	}

}
