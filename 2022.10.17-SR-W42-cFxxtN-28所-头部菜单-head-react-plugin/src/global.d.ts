interface Window {
  token: object
  CUSTOM_PLUGIN: Map<string, (dom: HTMLElement, props: object) => void>
}
