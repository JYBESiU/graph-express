import { Sql } from "postgres";

import { NodeLabel } from "../utils/types";
import { nodeColors } from "../utils/constant";

export const getNodesMaps = {
  [NodeLabel.CITY]: getCityNodes,
  [NodeLabel.COMPANY]: getCompanyNodes,
  [NodeLabel.CONTINENT]: getContinentNodes,
  [NodeLabel.COUNTRY]: getCountryNodes,
  [NodeLabel.FORUM]: getForumNodes,
  [NodeLabel.MESSAGE]: getMessageNodes,
  [NodeLabel.PERSON]: getPersonNodes,
  [NodeLabel.TAG]: getTagNodes,
  [NodeLabel.TAGCLASS]: getTagclassNodes,
  [NodeLabel.UNIVERSITY]: getUniversityNodes,
};

export async function getCityNodes(
  sql: Sql,
  size?: number
) {
  const nodes = await sql`
  SELECT *, ${nodeColors[NodeLabel.CITY]} as bg
  FROM cypher($$
    MATCH (n: city)
    RETURN n.vertex_id
  $$ ) as (id bigint)
  ${
    size
      ? sql`ORDER BY random()
            LIMIT ${size}`
      : sql``
  };`;

  return nodes.map((node) => ({
    data: { ...node, id: "city_" + node.id },
  }));
}

async function getCompanyNodes(sql: Sql, size?: number) {
  const nodes = await sql`
  SELECT *, ${nodeColors[NodeLabel.COMPANY]} as bg
  FROM cypher($$
    MATCH (n: company)
    WHERE n.vertex_id < 300
    RETURN n.vertex_id
  $$ ) as (id bigint)
  ${
    size
      ? sql`ORDER BY random()
            LIMIT ${size}`
      : sql``
  };`;

  return nodes.map((node) => ({
    data: { ...node, id: "company_" + node.id },
  }));
}

async function getContinentNodes(sql: Sql, size?: number) {
  const nodes = await sql`
  SELECT *, ${nodeColors[NodeLabel.CONTINENT]} as bg
  FROM cypher($$
    MATCH (n: continent)
    RETURN n.vertex_id
  $$ ) as (id bigint)
  ${
    size
      ? sql`ORDER BY random()
            LIMIT ${size}`
      : sql``
  };`;

  return nodes.map((node) => ({
    data: { ...node, id: "continent_" + node.id },
  }));
}

async function getCountryNodes(sql: Sql, size?: number) {
  const nodes = await sql`
  SELECT *, ${nodeColors[NodeLabel.COUNTRY]} as bg
  FROM cypher($$
    MATCH (n: country)
    WHERE n.vertex_id < 30
    RETURN n.vertex_id
  $$ ) as (id bigint)
  ${
    size
      ? sql`ORDER BY random()
            LIMIT ${size}`
      : sql``
  };`;

  return nodes.map((node) => ({
    data: { ...node, id: "country_" + node.id },
  }));
}

async function getForumNodes(sql: Sql, size?: number) {
  const nodes = await sql`
  SELECT *, ${nodeColors[NodeLabel.FORUM]} as bg
  FROM cypher($$
    MATCH (n: forum)
    WHERE n.vertex_id < 10000
    RETURN n.vertex_id
  $$ ) as (id bigint)
  ${
    size
      ? sql`ORDER BY random()
            LIMIT ${size}`
      : sql``
  };`;

  return nodes.map((node) => ({
    data: { ...node, id: "forum_" + node.id },
  }));
}

async function getMessageNodes(sql: Sql, size?: number) {
  const nodes = await sql`
  SELECT *, ${nodeColors[NodeLabel.MESSAGE]} as bg
  FROM cypher($$
    MATCH (n: message)
    WHERE n.vertex_id < 100000
    RETURN n.vertex_id
  $$ ) as (id bigint)
  ${
    size
      ? sql`ORDER BY random()
            LIMIT ${size}`
      : sql``
  };`;

  return nodes.map((node) => ({
    data: { ...node, id: "message_" + node.id },
  }));
}

async function getPersonNodes(sql: Sql, size?: number) {
  const nodes = await sql`
  SELECT *, ${nodeColors[NodeLabel.PERSON]} as bg
  FROM cypher($$
    MATCH (n: person)
    WHERE n.vertex_id < 2000
    RETURN n.vertex_id
  $$ ) as (id bigint)
  ${
    size
      ? sql`ORDER BY random()
            LIMIT ${size}`
      : sql``
  };`;

  return nodes.map((node) => ({
    data: { ...node, id: "person_" + node.id },
  }));
}

export async function getPersonNodesNoLimit(
  sql: Sql,
  size?: number
) {
  const nodes = await sql`
  SELECT *, ${nodeColors[NodeLabel.PERSON]} as bg
  FROM cypher($$
    MATCH (n: person)
    RETURN n.vertex_id
  $$ ) as (id bigint)
  ${
    size
      ? sql`ORDER BY random()
            LIMIT ${size}`
      : sql``
  };`;

  return nodes.map((node) => ({
    data: { ...node, id: "person_" + node.id },
  }));
}

async function getTagNodes(sql: Sql, size?: number) {
  const nodes = await sql`
  SELECT *, ${nodeColors[NodeLabel.TAG]} as bg
  FROM cypher($$
    MATCH (n: tag)
    WHERE n.vertex_id < 100
    RETURN n.vertex_id
  $$ ) as (id bigint)
  ${
    size
      ? sql`ORDER BY random()
            LIMIT ${size}`
      : sql``
  };`;

  return nodes.map((node) => ({
    data: { ...node, id: "tag_" + node.id },
  }));
}

async function getTagclassNodes(sql: Sql, size?: number) {
  const nodes = await sql`
  SELECT *, ${nodeColors[NodeLabel.TAGCLASS]} as bg
  FROM cypher($$
    MATCH (n: tagclass)
    WHERE n.vertex_id < 100
    RETURN n.vertex_id
  $$ ) as (id bigint)
  ${
    size
      ? sql`ORDER BY random()
            LIMIT ${size}`
      : sql``
  };`;

  return nodes.map((node) => ({
    data: { ...node, id: "tagclass_" + node.id },
  }));
}

async function getUniversityNodes(sql: Sql, size?: number) {
  const nodes = await sql`
  SELECT *, ${nodeColors[NodeLabel.UNIVERSITY]} as bg
  FROM cypher($$
    MATCH (n: university)
    WHERE n.vertex_id < 1600
    RETURN n.vertex_id
  $$ ) as (id bigint)
  ${
    size
      ? sql`ORDER BY random()
            LIMIT ${size}`
      : sql``
  };`;

  return nodes.map((node) => ({
    data: { ...node, id: "university_" + node.id },
  }));
}
