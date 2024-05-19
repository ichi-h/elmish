export const renderer = (html: HTMLElement) => {
  document.getElementById("app")!.replaceWith(html);
};
