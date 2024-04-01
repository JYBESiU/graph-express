import express, {
  Application,
  Request,
  Response,
} from "express";
import cors from "cors";

import { nodeColors, port } from "./utils/constant";
import { getSql } from "./utils/db";
import { LayoutType, NodeLabel } from "./utils/types";
import {
  getCyElements,
  getElementsByNodeLabels,
  getCytoscapeElements,
  getCytosnapImage,
  getElementsByNodeSampling,
  getElementsByEdgeSampling,
} from "./elements";
import {
  getPersonKnowsPersonEdgesNoLimit,
  getPersonNodesNoLimit,
} from "./sql";

const app: Application = express();
app.use(cors());

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});

app.get(
  "/graph/node-sample",
  async (req: Request, res: Response) => {
    const sql = await getSql(req);
    const labels = req.query.labels as NodeLabel[];

    const { elements, clusters } =
      await getElementsByNodeSampling(sql, labels, 0.002);
    console.log("elements: ", elements.length);

    const cy = getCytoscapeElements(
      elements,
      clusters,
      LayoutType.COSE
    );
    console.log("end");
    const results = getCyElements(cy);

    res.send(results);
  }
);

app.get(
  "/graph/edge-sample",
  async (req: Request, res: Response) => {
    const sql = await getSql(req);
    const labels = req.query.labels as NodeLabel[];

    const { elements, clusters } =
      await getElementsByEdgeSampling(sql, labels, 0.00005);

    const cy = getCytoscapeElements(
      elements,
      clusters,
      LayoutType.SPREAD
    );
    console.log("end");
    const results = getCyElements(cy);

    res.send(results);
  }
);

app.get("/graph", async (req: Request, res: Response) => {
  const sql = await getSql(req);
  const labels = req.query.labels as NodeLabel[];

  const { elements, clusters } =
    await getElementsByNodeLabels(sql, labels);

  const cy = getCytoscapeElements(elements, clusters);

  const results = getCyElements(cy);

  res.send(results);
});

app.get(
  "/graph/client",
  async (req: Request, res: Response) => {
    const sql = await getSql(req);
    const labels = req.query.labels as NodeLabel[];

    const results = await getElementsByEdgeSampling(
      sql,
      labels,
      0.00005
    );

    res.send(results);
  }
);

app.get(
  "/graph/image",
  async (req: Request, res: Response) => {
    const sql = await getSql(req);
    const labels = req.query.labels as NodeLabel[];

    const { elements, clusters } =
      await getElementsByEdgeSampling(sql, labels, 0.00005);

    const img = await getCytosnapImage(elements, clusters);

    res.send({ imgUrl: img });
  }
);

// app.get(
//   "/graph/person",
//   async (req: Request, res: Response) => {
//     const sql = await getSql(req);

//     const n = await getPersonNodesNoLimit(sql);
//     const e = await getPersonKnowsPersonEdgesNoLimit(sql);

//     const elements = [...n, ...e];

//     const cy = getCytoscapeElements(elements);
//     const results = getCyElements(cy);
//     console.log("results: ", results.length);

//     res.send(results);
//   }
// );

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
