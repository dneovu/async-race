type Element = {
  id?: string;
  class?: string;
  text?: string;
};

export default function createElement(elementName: string, props: Element = {}): HTMLElement {
  const elem = document.createElement(elementName);
  if (props.id) elem.id = props.id;
  if (props.class) elem.className = props.class;
  if (props.text) elem.innerText = props.text;
  return elem;
}
