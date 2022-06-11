/**
 * Extra Types for JSX.
 * @module common/jsx-extra
 */

// deno-lint-ignore no-empty-interface
export interface Element {}

type Props<P> = {
  children?: Element | Element[];
} & P;

export interface FC<P = Record<never, never>> {
  (props: Props<P>): Element;
}
