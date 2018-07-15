import { browser, by, element, promise, ElementFinder, ElementArrayFinder } from 'protractor';

export class UsersPage {
  navigateTo() {
    return browser.get('/users');
  }

  getUsersTitle() {
    return element(by.css('h2')).getText();
  }
	
	getUserTable():ElementFinder {
		return element(by.css('.users'));
	}

  getTableHeader(): promise.Promise<string> {
    return this.getUserTable().all(by.tagName('tr')).get(0).getText();
	}
	
	/*Table Data */ 
	getTable():ElementFinder {
		return this.getTable().element(by.css('table'));
	}

	getTableRow(): ElementArrayFinder {
		return this.getUserTable().all(by.tagName('tr'));
	}

	getFirstRowData(): promise.Promise<string> {
			return this.getTableRow().get(1).getText();
	}

	getLastRowData(): promise.Promise<string> {
			return this.getTableRow().last().getText();
	}

}
