import puppeteer, { Browser, BrowserContext, Page } from "puppeteer";
import NodeEnvironment from "jest-environment-node";

// Template class taken from Jest docs: https://jestjs.io/docs/puppeteer
class PuppeteerEnvironment extends NodeEnvironment {
  constructor(config: any, _context: any) {
    super(config, _context);
  }

  async setup() {
    await super.setup();

    const browser = await puppeteer.launch({
      // headless: false,
    });
    const incognito = await browser.createIncognitoBrowserContext();
    this.global.baseUrl = "http://localhost:3000";
    this.global.browser = incognito.browser();
    this.global.incognito = incognito;
    this.global.page = await incognito.newPage();
  }

  async teardown() {
    this.global.incognito?.close();
    this.global.browser?.close();
    await super.teardown();
  }
}

module.exports = PuppeteerEnvironment;

declare global {
  var baseUrl: string;
  var page: Page;
  var incognito: BrowserContext;
  var browser: Browser;
}
