import format from 'xml-formatter';

export default function formatSvg(svg: string) {
  return format(svg, {
    lineSeparator: '\n',
    collapseContent: true,
  });
}
