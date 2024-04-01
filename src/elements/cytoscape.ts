import cytoscape, {
  BreadthFirstLayoutOptions,
  CircleLayoutOptions,
  ConcentricLayoutOptions,
  CoseLayoutOptions,
  ElementDefinition,
  RandomLayoutOptions,
} from "cytoscape";
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
//@ts-ignore
import spread from "cytoscape-spread";

import style from "./cy-style.json";
import { LayoutType } from "../utils/types";

cytoscape.use(cola);
cytoscape.use(fcose);
cytoscape.use(euler);
cytoscape.use(cise);
cytoscape.use(spread);

cytosnap.use(["cytoscape-cise"]);

export function getCytoscapeElements(
  elements: ElementDefinition[],
  clusters?: string[][],
  layoutName?: LayoutType
) {
  const cy = cytoscape({
    elements,
    layout: makeLayout(layoutName, clusters),
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
    layout: makeCiseLayout(clusters),
    style,
    resolvesTo: "base64uri",
    format: "png",
    width: 1920,
    height: 1080,
    background: "transparent",
  });

  return img;
}

const makeLayout = (
  name?: LayoutType,
  clusters?: string[][]
) => {
  switch (name) {
    case LayoutType.RANDOM:
      return randomLayout;
    case LayoutType.CIRCLE:
      return circleLayout;
    case LayoutType.CONCENTRIC:
      return concentricLayout;
    case LayoutType.BREADTHFIRST:
      return breadthfirstLayout;
    case LayoutType.COSE:
      return coseLayout;

    case LayoutType.FCOSE:
      return fcoseLayout;
    case LayoutType.EULER:
      return eulerLayout;
    case LayoutType.SPREAD:
      return spreadLayout;
    case LayoutType.CISE:
      return makeCiseLayout(clusters);

    default:
      return circleLayout;
  }
};

const randomLayout: RandomLayoutOptions = {
  name: "random",
};

const circleLayout: CircleLayoutOptions = {
  name: "circle",
  avoidOverlap: true,
  spacingFactor: 10,
};

const concentricLayout: ConcentricLayoutOptions = {
  name: "concentric",
  minNodeSpacing: 30,
  levelWidth: (node) => {
    return node.maxDegree() / 5;
  },
};

const breadthfirstLayout: BreadthFirstLayoutOptions = {
  name: "breadthfirst",
  circle: true,
  spacingFactor: 10,
};

const coseLayout: CoseLayoutOptions = {
  name: "cose",
  animate: false,
  randomize: true,
  componentSpacing: 50,
  nodeRepulsion: (node) => 10000,
  idealEdgeLength: (edge) => 64,
};

const fcoseLayout = {
  name: "fcose",
  animate: false,
  packComponents: false,
  uniformNodeDimensions: true,
  nodeSeparation: 6500,
  nodeRepulsion: (node: any) => 500000,
};

const eulerLayout = {
  name: "euler",
  animate: false,
};

const spreadLayout = {
  name: "spread",
  animate: false,
  prelayout: coseLayout,
};

const makeCiseLayout = (clusters?: string[][]) => ({
  name: "cise",
  clusters,
  nodeSeparation: 40,
  idealInterClusterEdgeLengthCoefficient: 3,
  nodeRepulsion: 40000,
});
