import { Core, ElementDefinition } from "cytoscape";
import { Sql } from "postgres";

import {
  nodesFunctionMap,
  nodeCountFunctionMap,
  edgesFunctionMap,
  edgeCountFunctionMap,
} from "../sql";
import { NodeLabel } from "../utils/types";
import { nodeColors } from "../utils/constant";
import {
  getEdgeLablesByNodeLabels,
  getNodeLabelsByEdgeLabel,
} from "../utils/util";

export function getCyElements(cy: Core) {
  //@ts-ignore
  const cyElements = cy.json().elements;
  const results = [
    ...(cyElements.nodes || []),
    ...(cyElements.edges || []),
  ];

  return results;
}

export async function getElementsByNodeLabels(
  sql: Sql,
  nodeLables: NodeLabel[]
) {
  const clusters = [];
  const nodes = [];
  for (const nodeLabel of nodeLables) {
    const n = await nodesFunctionMap[nodeLabel](sql);
    nodes.push(n);
    clusters.push(n.map((node) => node.data.id));
  }

  const edges = [];
  const edgeLabels = getEdgeLablesByNodeLabels(nodeLables);
  for (const edgeLabel of edgeLabels) {
    const e = await edgesFunctionMap[edgeLabel](sql);
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

// TODO: total count 부분 추출해서 미리 구해놓기, 중복 안 되게 맵 저장
export async function getElementsByNodeSampling(
  sql: Sql,
  nodeLables: NodeLabel[],
  samplingRate: number
) {
  const counts: { [x: string]: number } = {};
  for (const nodeLabel of nodeLables) {
    const count = await nodeCountFunctionMap[nodeLabel](
      sql
    );
    counts[nodeLabel] = Number(count);
  }
  const totalCounts = Object.values(counts).reduce(
    (acc, curr) => acc + curr,
    0
  );
  const totalToBeReducedNum = Math.floor(
    totalCounts * (1 - samplingRate)
  );

  const nodes: { [x: string]: ElementDefinition[] } = {};
  for (const nodeLabel of nodeLables) {
    const ratio = Number(
      (counts[nodeLabel] / totalCounts).toFixed(10)
    );
    const toBeReduced = Math.floor(
      totalToBeReducedNum * ratio
    );
    const reducedSize = counts[nodeLabel] - toBeReduced;

    const resultNodes = await nodesFunctionMap[nodeLabel](
      sql,
      Math.max(1, reducedSize)
    );
    nodes[nodeLabel] = resultNodes;
  }

  const edgeLabels = getEdgeLablesByNodeLabels(nodeLables);

  const edges = [];
  for (const edgeLabel of edgeLabels) {
    const [sourceLabel, targetLabel] =
      getNodeLabelsByEdgeLabel(edgeLabel);
    const e = await edgesFunctionMap[edgeLabel](
      sql,
      nodes[sourceLabel],
      nodes[targetLabel]
    );

    const eid = e.map((ee) => {
      //@ts-ignore
      ee.data.id = ee.data.source + "_" + ee.data.target;
      return ee;
    });
    edges.push(eid);
  }

  console.log(
    "nodes: ",
    Object.values(nodes).flat().length
  );
  console.log("edges: ", edges.flat().length);

  const elements = [
    ...Object.values(nodes).flat(),
    ...edges.flat(),
  ];

  const clusters = Object.values(nodes).map((labelNodes) =>
    labelNodes.map((node) => node.data.id!)
  );

  return { elements, clusters };
}

export async function getElementsByEdgeSampling(
  sql: Sql,
  nodeLables: NodeLabel[],
  samplingRate: number
) {
  const edgeLabels = getEdgeLablesByNodeLabels(nodeLables);

  const counts: { [x: string]: number } = {};
  for (const edgeLabel of edgeLabels) {
    const count = await edgeCountFunctionMap[edgeLabel](
      sql
    );
    counts[edgeLabel] = count;
  }
  const totalCounts = Object.values(counts).reduce(
    (acc, curr) => acc + curr,
    0
  );
  const totalToBeReducedNum = Math.floor(
    totalCounts * (1 - samplingRate)
  );

  console.log(
    "random edge: ",
    totalCounts - totalToBeReducedNum
  );

  // get nodes by edge sampling
  const nodes: { [x: string]: ElementDefinition[] } = {};
  for (const edgeLabel of edgeLabels) {
    const toBeReduced = Math.floor(
      totalToBeReducedNum *
        Number(
          (counts[edgeLabel] / totalCounts).toFixed(10)
        )
    );
    const reducedSize = counts[edgeLabel] - toBeReduced;

    const e = await edgesFunctionMap[edgeLabel](
      sql,
      undefined,
      undefined,
      Math.max(1, reducedSize)
    );
    e.forEach((ee) => {
      const sourceId = ee.data.source;
      const sourceLabel = sourceId.split(
        "_"
      )[0] as NodeLabel;
      const sourceData = {
        data: { id: sourceId, bg: nodeColors[sourceLabel] },
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
      const targetLabel = targetId.split(
        "_"
      )[0] as NodeLabel;
      const targetData = {
        data: { id: targetId, bg: nodeColors[targetLabel] },
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
  for (const edgeLabel of edgeLabels) {
    const [sourceLabel, targetLabel] =
      getNodeLabelsByEdgeLabel(edgeLabel);
    const e = await edgesFunctionMap[edgeLabel](
      sql,
      nodes[sourceLabel],
      nodes[targetLabel]
    );

    const eid = e.map((ee) => {
      //@ts-ignore
      ee.data.id = ee.data.source + "_" + ee.data.target;
      return ee;
    });
    edges.push(eid);
  }

  console.log(
    "nodes: ",
    Object.values(nodes).flat().length
  );
  console.log("edges:", edges.flat().length);

  const elements = [
    ...Object.values(nodes).flat(),
    ...edges.flat(),
  ];

  const clusters = Object.values(nodes).map((labelNodes) =>
    labelNodes.map((node) => node.data.id!)
  );

  return { elements, clusters };
}
