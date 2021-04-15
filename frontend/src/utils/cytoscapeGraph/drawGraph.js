import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import $ from 'jquery';

import getStyle from './getStyle';
import getLayoutOptions from './getLayoutOptions';

cytoscape.use(cola);

const processOptions = (options) => {
  // parse & enhance style
  options.style = getStyle(options);
  return {
    ...options,
    style: getStyle(options),
  };
};

const addTrunkEdges = (cy, data) => {
  const trunkNodes = data.nodes.filter((n) => n.data.type === 'trunk');
  trunkNodes.slice(0, trunkNodes.length - 1).forEach((node, i) =>
    cy.add({
      data: {
        source: node.data.id,
        target: trunkNodes[i + 1].data.id,
      },
      classes: ['trunk'],
    })
  );
};

const applyLayout = (cy, data, options) => {
  const layoutOptions = getLayoutOptions(cy, data.nodes, options);
  const layout = cy.layout(layoutOptions);
  layout.run();
};

const addHandlers = (cy, options) => {
  const handleNodeClick = options.onClick || (() => null);
  const handleClick = (e) => {
    if (e.target.group && e.target.group() === 'nodes') {
      if (e.target.data().disabled === 'true') return;
      cy.nodes().forEach((node) => node.removeClass('selected'));
      e.target.toggleClass('selected');
      handleNodeClick(e.target);
    }
  };
  cy.on('tap', handleClick);
};

export function drawGraph(data, options) {
  const processedOptions = processOptions(options);
  const { container: element, subjectNodeId } = processedOptions;
  const cy = cytoscape({
    elements: [...data.nodes, ...data.edges],
    userZoomingEnabled: false,
    userPanningEnabled: false,
    autoungrabify: true,
    boxSelectionEnabled: false,
    ...processedOptions,
  });
  addTrunkEdges(cy, data);
  applyLayout(cy, data, options);
  addHandlers(cy, options);
  cy.$(`#${subjectNodeId}`).addClass('selected');
  cy.on('mouseover', 'node', (e) => {
    if (e.target.data().disabled === 'true') return;
    $(element).css('cursor', 'pointer');
  });
  cy.on('mouseout', 'node', (e) => {
    $(element).css('cursor', 'default');
  });
  cy.fit(null, 20);
  return cy;
}

export default drawGraph;
