/**
 * Global Style.
 * Collect styles declared everywhere, and render together in one <style> tag.
 * @module common/Style
 */

import * as JSX from '../common/jsx-extra.ts';

export const globalStyle: string[] = [];

/**
 * Add a style to the global style.
 */
const Style: JSX.FC<{ children: string }> = ({ children }) => {
  if (!globalStyle.includes(children)) globalStyle.push(children);
  return <></>;
};

export default Style;
