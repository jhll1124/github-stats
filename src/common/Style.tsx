/**
 * Global Style.
 * Collect styles declared everywhere, and render together in one <style> tag.
 * @module common/Style
 */

import * as JSX from '../common/jsx_extra.ts';

import { Component, Store } from 'nano-jsx';

const globalStyle = new Store([]);

/**
 * Add a style to the global style.
 */
const Style: JSX.FC<{ children: string }> = ({ children }) => {
  if (!globalStyle.state.includes(children))
    globalStyle.setState([...globalStyle.state, children]);
  return <></>;
};

export default Style;

/**
 * Gather all styles from the global style, and then render.
 */
export class RenderStyle extends Component {
  style = globalStyle.use();

  didMount() {
    this.style.subscribe(() => this.update());
  }

  didUnmount() {
    this.style.cancel();
  }

  render() {
    return <style>{this.style.state.join('\n')}</style>;
  }
}
