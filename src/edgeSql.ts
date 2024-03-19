import { Sql } from "postgres";

import { NodeLabel } from "./types";

type GetEdgeFunctionType =
  typeof getCityIsPartOfCountryEdges;

export const getEdgesFunctionsByNodes = (
  nodeLabels: NodeLabel[]
) => {
  const edgeFunctions: GetEdgeFunctionType[] = [];

  // Edge: city_ispartof_country
  if (
    nodeLabels.includes(NodeLabel.CITY) &&
    nodeLabels.includes(NodeLabel.COUNTRY)
  )
    edgeFunctions.push(getCityIsPartOfCountryEdges);

  // Edge: country_ispartof_continent
  if (
    nodeLabels.includes(NodeLabel.COUNTRY) &&
    nodeLabels.includes(NodeLabel.CONTINENT)
  )
    edgeFunctions.push(getCountryIsPartOfContinentEdges);

  // Edge: forum_containerof_message
  if (
    nodeLabels.includes(NodeLabel.FORUM) &&
    nodeLabels.includes(NodeLabel.MESSAGE)
  )
    edgeFunctions.push(getForumContainerOfMessageEdges);

  // Edge: forum_hasmember_person
  // Edge: forum_hasmoderator_person

  if (
    nodeLabels.includes(NodeLabel.FORUM) &&
    nodeLabels.includes(NodeLabel.PERSON)
  ) {
    edgeFunctions.push(getForumHasMemberPersonEdges);
    edgeFunctions.push(getForumHasModeratorPersonEdges);
  }

  // Edge: forum_hastag_tag
  if (
    nodeLabels.includes(NodeLabel.FORUM) &&
    nodeLabels.includes(NodeLabel.TAG)
  )
    edgeFunctions.push(getForumHasTagTagEdges);

  // Edge: message_hascreator_person
  if (
    nodeLabels.includes(NodeLabel.MESSAGE) &&
    nodeLabels.includes(NodeLabel.PERSON)
  )
    edgeFunctions.push(getMessageHasCreatorPersonEdges);

  // Edge: message_hastag_tag
  if (
    nodeLabels.includes(NodeLabel.MESSAGE) &&
    nodeLabels.includes(NodeLabel.TAG)
  )
    edgeFunctions.push(getMessageHasTagTagEdges);

  // Edge: message_replyof_message
  if (nodeLabels.includes(NodeLabel.MESSAGE))
    edgeFunctions.push(getMessageReplyOfMessageEdges);

  // Edge: person_hasinterest_tag
  if (
    nodeLabels.includes(NodeLabel.PERSON) &&
    nodeLabels.includes(NodeLabel.TAG)
  )
    edgeFunctions.push(getPersonHasInterestTagEdges);

  // Edge: person_knows_person
  if (nodeLabels.includes(NodeLabel.PERSON))
    edgeFunctions.push(getPersonKnowsPersonEdges);

  // Edge: person_likes_message
  if (
    nodeLabels.includes(NodeLabel.PERSON) &&
    nodeLabels.includes(NodeLabel.MESSAGE)
  )
    edgeFunctions.push(getPersonLikesMessageEdges);

  // Edge: person_studyat_university
  if (
    nodeLabels.includes(NodeLabel.PERSON) &&
    nodeLabels.includes(NodeLabel.UNIVERSITY)
  )
    edgeFunctions.push(getPersonStudyAtUniversityEdges);

  // Edge: person_workat_company
  if (
    nodeLabels.includes(NodeLabel.PERSON) &&
    nodeLabels.includes(NodeLabel.COMPANY)
  )
    edgeFunctions.push(getPersonWorkAtCompanyEdges);

  // Edge: tag_hastype_tc
  if (
    nodeLabels.includes(NodeLabel.TAG) &&
    nodeLabels.includes(NodeLabel.TAGCLASS)
  )
    edgeFunctions.push(getTagHasTypeTagclassEdges);

  // Edge: tc_issubclassof_tc
  if (nodeLabels.includes(NodeLabel.TAGCLASS))
    edgeFunctions.push(
      getTagclassIsSubclassOfTagclassEdges
    );

  return edgeFunctions;
};

async function getCityIsPartOfCountryEdges(sql: Sql) {
  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: city)-[k:city_ispartof_country]->(n2: country)
      where n1.vertex_id < 300 and n2.vertex_id < 30
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint);`;

  return edges.map((edge) => ({
    data: {
      source: "city_" + edge.source,
      target: "country_" + edge.target,
    },
  }));
}

async function getCountryIsPartOfContinentEdges(sql: Sql) {
  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: country)-[k:country_ispartof_continent]->(n2: continent)
      where n1.vertex_id < 30
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint);`;

  return edges.map((edge) => ({
    data: {
      source: "country_" + edge.source,
      target: "continent_" + edge.target,
    },
  }));
}

