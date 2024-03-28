import { Core, ElementDefinition } from "cytoscape";
import { Sql } from "postgres";

import {
  getNodesMaps,
  getEdgeFunctionsByNodes,
  getNodeCountMaps,
  getEdgeCountFunctionsByNodes,
} from "../sql";
import { NodeLabel } from "../utils/types";
import { nodeColors } from "../utils/constant";

export async function getElementsByNodeLabels(
  sql: Sql,
  nodeLables: NodeLabel[]
) {
  const clusters = [];
  const nodes = [];
  for (const nodeLabel of nodeLables) {
    const n = await getNodesMaps[nodeLabel](sql);
    nodes.push(n);
    clusters.push(n.map((node) => node.data.id));
  }

  const edges = [];
  const edgeFunctions = getEdgeFunctionsByNodes(nodeLables);
  for (const [edgeFunction] of edgeFunctions) {
    const e = await edgeFunction(sql);
    const eid = e.map((ee) => {
      //@ts-ignore
      ee.data.id = ee.data.source + "_" + ee.data.target;
      return ee;
    });
    edges.push(eid);
  }

  const elements = [...nodes.flat(), ...edges.flat()];

  return { elements, clusters };
}

export function getCyElements(cy: Core) {
  //@ts-ignore
  const cyElements = cy.json().elements;
  const results = [
    ...(cyElements.nodes || []),
    ...(cyElements.edges || []),
  ];

  return results;
}

// TODO: total count 부분 추출해서 미리 구해놓기, 중복 안 되게 맵 저장
export async function getElementsByNodeSampling(
  sql: Sql,
  nodeLables: NodeLabel[],
  samplingRate: number
) {
  const counts: { [x: string]: number } = {};
  for (const nodeLabel of nodeLables) {
    const count = await getNodeCountMaps[nodeLabel](sql);
    counts[nodeLabel] = Number(count);
  }
  const totalCounts = Object.values(counts).reduce(
    (acc, curr) => acc + curr,
    0
  );
  const totalToBeReducedNum = Math.floor(
    totalCounts * (1 - samplingRate)
  );

  const clusters = [];
  const nodes: { [x: string]: ElementDefinition[] } = {};
  for (const nodeLabel of nodeLables) {
    const ratio = Number(
      (counts[nodeLabel] / totalCounts).toFixed(10)
    );
    const toBeReduced = Math.floor(
      totalToBeReducedNum * ratio
    );
    const reducedSize = counts[nodeLabel] - toBeReduced;

    const resultNodes = await getNodesMaps[nodeLabel](
      sql,
      Math.max(1, reducedSize)
    );
    nodes[nodeLabel] = resultNodes;
    clusters.push(resultNodes.map((node) => node.data.id));
  }

  const edges = [];
  const edgeFunctions = getEdgeFunctionsByNodes(
    nodeLables,
    nodes
  );
  for (const [
    edgeFunction,
    sourceNodes,
    targetNodes,
  ] of edgeFunctions) {
    const e = await edgeFunction(
      sql,
      sourceNodes,
      targetNodes
    );

    const eid = e.map((ee) => {
      //@ts-ignore
      ee.data.id = ee.data.source + "_" + ee.data.target;
      return ee;
    });
    edges.push(eid);
  }
  console.log(edges.flat().length);

  const elements = [
    ...Object.values(nodes).flat(),
    ...edges.flat(),
  ];

  return { elements, clusters };
}

export async function getElementsByEdgeSampling(
  sql: Sql,
  nodeLables: NodeLabel[],
  samplingRate: number
) {
  const edgeCountFunctions =
    getEdgeCountFunctionsByNodes(nodeLables);

  const counts: { [x: string]: number } = {};
  for (const [
    edgeCountFunction,
    name,
  ] of edgeCountFunctions) {
    const count = await edgeCountFunction(sql);
    counts[name] = count;
  }
  const totalCounts = Object.values(counts).reduce(
    (acc, curr) => acc + curr,
    0
  );
  console.log("totalCounts: ", totalCounts);
  const totalToBeReducedNum = Math.floor(
    totalCounts * (1 - samplingRate)
  );

  const nodes: ElementDefinition[] = [];
  const edges = [];
  const edgeFunctions = getEdgeFunctionsByNodes(nodeLables);
  for (const [edgeFunction, _, __, name] of edgeFunctions) {
    console.log(name);
    const ratio = Number(
      (counts[name] / totalCounts).toFixed(10)
    );
    const toBeReduced = Math.floor(
      totalToBeReducedNum * ratio
    );
    const reducedSize = counts[name] - toBeReduced;
    console.log("counts: ", counts[name]);
    console.log("reducedSize: ", reducedSize + "\n");

    const e = await edgeFunction(
      sql,
      _,
      __,
      Math.max(1, reducedSize)
    );
    const eid = e.map((ee) => {
      const source = ee.data.source;
      const target = ee.data.target;

      if (!nodes.some((node) => node.data.id === source)) {
        nodes.push({
          data: {
            id: source,
            bg: getBG(source),
          },
        });
      }
      if (!nodes.some((node) => node.data.id === target)) {
        nodes.push({
          data: {
            id: target,
            bg: getBG(target),
          },
        });
      }

      //@ts-ignore
      ee.data.id = ee.data.source + "_" + ee.data.target;
      return ee;
    });
    edges.push(eid);
  }

  console.log("nodes", nodes.length);
  const elements = [...nodes, ...edges.flat()];

  return { elements };
}

const getBG = (id: string) =>
  nodeColors[id.split("_")[0] as NodeLabel];
