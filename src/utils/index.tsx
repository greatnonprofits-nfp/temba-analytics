/**
 * Should x element be rendered?
 */
export const renderIf = (predicate: boolean) => (then: JSX.Element, otherwise?: JSX.Element) =>
  predicate ? then : otherwise ? otherwise : null;

/** Get the value for a named cookie */
export const getCookie = (name: string): string|null => {
  for (const cookie of document.cookie.split(';')) {
    const idx = cookie.indexOf('=');
    let key = cookie.substr(0, idx);
    let value = cookie.substr(idx + 1);

    // no spaces allowed
    key = key.trim();
    value = value.trim();

    if (key === name) {
      return value;
    }
  }
  return null;
};

