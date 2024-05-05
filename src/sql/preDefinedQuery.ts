import { Sql } from "postgres";
import { ElementDefinition } from "cytoscape";

import { edgeColors, nodeColors } from "../utils/constant";
import { EdgeLabel, NodeLabel } from "../utils/types";

const nodeIds = new Set<string>();
let nodes: ElementDefinition[] = [];
const edgeIds = new Set<string>();
let edges: ElementDefinition[] = [];

const initialize = () => {
  nodeIds.clear();
  edgeIds.clear();
  nodes = [];
  edges = [];
};

const makeNode = (
  id: string,
  nodeLabel: NodeLabel
): ElementDefinition => ({
  data: {
    id: id,
    bg: nodeColors[nodeLabel],
  },
});
const addNode = (id: string, colorAs: NodeLabel) => {
  if (!nodeIds.has(id)) {
    nodeIds.add(id);
    nodes.push(makeNode(id, colorAs));
  }
};

const makeEdge = (
  sourceId: string,
  targetId: string,
  edgeLabel: EdgeLabel
): ElementDefinition => ({
  data: {
    id: sourceId + "_" + targetId,
    color: edgeColors[edgeLabel],
    source: sourceId,
    target: targetId,
  },
});
const addEdge = (
  sourceId: string,
  targetId: string,
  colorAs: EdgeLabel
) => {
  const id = sourceId + "_" + targetId;
  if (!edgeIds.has(id)) {
    edgeIds.add(id);
    edges.push(makeEdge(sourceId, targetId, colorAs));
  }
};

export const knowsQuery = async (sql: Sql) => {
  initialize();

  const fixedPerson = await sql`
    SELECT *
    FROM cypher($$
      MATCH (p1: person)-[l:person_studyat_university]->(u1: university)
      WHERE p1.vertex_id = 933
      RETURN p1.vertex_id, u1.vertex_id
    $$) as (p1 bigint, u1 bigint)
  ;`;
  fixedPerson.forEach((edge) => {
    const personId = "person_" + edge.p1;
    addNode(personId, NodeLabel.TAGCLASS);

    const univId = "univ_" + edge.u1;
    addNode(univId, NodeLabel.UNIVERSITY);

    addEdge(
      personId,
      univId,
      EdgeLabel.CITY_ISPARTOF_COUNTRY
    );
  });

  const firstHops = await sql`
    SELECT *
    FROM cypher($$
      MATCH (p1: person)-[k:person_knows_person]->(p2: person)-[l:person_studyat_university]->(u1: university)
      WHERE p1.vertex_id = 933
      RETURN p1.vertex_id, p2.vertex_id, u1.vertex_id
    $$) as (p1 bigint, p2 bigint, u1 bigint)
  ;`;
  firstHops.forEach((edge) => {
    const person1Id = "person_" + edge.p1;

    const person2Id = "person_" + edge.p2;
    addNode(person2Id, NodeLabel.TAG);

    const univId = "univ_" + edge.u1;
    addNode(univId, NodeLabel.UNIVERSITY);

    addEdge(
      person1Id,
      person2Id,
      EdgeLabel.PERSON_KNOWS_PERSON
    );
    addEdge(
      person2Id,
      univId,
      EdgeLabel.CITY_ISPARTOF_COUNTRY
    );
  });

  const secondHops = await sql`
    SELECT *
    FROM cypher($$
      MATCH (p1: person)-[k1:person_knows_person]->(p2: person)-[k2:person_knows_person]->(p3: person)-[l:person_studyat_university]->(u1: university)
      WHERE p1.vertex_id = 933
      RETURN p1.vertex_id, p2.vertex_id, p3.vertex_id, u1.vertex_id
    $$) as (p1 bigint, p2 bigint, p3 bigint, u1 bigint)
  ;`;
  secondHops.forEach((edge) => {
    const person1Id = "person_" + edge.p1;

    const person2Id = "person_" + edge.p2;
    addNode(person2Id, NodeLabel.TAG);

    const person3Id = "person_" + edge.p3;
    addNode(person3Id, NodeLabel.PERSON);

    const univId = "univ_" + edge.u1;
    addNode(univId, NodeLabel.UNIVERSITY);

    addEdge(
      person1Id,
      person2Id,
      EdgeLabel.PERSON_KNOWS_PERSON
    );
    addEdge(
      person2Id,
      person3Id,
      EdgeLabel.PERSON_KNOWS_PERSON
    );
    addEdge(
      person3Id,
      univId,
      EdgeLabel.CITY_ISPARTOF_COUNTRY
    );
  });

  // const thirdHops = await sql`
  //   SELECT *
  //   FROM cypher($$
  //     MATCH (p1: person)-[k1:person_knows_person]->(p2: person)-[k2:person_knows_person]->(p3: person)-[k3:person_knows_person]->(p4: person)-[l:person_studyat_university]->(u1: university)
  //     WHERE p1.vertex_id = 933
  //     RETURN p1.vertex_id, p2.vertex_id, p3.vertex_id, p4.vertex_id, u1.vertex_id
  //   $$) as (p1 bigint, p2 bigint, p3 bigint, p4 bigint, u1 bigint)
  // ;`;
  // thirdHops.forEach((edge) => {
  //   const person1Id = "person_" + edge.p1;

  //   const person2Id = "person_" + edge.p2;
  //   addNode(person2Id, NodeLabel.TAG);

  //   const person3Id = "person_" + edge.p3;
  //   addNode(person3Id, NodeLabel.PERSON);

  //   const person4Id = "person_" + edge.p4;
  //   addNode(person4Id, NodeLabel.FORUM);

  //   const univId = "univ_" + edge.u1;
  //   addNode(univId, NodeLabel.UNIVERSITY);

  //   addEdge(
  //     person1Id,
  //     person2Id,
  //     EdgeLabel.PERSON_KNOWS_PERSON
  //   );
  //   addEdge(
  //     person2Id,
  //     person3Id,
  //     EdgeLabel.PERSON_KNOWS_PERSON
  //   );
  //   addEdge(
  //     person3Id,
  //     person4Id,
  //     EdgeLabel.PERSON_KNOWS_PERSON
  //   );
  //   addEdge(
  //     person4Id,
  //     univId,
  //     EdgeLabel.CITY_ISPARTOF_COUNTRY
  //   );
  // });

  console.log("nodes: ", nodes.length);
  console.log("edges: ", edges.length);

  return [...nodes, ...edges];
};

