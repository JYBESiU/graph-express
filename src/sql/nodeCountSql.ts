import { Sql } from "postgres";

import { NodeLabel } from "../utils/types";

export const nodeCountFunctionMap = {
  [NodeLabel.CITY]: getCityNodeCount,
  [NodeLabel.COMPANY]: getCompanyNodeCount,
  [NodeLabel.CONTINENT]: getContinentNodeCount,
  [NodeLabel.COUNTRY]: getCountryNodeCount,
  [NodeLabel.FORUM]: getForumNodeCount,
  [NodeLabel.MESSAGE]: getMessageNodeCount,
  [NodeLabel.PERSON]: getPersonNodeCount,
  [NodeLabel.TAG]: getTagNodeCount,
  [NodeLabel.TAGCLASS]: getTagclassNodeCount,
  [NodeLabel.UNIVERSITY]: getUniversityNodeCount,
};

async function getCityNodeCount(sql: Sql): Promise<number> {
  const count = await sql`
  SELECT *
  FROM cypher($$
    MATCH (n: city)
    RETURN count(n.vertex_id) as count
  $$ ) as (count bigint);`;

  return Number(count[0].count);
}

async function getCountryNodeCount(
  sql: Sql
): Promise<number> {
  const count = await sql`
  SELECT *
  FROM cypher($$
    MATCH (n: country)
    RETURN count(n.vertex_id) as count
  $$ ) as (count bigint);`;

  return Number(count[0].count);
}

async function getContinentNodeCount(
  sql: Sql
): Promise<number> {
  const count = await sql`
  SELECT *
  FROM cypher($$
    MATCH (n: continent)
    RETURN count(n.vertex_id) as count
  $$ ) as (count bigint);`;

  return Number(count[0].count);
}

async function getCompanyNodeCount(
  sql: Sql
): Promise<number> {
  const count = await sql`
  SELECT *
  FROM cypher($$
    MATCH (n: company)
    RETURN count(n.vertex_id) as count
  $$ ) as (count bigint);`;

  return Number(count[0].count);
}

async function getForumNodeCount(
  sql: Sql
): Promise<number> {
  const count = await sql`
  SELECT *
  FROM cypher($$
    MATCH (n: forum)
    RETURN count(n.vertex_id) as count
  $$ ) as (count bigint);`;

  return Number(count[0].count);
}

async function getMessageNodeCount(
  sql: Sql
): Promise<number> {
  const count = await sql`
  SELECT *
  FROM cypher($$
    MATCH (n: message)
    RETURN count(n.vertex_id) as count
  $$ ) as (count bigint);`;

  return Number(count[0].count);
}

async function getPersonNodeCount(
  sql: Sql
): Promise<number> {
  const count = await sql`
  SELECT *
  FROM cypher($$
    MATCH (n: person)
    RETURN count(n.vertex_id) as count
  $$ ) as (count bigint);`;

  return Number(count[0].count);
}

async function getTagNodeCount(sql: Sql): Promise<number> {
  const count = await sql`
  SELECT *
  FROM cypher($$
    MATCH (n: tag)
    RETURN count(n.vertex_id) as count
  $$ ) as (count bigint);`;

  return Number(count[0].count);
}

async function getTagclassNodeCount(
  sql: Sql
): Promise<number> {
  const count = await sql`
  SELECT *
  FROM cypher($$
    MATCH (n: tagclass)
    RETURN count(n.vertex_id) as count
  $$ ) as (count bigint);`;

  return Number(count[0].count);
}

async function getUniversityNodeCount(
  sql: Sql
): Promise<number> {
  const count = await sql`
  SELECT *
  FROM cypher($$
    MATCH (n: university)
    RETURN count(n.vertex_id) as count
  $$ ) as (count bigint);`;

  return Number(count[0].count);
}
