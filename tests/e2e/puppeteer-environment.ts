import puppeteer, { Browser, Page } from "puppeteer";
import NodeEnvironment from "jest-environment-node";

// Template class taken from Jest docs: https://jestjs.io/docs/puppeteer
class PuppeteerEnvironment extends NodeEnvironment {
  constructor(config: any) {
    super(config);
  }

  async setup() {
    await super.setup();

    const browser = await puppeteer.launch({
      // headless: false,
    });
    this.global.baseUrl = "http://localhost:3000";
    this.global.browser = browser;
    this.global.page = (await browser.pages())[0];
  }

  async teardown() {
    this.global.page?.close();
    this.global.browser?.close();
    this.global.server?.destroy();
    await super.teardown();
  }
}

module.exports = PuppeteerEnvironment;

declare global {
  var baseUrl: string;
  var page: Page;
  var browser: Browser;
}
