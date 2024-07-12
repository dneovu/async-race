export default abstract class {
  title: string;

  constructor() {
    this.title = '';
  }

  setTitle(title: string) {
    document.title = title;
  }

  async render(): Promise<HTMLElement> {
    return document.createElement('div');
  }
}
