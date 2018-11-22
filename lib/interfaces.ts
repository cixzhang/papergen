import Page from './page';

export interface BookletPage {
  module: Page,
  options: any,
}

export interface BookletOptions {
  output: string,
  debug: boolean,
}