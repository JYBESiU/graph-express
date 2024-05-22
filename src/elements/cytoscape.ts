import { performance } from "perf_hooks";
import v8 from "v8";

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
//@ts-ignore
import dagre from "cytoscape-dagre";

import style from "./cy-style.json";
import { LayoutType } from "../utils/types";

cytoscape.use(cola);
cytoscape.use(fcose);
cytoscape.use(euler);
cytoscape.use(cise);
cytoscape.use(spread);
cytoscape.use(dagre);

cytosnap.use(["cytoscape-cise"]);

export function getCytoscape(
  elements: ElementDefinition[],
  clusters?: string[][],
  layoutName?: LayoutType
) {
  const cy = cytoscape({
    // @ts-ignore
    style,
  });

  console.log(layoutName);

  const beforeHeap = process.memoryUsage().heapUsed;
  console.log("beforeHeap :", beforeHeap / 1000000);

  console.time("time by console");
  const startTime = performance.now();

  cy.json({ elements });
  cy.layout(makeLayout(layoutName, clusters)).run();

  const afterHeap = process.memoryUsage().heapUsed;
  // console.log(v8.getHeapStatistics());
  console.log("afterHeap :", afterHeap / 1000000);

  console.log(
    `Heap used: ${(afterHeap - beforeHeap) / 1000000} MB`
  );

  console.timeEnd("time by console");
  const endTime = performance.now();

  return { cy, time: endTime - startTime };
}

export async function getCytosnapImage(
  elements: ElementDefinition[],
  clusters?: string[][],
  layoutName?: LayoutType
) {
  const snap = cytosnap({
    puppeteer: {
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });

  await snap.start();

  const img = await snap.shot({
    elements,
    layout: makeLayout(layoutName, clusters),
    style,
    resolvesTo: "base64uri",
    format: "png",
    width: 1280,
    height: 720,
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
    case LayoutType.DAGRE:
      return dagreLayout;
    case LayoutType.CISE:
      return makeCiseLayout(clusters);
    case LayoutType.COLA:
      return colaLayout;

    default:
      return circleLayout;
  }
};

const randomLayout: RandomLayoutOptions = {
  name: "random",
  boundingBox: { x1: 0, y1: 0, w: 300, h: 300 },
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
  componentSpacing: 100,
  // nodeRepulsion: (node) => 100 * Math.pow(node.degree(), 3),
  nodeRepulsion: (node) => 10000,
  idealEdgeLength: (edge) => 64,
};

const fcoseLayout = {
  name: "fcose",
  animate: false,
  nodeSeparation: 100,
  nodeRepulsion: (node: any) =>
    // 100 * Math.pow(node.degree(), 3),
    40000,
  idealEdgeLength: (edge: any) => 64,
};

const colaLayout = {
  name: "cola",
  animate: false,
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

const dagreLayout = {
  name: "dagre",
  nodeSep: 20,
  edgeSep: 40,
  rankSep: 40,
  align: "DL",
  rankDir: "TB",
};

const makeCiseLayout = (clusters?: string[][]) => ({
  name: "cise",
  clusters,
  nodeSeparation: 40,
  idealInterClusterEdgeLengthCoefficient: 3,
  nodeRepulsion: 400,
});
