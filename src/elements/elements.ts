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

  const totalToBeReducedNum = Math.floor(
    totalCounts * (1 - samplingRate)
  );

  console.log(
    "random edge : ",
    totalCounts - totalToBeReducedNum
  );

  // get nodes by edge sampling
  const nodes: { [x: string]: ElementDefinition[] } = {};
  const randomEdgeFunctions =
    getEdgeFunctionsByNodes(nodeLables);
  for (const [
    edgeFunction,
    _,
    __,
    name,
  ] of randomEdgeFunctions) {
    const ratio = Number(
      (counts[name] / totalCounts).toFixed(10)
    );
    const toBeReduced = Math.floor(
      totalToBeReducedNum * ratio
    );
    const reducedSize = counts[name] - toBeReduced;

    const e = await edgeFunction(
      sql,
      _,
      __,
      Math.max(1, reducedSize)
    );
    e.forEach((ee) => {
      const sourceId = ee.data.source;
      const sourceLabel = sourceId.split("_")[0];
      const sourceData = {
        data: { id: sourceId, bg: getBG(sourceLabel) },
      };
      if (!nodes[sourceLabel]) {
        nodes[sourceLabel] = [sourceData];
      } else if (
        !nodes[sourceLabel].some(
          (node) => node.data.id === sourceId
        )
      ) {
        nodes[sourceLabel].push(sourceData);
      }

      const targetId = ee.data.target;
      const targetLabel = targetId.split("_")[0];
      const targetData = {
        data: { id: targetId, bg: getBG(targetLabel) },
      };
      if (!nodes[targetLabel]) {
        nodes[targetLabel] = [targetData];
      } else if (
        !nodes[targetLabel].some(
          (node) => node.data.id === targetId
        )
      ) {
        nodes[targetLabel].push(targetData);
      }
    });
  }

  // get induced
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

  const clusters = Object.values(nodes).map((labelNodes) =>
    labelNodes.map((node) => node.data.id!)
  );

  const elements = [
    ...Object.values(nodes).flat(),
    ...edges.flat(),
  ];

  console.log(
    "nodes: ",
    Object.values(nodes).flat().length
  );
  console.log("edges :", edges.flat().length);

  return { elements, clusters };
}

const getBG = (label: string) =>
  nodeColors[label as NodeLabel];
