import format from 'xml-formatter';

export default function optimize(svg: string) {
  return format(svg, {
    lineSeparator: '\n',
    collapseContent: true,
  });
}
