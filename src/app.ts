import express, {
  Application,
  Request,
  Response,
} from "express";
import cors from "cors";

import { nodeColors, port } from "./utils/constant";
import { getSql } from "./utils/db";
import { NodeLabel } from "./utils/types";
import {
  getCyElements,
  getElementsByNodeLabels,
  getCytoscapeElements,
  getCytoscapeElementsCircle,
  getCytosnapImage,
  getElementsByNodeSampling,
  getElementsByEdgeSampling,
} from "./elements";
import {
  getCityNodes,
  getPersonKnowsPersonEdgesNoLimit,
  getPersonNodesNoLimit,
} from "./sql";

const app: Application = express();
app.use(cors());

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});

app.get(
  "/graph-all",
  async (req: Request, res: Response) => {
    const sql = await getSql(req);

    const AllNodeLabels = Object.values(NodeLabel);
    const { elements, clusters } =
      await getElementsByNodeLabels(sql, AllNodeLabels);

    const cy = getCytoscapeElements(elements, clusters);

    const results = getCyElements(cy);

    res.send(results);
  }
);

app.get(
  "/graph/node-sample",
  async (req: Request, res: Response) => {
    const sql = await getSql(req);
    const labels = req.query.labels as NodeLabel[];

    const { elements, clusters } =
      await getElementsByNodeSampling(sql, labels, 0.002);
    console.log("elements: ", elements.length);

    const cy = getCytoscapeElements(elements, clusters);
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

    const { elements } = await getElementsByEdgeSampling(
      sql,
      labels,
      0.0001
    );
    console.log("elements: ", elements.length);

    const cy = getCytoscapeElements(elements);
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

    const results = await getElementsByNodeLabels(
      sql,
      labels
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
      await getElementsByNodeLabels(sql, labels);

    const img = await getCytosnapImage(elements, clusters);
    console.log("img : " + img);

    res.send({ imgUrl: img });
  }
);

app.get(
  "/graph/person",
  async (req: Request, res: Response) => {
    const sql = await getSql(req);

    const n = await getPersonNodesNoLimit(sql);
    const e = await getPersonKnowsPersonEdgesNoLimit(sql);

    const elements = [...n, ...e];

    const cy = getCytoscapeElementsCircle(elements);
    const results = getCyElements(cy);
    console.log("results: ", results.length);

    res.send(results);
  }
);

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
