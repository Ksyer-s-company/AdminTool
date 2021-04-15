import layoutConfig from './layoutConfig';

// interfaces in TypeScript format

// collect data into groups with compare function key()
// interface { [groupKey]: node[] }
function getGroupDict(nodes, keyFn) {
  return nodes.reduce((acc, node) => {
    (acc[keyFn(node)] = acc[keyFn(node)] || []).push(node);
    return acc;
  }, {});
}

export function getLayoutOptions(cy, nodes, options) {
  const { verticalGap, horizontalGap } = layoutConfig;
  const { vertical } = options;
  // interface groupDict { [groupKey]: node[] }
  // interface groupList node[][]
  const groupDict = getGroupDict(nodes, (n) => n.data.level);
  const groupList = Object.keys(groupDict)
    .sort()
    .map((key) => groupDict[key]);
  // interface { axis: "x"|"y", left: cyNode, right: cyNode, gap: number}[]
  // nodes position along cross axis
  const groupInequalities = groupList.flatMap((nodes, i) =>
    nodes.slice(0, nodes.length - 1).map((node, i) => ({
      axis: vertical ? 'x' : 'y',
      left: cy.$id(node.data.id),
      right: cy.$id(nodes[i + 1].data.id),
      gap: vertical ? horizontalGap : verticalGap,
    }))
  );
  // interface { node: cyNode }[][]
  // nodes grouping along cross axis
  const alignmentListCrossAxis = groupList.map((nodes) =>
    nodes.map((node) => ({
      node: cy.$id(node.data.id),
    }))
  );
  // interface { node: cyNode, offset: number }[]
  // position of the first node in each group along main axis
  const alignmentMainAxis = groupList.map((nodes, i) => ({
    node: cy.$id(nodes[0].data.id),
    offset: i * (vertical ? verticalGap : horizontalGap),
  }));
  // get cross axis
  const crossAxis = vertical ? 'horizontal' : 'vertical';
  let result = {
    name: 'cola',
    animate: false,
    gapInequalities: groupInequalities,
    alignment: {
      [crossAxis]: [...alignmentListCrossAxis, alignmentMainAxis],
    },
  };
  return result;
}

export default getLayoutOptions;
