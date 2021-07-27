/**
 * Should x element be rendered?
 */
export const renderIf = (predicate: boolean) => (then: JSX.Element, otherwise?: JSX.Element) =>
  predicate ? then : otherwise ? otherwise : null;

