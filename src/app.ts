import express, {
  Application,
  Request,
  Response,
} from "express";
import cors from "cors";

import {
  edgeColors,
  nodeColors,
  port,
} from "./utils/constant";
import { getSql } from "./utils/db";
import { LayoutType, NodeLabel } from "./utils/types";
import {
  getCyElements,
  getElementsByNodeLabels,
  getCytoscape,
  getCytosnapImage,
  getElementsByNodeSampling,
  getElementsByEdgeSampling,
} from "./elements";

import {
  getEdgeLablesByNodeLabels,
  getNodeLabelsByEdgeLabel,
} from "./utils/util";
import { getNodeData, nodeCountFunctionMap } from "./sql";

const app: Application = express();
app.use(cors());

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});

app.get(
  "/graph/node-sample",
  async (req: Request, res: Response) => {
    const sql = await getSql(req);
    const nodeLabels = req.query.nodeLabels as NodeLabel[];

    const { elements, clusters } =
      await getElementsByNodeSampling(
        sql,
        nodeLabels,
        0.002
      );
    console.log("elements: ", elements.length);

    const cy = getCytoscape(
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
    const nodeLabels = req.query.nodeLabels as NodeLabel[];

    const { elements, clusters } =
      await getElementsByEdgeSampling(
        sql,
        nodeLabels,
        0.0001
      );

    const cy = getCytoscape(
      elements,
      clusters,
      LayoutType.CISE
    );
    console.log("end");
    const results = getCyElements(cy);

    res.send(results);
  }
);

app.get("/graph", async (req: Request, res: Response) => {
  const sql = await getSql(req);
  const nodeLabels = req.query.nodeLabels as NodeLabel[];

  const { elements, clusters } =
    await getElementsByNodeLabels(sql, nodeLabels);

  const cy = getCytoscape(elements, clusters);

  const results = getCyElements(cy);

  res.send(results);
});

app.get(
  "/graph/client",
  async (req: Request, res: Response) => {
    const sql = await getSql(req);
    const nodeLabels = req.query.nodeLabels as NodeLabel[];

    const results = await getElementsByEdgeSampling(
      sql,
      nodeLabels,
      0.00005
    );

    res.send(results);
  }
);

app.get(
  "/graph/image",
  async (req: Request, res: Response) => {
    const sql = await getSql(req);
    const nodeLabels = req.query.nodeLabels as NodeLabel[];

    const { elements, clusters } =
      await getElementsByEdgeSampling(
        sql,
        nodeLabels,
        0.00001
      );

    const img = await getCytosnapImage(
      elements,
      clusters,
      LayoutType.CIRCLE
    );

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

    res.send(nodeTypes);
  }
);

app.get(
  "/edge-types",
  async (req: Request, res: Response) => {
    const nodeLabels = req.query.nodeLabels as NodeLabel[];

    const edgeLabels =
      getEdgeLablesByNodeLabels(nodeLabels);
    const edgeTypes = edgeLabels.map((label) => ({
      label,
      color: edgeColors[label],
    }));

    res.send(edgeTypes);
  }
);

app.get(
  "/table-schema",
  async (req: Request, res: Response) => {
    const nodeLabels = req.query.nodeLabels as NodeLabel[];

    const selectedNodes = nodeLabels.map((label) => ({
      data: { id: label },
    }));

    const edgeLabels =
      getEdgeLablesByNodeLabels(nodeLabels);
    const edges = edgeLabels.map((edgeLabel) => {
      const [source, target] =
        getNodeLabelsByEdgeLabel(edgeLabel);

      return {
        data: {
          id: edgeLabel,
          source,
          target,
        },
      };
    });

    const elements = [...selectedNodes, ...edges];
    const cy = getCytoscape(
      elements,
      undefined,
      LayoutType.DAGRE
    );
    const cyElements = getCyElements(cy);

    const nodeSchema = cyElements
      .filter((e) => e.group === "nodes")
      .map((e) => ({
        id: e.data.id,
        position: {
          x: e.position.x * 10,
          y: e.position.y * 10,
        },
        data: {
          label: e.data.id.toUpperCase(),
          bg: nodeColors[e.data.id as NodeLabel],
        },
        type: "custom",
      }));
    const edgeSchema = cyElements
      .filter((e) => e.group === "edges")
      .map((e) => ({
        ...e.data,
        label: e.data.id,
        type:
          e.data.source === e.data.target
            ? "selfConnect"
            : "bezier",
      }));

    res.send({ nodeSchema, edgeSchema });
  }
);

app.get(
  "/node-data",
  async (req: Request, res: Response) => {
    const sql = await getSql(req);
    const nodeLabel = req.query.nodeLabel as NodeLabel;

    const count = await nodeCountFunctionMap[nodeLabel](
      sql
    );

    const page = Number(req.query.page);
    const size = Number(req.query.size);
    const offset = page * size;

    const result = await getNodeData(
      sql,
      nodeLabel,
      size,
      offset
    );

    const data = {
      result,
      count,
    };

    res.send(data);
  }
);
