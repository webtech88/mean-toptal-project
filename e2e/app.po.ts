import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root .navbar-brand')).getText();
  }

  getElementByName(name: string) {
    return element(by.name(name));
  }

  sendValuetoForm(name: string, val: string) {
    element(by.name(name)).sendKeys(val);
  }

  clickButton(buttonText: string) {
    element(by.buttonText(buttonText)).click();
  }

  getRandomEmail() {
    let strValues = "abcdefghijk123456789";
    let strEmail = "";
    for (let i = 0; i < strValues.length; i++) {
      strEmail = strEmail + strValues.charAt(Math.round(strValues.length * Math.random()));
    }
    return strEmail + "@piao.test";
  }

  getRandomString(characterLength) {
    let randomText = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < characterLength; i++) {
      randomText += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return randomText;
  }

  getRandomNumber(numberLength) {
    let randomNumber = "";
    let possible = "0123456789";
    for (let i = 0; i < numberLength; i++) {
      randomNumber += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return randomNumber;
  }


  goLogin() {
    this.sendValuetoForm('email', 'admin@piao.com');
    this.sendValuetoForm('password', '123456789');

    return element(by.buttonText('Login')).click();
  }

  goLogout() {
    let dropdown = element(by.css('li[dropdown]'));
    dropdown.element(by.id('dropdownMenu')).click();
    return dropdown.element(by.id('logOut')).click();
  }
}
