import cytoscape, { ElementDefinition } from "cytoscape";
//@ts-ignore
import cytosnap from "cytosnap";
//@ts-ignore
import cola from "cytoscape-cola";
//@ts-ignore
import cise from "cytoscape-cise";
//@ts-ignore
import euler from "cytoscape-euler";
//@ts-ignore
import fcose from "cytoscape-fcose";

import style from "./cy-style.json";

cytoscape.use(cola);
cytoscape.use(fcose);
cytoscape.use(euler);
cytoscape.use(cise);
cytosnap.use(["cytoscape-cise"]);

export function getCytoscapeElements(
  elements: ElementDefinition[],
  clusters?: string[][]
) {
  const cy = cytoscape({
    elements,
    //@ts-ignore
    style,
    // layout: {
    //   name: "circle",
    //   //@ts-ignore
    //   animate: false,
    // },
    layout: makeLayout(clusters),
  });

  return cy;
}

export async function getCytosnapImage(
  elements: ElementDefinition[],
  clusters: string[][]
) {
  const snap = cytosnap();

  await snap.start();

  const img = await snap.shot({
    elements,
    layout: makeLayout(clusters),
    style,
    resolvesTo: "base64uri",
    format: "png",
    width: 1920,
    height: 1080,
    background: "transparent",
  });

  return img;
}

export function getCytoscapeElementsCircle(
  elements: ElementDefinition[]
) {
  const cy = cytoscape({
    elements,
    layout: { name: "circle" },
  });

  return cy;
}

const makeLayout = (clusters?: string[][]) => ({
  name: "cise",
  clusters,
  nodeSeparation: 10,
});
