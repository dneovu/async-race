export default abstract class {
  setTitle(title: string) {
    document.title = title;
  }

  async render(): Promise<HTMLElement> {
    return document.createElement('div');
  }
}
