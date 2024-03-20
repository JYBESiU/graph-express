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

import { nodeColors, port } from "./utils/constant";
import { getSql } from "./utils/db";
import { NodeLabel } from "./utils/types";
import {
  getCyElements,
  getElementsByNodes,
  getCytoscapeElements,
} from "./elements";

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

    const AllNodeLabels = Object.values(NodeLabel);
    const { elements, clusters } = await getElementsByNodes(
      sql,
      AllNodeLabels
    );

    const cy = getCytoscapeElements(elements, clusters);

    const results = getCyElements(cy);

    res.send(results);
  }
);

app.get("/graph", async (req: Request, res: Response) => {
  const sql = await getSql(req);
  const labels = req.query.labels as NodeLabel[];

  const { elements, clusters } = await getElementsByNodes(
    sql,
    labels
  );

  const cy = getCytoscapeElements(elements, clusters);

  const results = getCyElements(cy);

  res.send(results);
});

app.get(
  "/node-types",
  async (req: Request, res: Response) => {
    const nodeTypes = Object.entries(NodeLabel).map(
      ([_, value]) => ({
        label: value,
        color: nodeColors[value],
      })
    );

    // TODO: node count 추가

    res.send(nodeTypes);
  }
);
