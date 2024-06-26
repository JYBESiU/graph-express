import express, {
  Application,
  Request,
  Response,
} from "express";
import cors from "cors";

import { nodeColors, port } from "./utils/constant";
import { getSql } from "./utils/db";
import {
  EdgeLabel,
  LayoutType,
  NodeLabel,
} from "./utils/types";
import {
  getCyElements,
  getElementsByLabels,
  getCytoscape,
  getCytosnapImage,
  getElementsByNodeSampling,
  getElementsByEdgeSampling,
} from "./elements";
import {
  getEdgeLablesByNodeLabels,
  getNodeLabelsByEdgeLabel,
} from "./utils/util";
import {
  getNodeData,
  hasMemberQuery,
  knowsQuery,
  likesQuery,
  nodeCountFunctionMap,
} from "./sql";

const app: Application = express();
app.use(cors());

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});

app.get(
  "/graph/preDefinedQuery",
  async (req: Request, res: Response) => {
    const sql = await getSql(req);
    const query = req.query.query as string;

    const queryFunction =
      query === "knows"
        ? knowsQuery
        : query === "likes"
        ? likesQuery
        : hasMemberQuery;

    const elements = await queryFunction(sql);

    const { cy, time } = getCytoscape(
      elements,
      undefined,
      LayoutType.COLA
    );

    console.log(
      `sf: ${
        req.query.sf
      }, query: ${query}, time by performance: ${time.toFixed(
        0
      )} ms \n`
    );

    const results = getCyElements(cy);

    res.send(results);
  }
);

app.get(
  "/graph/preDefinedQuery/client",
  async (req: Request, res: Response) => {
    const sql = await getSql(req);
    const query = req.query.query as string;

    const queryFunction =
      query === "knows"
        ? knowsQuery
        : query === "likes"
        ? likesQuery
        : hasMemberQuery;

    const elements = await queryFunction(sql);

    res.send(elements);
  }
);

app.get(
  "/graph/node-sample",
  async (req: Request, res: Response) => {
    const sql = await getSql(req);
    const nodeLabels = req.query.nodeLabels as NodeLabel[];

    const { elements, clusters } =
      await getElementsByNodeSampling(
        sql,
        nodeLabels,
        0.11
      );
    console.log("elements: ", elements.length);

    const { cy } = getCytoscape(
      elements,
      clusters,
      LayoutType.FCOSE
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
      await getElementsByEdgeSampling(sql, nodeLabels, 0.1);

    const { cy } = getCytoscape(
      elements,
      clusters,
      LayoutType.FCOSE
    );
    console.log("end");
    const results = getCyElements(cy);

    res.send(results);
  }
);

app.get("/graph", async (req: Request, res: Response) => {
  const sql = await getSql(req);
  const nodeLabels = req.query.nodeLabels as NodeLabel[];
  const edgeLabels = req.query.edgeLabels as EdgeLabel[];

  const { elements, clusters } = await getElementsByLabels(
    sql,
    nodeLabels,
    edgeLabels
  );

  const { cy } = getCytoscape(
    elements,
    clusters,
    LayoutType.FCOSE
  );

  console.log("end");
  const results = getCyElements(cy);

  res.send(results);
});

app.get(
  "/graph/client",
  async (req: Request, res: Response) => {
    const sql = await getSql(req);
    const nodeLabels = req.query.nodeLabels as NodeLabel[];
    const edgeLabels = req.query.edgeLabels as EdgeLabel[];

    const { elements } = await getElementsByLabels(
      sql,
      nodeLabels,
      edgeLabels
    );

    res.send(elements);
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
    const { cy } = getCytoscape(
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
    console.log("nodeLabel :", nodeLabel);

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
