import { Sql } from "postgres";

import { NodeLabel } from "../utils/types";
import { nodeColors } from "../utils/constant";

async function getCityNodesBySize(sql: Sql, size: number) {
  const nodes = await sql`
  SELECT *, ${nodeColors[NodeLabel.CITY]} as bg
  FROM cypher($$
    MATCH (n: city)
    RETURN n.vertex_id
  $$ ) as (id bigint)
  ORDER BY random()
  limit ${size};`;

  return nodes.map((node) => ({
    data: { ...node, id: "city_" + node.id },
  }));
}
