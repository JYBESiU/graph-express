import { Core } from "cytoscape";
import { Sql } from "postgres";

import { NodeLabel } from "../utils/types";
import { getNodesMaps } from "./nodeSql";
import { getEdgesFunctionsByNodes } from "./edgeSql";

export async function getElementsByNodes(
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
  const edgeFunctions =
    getEdgesFunctionsByNodes(nodeLables);
  for (const edgeFunction of edgeFunctions) {
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