async function getForumContainerOfMessageEdges(sql: Sql) {
  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: forum)-[k:forum_containerof_message]->(n2: message)
      where n1.vertex_id < 1000 and n2.vertex_id  < 100000
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint);`;

  return edges.map((edge) => ({
    data: {
      source: "forum_" + edge.source,
      target: "message_" + edge.target,
    },
  }));
}

async function getForumHasMemberPersonEdges(sql: Sql) {
  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: forum)-[k:forum_hasmember_person]->(n2: person)
      where n1.vertex_id < 1000 and n2.vertex_id  < 2000
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint);`;

  return edges.map((edge) => ({
    data: {
      source: "forum_" + edge.source,
      target: "person_" + edge.target,
    },
  }));
}

async function getForumHasModeratorPersonEdges(sql: Sql) {
  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: forum)-[k:forum_hasmoderator_person]->(n2: person)
      where n1.vertex_id < 1000 and n2.vertex_id  < 2000
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint);`;

  return edges.map((edge) => ({
    data: {
      source: "forum_" + edge.source,
      target: "person_" + edge.target,
    },
  }));
}

async function getForumHasTagTagEdges(sql: Sql) {
  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: forum)-[k:forum_hastag_tag]->(n2: tag)
      where n1.vertex_id < 1000 and n2.vertex_id  < 100
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint);`;

  return edges.map((edge) => ({
    data: {
      source: "forum_" + edge.source,
      target: "tag_" + edge.target,
    },
  }));
}

async function getMessageHasCreatorPersonEdges(sql: Sql) {
  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: message)-[k:message_hascreator_person]->(n2: person)
      where n1.vertex_id < 100000 and n2.vertex_id < 2000
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint);`;

  return edges.map((edge) => ({
    data: {
      source: "message_" + edge.source,
      target: "person_" + edge.target,
    },
  }));
}

async function getMessageHasTagTagEdges(sql: Sql) {
  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: message)-[k:message_hastag_tag]->(n2: tag)
      where n1.vertex_id < 100000 and n2.vertex_id < 100
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint);`;

  return edges.map((edge) => ({
    data: {
      source: "message_" + edge.source,
      target: "tag_" + edge.target,
    },
  }));
}

async function getMessageReplyOfMessageEdges(sql: Sql) {
  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: message)-[k:message_replyof_message]->(n2: message)
      where n1.vertex_id < 100000 and n2.vertex_id < 100000
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint);`;

  return edges.map((edge) => ({
    data: {
      source: "message_" + edge.source,
      target: "message_" + edge.target,
    },
  }));
}

async function getPersonHasInterestTagEdges(sql: Sql) {
  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: person)-[k:person_hasinterest_tag]->(n2: tag)
      where n1.vertex_id < 2000 and n2.vertex_id < 100
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint);`;

  return edges.map((edge) => ({
    data: {
      source: "person_" + edge.source,
      target: "tag_" + edge.target,
    },
  }));
}

async function getPersonIsLocatedInCityEdges(sql: Sql) {
  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: person)-[k:person_islocatedin_city]->(n2: city)
      where n1.vertex_id < 2000 and n2.vertex_id < 300
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint);`;

  return edges.map((edge) => ({
    data: {
      source: "person_" + edge.source,
      target: "city_" + edge.target,
    },
  }));
}

async function getPersonKnowsPersonEdges(sql: Sql) {
  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1:person)-[k:person_knows_person]->(n2:person)
      where n1.vertex_id < 2000 and n2.vertex_id < 2000
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint);`;

  return edges.map((edge) => ({
    data: {
      source: "person_" + edge.source,
      target: "person_" + edge.target,
    },
  }));
}

async function getPersonLikesMessageEdges(sql: Sql) {
  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1:person)-[k:person_likes_message]->(n2:message)
      where n1.vertex_id < 2000 and n2.vertex_id < 100000
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint);`;

  return edges.map((edge) => ({
    data: {
      source: "person_" + edge.source,
      target: "message_" + edge.target,
    },
  }));
}

async function getPersonStudyAtUniversityEdges(sql: Sql) {
  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1:person)-[k:person_studyat_university]->(n2:university)
      where n1.vertex_id < 2000 and n2.vertex_id < 1600
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint);`;

  return edges.map((edge) => ({
    data: {
      source: "person_" + edge.source,
      target: "university_" + edge.target,
    },
  }));
}

async function getPersonWorkAtCompanyEdges(sql: Sql) {
  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1:person)-[k:person_workat_company]->(n2:company)
      where n1.vertex_id < 2000 and n2.vertex_id < 300
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint);`;

  return edges.map((edge) => ({
    data: {
      source: "person_" + edge.source,
      target: "company_" + edge.target,
    },
  }));
}

async function getTagHasTypeTagclassEdges(sql: Sql) {
  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1:tag)-[k:tag_hastype_tc]->(n2:tagclass)
      where n1.vertex_id < 100 and n2.vertex_id < 100
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint);`;

  return edges.map((edge) => ({
    data: {
      source: "tag_" + edge.source,
      target: "tagclass_" + edge.target,
    },
  }));
}

async function getTagclassIsSubclassOfTagclassEdges(
  sql: Sql
) {
  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1:tagclass)-[k:tc_issubclassof_tc]->(n2:tagclass)
      where n1.vertex_id < 100 and n2.vertex_id < 100
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint);`;

  return edges.map((edge) => ({
    data: {
      source: "tagclass_" + edge.source,
      target: "tagclass_" + edge.target,
    },
  }));
}
