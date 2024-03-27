import { Core, ElementDefinition } from "cytoscape";
import { Sql } from "postgres";

import {
  getNodesMaps,
  getEdgeFunctionsByNodes,
  getNodeCountMaps,
} from "../sql";
import { NodeLabel } from "../utils/types";

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