export const likesQuery = async (sql: Sql) => {
  initialize();

  const likes = await sql`
    SELECT *
    FROM cypher($$
      MATCH (p1: person)-[l1:person_likes_message]->(m1: message)<-[l2:person_likes_message]-(p2: person)
      WHERE p1.vertex_id = 933
      RETURN p1.vertex_id, m1.vertex_id, p2.vertex_id
    $$) as (p1 bigint, m1 bigint, p2 bigint)
  ;`;
  likes.forEach((edge) => {
    const person1Id = "person_" + edge.p1;
    addNode(person1Id, NodeLabel.FORUM);

    const person2Id = "person_" + edge.p2;
    addNode(person2Id, NodeLabel.PERSON);

    const messageId = "message_" + edge.m1;
    addNode(messageId, NodeLabel.MESSAGE);

    addEdge(
      person1Id,
      messageId,
      EdgeLabel.PERSON_LIKES_MESSAGE
    );
    addEdge(
      person2Id,
      messageId,
      EdgeLabel.PERSON_LIKES_MESSAGE
    );
  });

  console.log("nodes: ", nodes.length);
  console.log("edges: ", edges.length);

  return [...nodes, ...edges];
};

export const hasMemberQuery = async (sql: Sql) => {
  initialize();

  const members = await sql`
    SELECT *
    FROM cypher($$
      MATCH (p1: person)<-[m1:forum_hasmember_person]-(f1: forum)-[m2:forum_hasmember_person]->(p2: person)
      WHERE p1.vertex_id = 933
      RETURN p1.vertex_id, f1.vertex_id, p2.vertex_id
    $$) as (p1 bigint, f1 bigint, p2 bigint)
  ;`;
  members.forEach((edge) => {
    const person1Id = "person_" + edge.p1;
    addNode(person1Id, NodeLabel.TAGCLASS);

    const person2Id = "person_" + edge.p2;
    addNode(person2Id, NodeLabel.PERSON);

    const forumId = "forum_" + edge.f1;
    addNode(forumId, NodeLabel.FORUM);

    addEdge(
      forumId,
      person1Id,
      EdgeLabel.FORUM_HASMEMBER_PERSON
    );
    addEdge(
      forumId,
      person2Id,
      EdgeLabel.FORUM_HASMEMBER_PERSON
    );
  });

  console.log("nodes: ", nodes.length);
  console.log("edges: ", edges.length);

  return [...nodes, ...edges];
};
