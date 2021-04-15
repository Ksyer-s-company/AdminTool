import layoutConfig from './layoutConfig';

function mergeStyle(base, userStyles) {
  if (!userStyles) return base;
  base.forEach((item) =>
    userStyles
      .filter((userItem) => userItem.selector === item.selector)
      .forEach((userItem) => Object.assign(item.style, userItem.style))
  );
  return base;
}

export const getStyle = (options) => {
  const { nodeHeight, nodeWidth, palette } = layoutConfig;
  const { vertical, style: customStyle } = options;
  // base style sheet for the graph
  const baseStyle = [
    {
      selector: 'node',
      style: {
        label: 'data(name)',
        shape: 'round-rectangle',
        width: nodeWidth,
        height: nodeHeight,
        'background-color': 'white',
        // 'background-opacity': 0.5,
        'text-valign': 'center',
        'text-wrap': 'wrap',
        'text-max-width': nodeWidth - 20,
        // wrapping point, default is space, not suitable for Chinese
        'text-overflow-wrap': 'anywhere',
        // 'border-opacity': 0.5,
        'border-width': 1.5,
        'border-color': palette.primary.main,
        'font-size': 18,
        'overlay-opacity': 0,
        'transition-property': 'background-color color',
        'transition-duration': '0.1s',
        'transition-timing-function': 'ease-in-out',
      },
    },
    {
      selector: 'edge',
      style: {
        width: 1.5,
        'line-color': palette.primary.main,
        // 'curve-style': 'bezier',
        // 'target-arrow-color': 'black',
        // 'target-arrow-shape': 'triangle',
        'curve-style': 'taxi',
        'taxi-direction': vertical ? 'downward' : 'rightward',
      },
    },
    {
      selector: 'node[level=1]',
      style: {
        // "background-color": "#FBE5D5",
        // "border-color": "#DBC5B5",
      },
    },
    {
      selector: 'node[level=2]',
      style: {
        // "background-color": "#FFC2DC",
        // "border-color": "#DFA2BC",
      },
    },
    {
      selector: 'node[level=3]',
      style: {
        // "background-color": "#D9D2F3",
        // "border-color": "#B9B2D3",
      },
    },
    {
      selector: 'node[level=4]',
      style: {
        // "background-color": "#E2EFD9",
        // "border-color": "#C2CFB9",
      },
    },
    {
      selector: 'node[level=5]',
      style: {
        // "background-color": "#D9E2F3",
        // "border-color": "#B9C2D3",
      },
    },
    {
      selector: 'node[level=6]',
      style: {
        // "background-color": "#FFF2CC",
        // "border-color": "#DFD2AC",
      },
    },
    {
      selector: 'node[type="trunk"]',
      style: {
        // 'border-color': palette.secondary.light,
      },
    },
    {
      selector: 'node[disabled="true"]',
      style: {
        'border-color': '#7f7f7f',
        color: '#7f7f7f',
        // opacity: '70%',
      },
    },
    {
      selector: 'edge.trunk',
      style: {
        // "line-color": "#7F7F7F",
        width: 2.5,
        'line-color': palette.secondary.light,
        'target-arrow-shape': 'triangle',
        'target-arrow-color': palette.secondary.light,
      },
    },
    {
      selector: 'node.selected',
      style: {
        // 'background-opacity': 1,
        // 'border-opacity': 1,
        'background-color': palette.primary.main,
        'border-color': palette.primary.main,
        color: '#fff',
      },
    },
  ];
  return mergeStyle(baseStyle, customStyle);
};

export default getStyle;
