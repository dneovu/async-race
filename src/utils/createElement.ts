type ElementProps = {
  id?: string;
  class?: string;
  text?: string;
  type?: string;
};

export default function createElement(elementName: string, props: ElementProps = {}): HTMLElement {
  const elem = document.createElement(elementName);
  if (props.id) elem.id = props.id;
  if (props.class) elem.className = props.class;
  if (props.text) elem.innerText = props.text;
  if ((elementName === 'input' || elementName === 'button') && props.type) {
    (elem as HTMLInputElement | HTMLButtonElement).type = props.type;
  }
  return elem;
}
