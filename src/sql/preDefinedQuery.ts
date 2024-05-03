import { Sql } from "postgres";
import { ElementDefinition } from "cytoscape";

import { edgeColors, nodeColors } from "../utils/constant";
import { EdgeLabel, NodeLabel } from "../utils/types";

const makeNode = (
  id: string,
  nodeLabel: NodeLabel
): ElementDefinition => ({
  data: {
    id: id,
    bg: nodeColors[nodeLabel],
  },
});

const makeEdge = (
  sourceId: string,
  targetId: string,
  edgeLabel: EdgeLabel
): ElementDefinition => ({
  data: {
    color: edgeColors[edgeLabel],
    source: sourceId,
    target: targetId,
  },
});

export const knowsQuery = async (sql: Sql) => {
  const nodeIds = new Set();
  const nodes: ElementDefinition[] = [];
  const edges: ElementDefinition[] = [];

  const fixedPerson = await sql`
    SELECT *
    FROM cypher($$
      MATCH (p1: person)-[l:person_studyat_university]->(u1: university)
      WHERE p1.vertex_id = 555
      RETURN p1.vertex_id, u1.vertex_id
    $$) as (p1 bigint, u1 bigint)
  ;`;
  fixedPerson.forEach((edge) => {
    const personId = "person_" + edge.p1;
    if (!nodeIds.has(personId)) {
      nodeIds.add(personId);
      nodes.push(makeNode(personId, NodeLabel.PERSON));
    }

    const univId = "univ_" + edge.u1;
    if (!nodeIds.has(univId)) {
      nodeIds.add(univId);
      nodes.push(makeNode(univId, NodeLabel.UNIVERSITY));
    }

    edges.push(
      makeEdge(
        personId,
        univId,
        EdgeLabel.PERSON_STUDYAT_UNIVERSITY
      )
    );
  });

  const firstHops = await sql`
    SELECT *
    FROM cypher($$
      MATCH (p1: person)-[k:person_knows_person]->(p2: person)-[l:person_studyat_university]->(u1: university)
      WHERE p1.vertex_id = 555
      RETURN p1.vertex_id, p2.vertex_id, u1.vertex_id
    $$) as (p1 bigint, p2 bigint, u1 bigint)
  ;`;
  firstHops.forEach((edge) => {
    const person1Id = "person_" + edge.p1;

    const person2Id = "person_" + edge.p2;
    if (!nodeIds.has(person2Id)) {
      nodeIds.add(person2Id);
      nodes.push(makeNode(person2Id, NodeLabel.PERSON));
    }

    const univId = "univ_" + edge.u1;
    if (!nodeIds.has(univId)) {
      nodeIds.add(univId);
      nodes.push(makeNode(univId, NodeLabel.UNIVERSITY));
    }

    edges.push(
      makeEdge(
        person1Id,
        person2Id,
        EdgeLabel.PERSON_KNOWS_PERSON
      ),
      makeEdge(
        person2Id,
        univId,
        EdgeLabel.PERSON_STUDYAT_UNIVERSITY
      )
    );
  });

  const secondHops = await sql`
    SELECT *
    FROM cypher($$
      MATCH (p1: person)-[k1:person_knows_person]->(p2: person)-[k2:person_knows_person]->(p3: person)-[l:person_studyat_university]->(u1: university)
      WHERE p1.vertex_id = 555
      RETURN p1.vertex_id, p2.vertex_id, p3.vertex_id, u1.vertex_id
    $$) as (p1 bigint, p2 bigint, p3 bigint, u1 bigint)
  ;`;
  secondHops.forEach((edge) => {
    const person2Id = "person_" + edge.p2;

    const person3Id = "person_" + edge.p3;
    if (!nodeIds.has(person3Id)) {
      nodeIds.add(person3Id);
      nodes.push(makeNode(person3Id, NodeLabel.PERSON));
    }

    const univId = "univ_" + edge.u1;
    if (!nodeIds.has(univId)) {
      nodeIds.add(univId);
      nodes.push(makeNode(univId, NodeLabel.UNIVERSITY));
    }

    edges.push(
      makeEdge(
        person2Id,
        person3Id,
        EdgeLabel.PERSON_KNOWS_PERSON
      ),
      makeEdge(
        person3Id,
        univId,
        EdgeLabel.PERSON_STUDYAT_UNIVERSITY
      )
    );
  });

  return { nodes, edges };
};
