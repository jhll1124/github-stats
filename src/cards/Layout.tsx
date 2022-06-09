import * as JSX from '../common/jsx_extra.ts';

export const FlexLayout: JSX.FC<{
  gap: number;
  direction: 'horizon' | 'vertical';
  sizes?: number[];
}> = ({ gap, direction, sizes = [], children }) => {
  const items = children instanceof Array ? children : [children];
  let size = 0;
  return (
    <>
      {items.filter(Boolean).map((item, i) => {
        const transform =
          direction === 'horizon'
            ? `translate(${size}, 0)`
            : `translate(0, ${size})`;
        size += sizes[i] ?? 0 + gap;
        return (
          <g key={i} transform={transform}>
            {item}
          </g>
        );
      })}
    </>
  );
};
