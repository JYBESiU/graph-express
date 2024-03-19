import express, {
  Application,
  Request,
  Response,
} from "express";
import cors from "cors";
import cytoscape from "cytoscape";
//@ts-ignore
import cola from "cytoscape-cola";
//@ts-ignore
import cise from "cytoscape-cise";

import { nodeColors, port } from "./constant";
import { getSql } from "./db";
import { NodeLabel } from "./types";
import { getNodesMaps } from "./nodeSql";
import { getEdgesFunctionsByNodes } from "./edgeSql";

const app: Application = express();
app.use(cors());

cytoscape.use(cola);
cytoscape.use(cise);

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});

app.get(
  "/graph-all",
  async (req: Request, res: Response) => {
    const sql = await getSql(req);

    const clusters = [];
    const nodes = [];
    for (let [_, nodeLabel] of Object.entries(NodeLabel)) {
      const n = await getNodesMaps[nodeLabel](sql);
      nodes.push(n);
      clusters.push(n.map((node) => node.data.id));
    }

    const edges = [];
    const AllNodeLabels = Object.entries(NodeLabel).map(
      ([_, v]) => v
    );
    const edgeFunctions =
      getEdgesFunctionsByNodes(AllNodeLabels);
    for (const edgeFunction of edgeFunctions) {
      const e = await edgeFunction(sql);
      edges.push(e);
    }

    const elements = [...nodes.flat(), ...edges.flat()];

    const cy = cytoscape({
      elements,
      layout: {
        name: "cise",
        //@ts-ignore
        clusters,
        nodeSeparation: 20,
      },
    });

    //@ts-ignore
    const cyElements = cy.json().elements;
    const results = [
      ...(cyElements.nodes || []),
      ...(cyElements.edges || []),
    ];

    res.send(results);
  }
);

app.get("/graph", async (req: Request, res: Response) => {
  const sql = await getSql(req);
  const label = req.query.label as string;

  res.send([]);
});

app.get(
  "/node-types",
  async (req: Request, res: Response) => {
    const nodeTypes = Object.entries(NodeLabel).map(
      ([_, value]) => ({
        name: value,
        color: nodeColors[value],
      })
    );

    // TODO: node count 추가

    res.send(nodeTypes);
  }
);
