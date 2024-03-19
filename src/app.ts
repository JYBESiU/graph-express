import express, {
  Application,
  Request,
  Response,
} from "express";
import cors from "cors";
import { RowList, Row } from "postgres";
import cytoscape from "cytoscape";

import { port } from "./constant";
import { getSql } from "./db";
import { NodeLabel } from "./types";
import { getNodesMaps } from "./nodeSql";
import { getEdgesFunctionsByNodes } from "./edgeSql";

const app: Application = express();
app.use(cors());

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});

app.get(
  "/graph-all",
  async (req: Request, res: Response) => {
    const sql = await getSql(req);

    const nodes = [];
    for (let [_, nodeLabel] of Object.entries(NodeLabel)) {
      const n = await getNodesMaps[nodeLabel](sql);
      nodes.push(n);
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
        name: "cose",
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
