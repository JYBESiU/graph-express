import cytoscape, { ElementDefinition } from "cytoscape";

export function getCytoscapeElements(
  elements: ElementDefinition[],
  clusters: string[][]
) {
  const cy = cytoscape({
    elements,
    layout: makeLayout(clusters),
  });

  return cy;
}

const makeLayout = (clusters: string[][]) => ({
  name: "cise",
  clusters,
  nodeSeparation: 20,
});
