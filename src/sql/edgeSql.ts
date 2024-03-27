import { Sql } from "postgres";
import { ElementDefinition } from "cytoscape";

import { NodeLabel } from "../utils/types";

type GetEdgeFunctionType =
  typeof getCityIsPartOfCountryEdges;

export const getEdgeFunctionsByNodes = (
  nodeLabels: NodeLabel[],
  nodes?: { [x: string]: ElementDefinition[] }
) => {
  const edgeFunctions: [
    GetEdgeFunctionType,
    ElementDefinition[] | undefined,
    ElementDefinition[] | undefined
  ][] = [];

  // Edge: city_ispartof_country
  if (
    nodeLabels.includes(NodeLabel.CITY) &&
    nodeLabels.includes(NodeLabel.COUNTRY)
  )
    edgeFunctions.push([
      getCityIsPartOfCountryEdges,
      nodes?.[NodeLabel.CITY],
      nodes?.[NodeLabel.COUNTRY],
    ]);

  // Edge: country_ispartof_continent
  if (
    nodeLabels.includes(NodeLabel.COUNTRY) &&
    nodeLabels.includes(NodeLabel.CONTINENT)
  )
    edgeFunctions.push([
      getCountryIsPartOfContinentEdges,
      nodes?.[NodeLabel.COUNTRY],
      nodes?.[NodeLabel.CONTINENT],
    ]);

  // Edge: forum_containerof_message
  if (
    nodeLabels.includes(NodeLabel.FORUM) &&
    nodeLabels.includes(NodeLabel.MESSAGE)
  )
    edgeFunctions.push([
      getForumContainerOfMessageEdges,
      nodes?.[NodeLabel.FORUM],
      nodes?.[NodeLabel.MESSAGE],
    ]);

  // Edge: forum_hasmember_person
  // Edge: forum_hasmoderator_person
  if (
    nodeLabels.includes(NodeLabel.FORUM) &&
    nodeLabels.includes(NodeLabel.PERSON)
  ) {
    edgeFunctions.push([
      getForumHasMemberPersonEdges,
      nodes?.[NodeLabel.FORUM],
      nodes?.[NodeLabel.PERSON],
    ]);
    edgeFunctions.push([
      getForumHasModeratorPersonEdges,
      nodes?.[NodeLabel.FORUM],
      nodes?.[NodeLabel.PERSON],
    ]);
  }

  // Edge: forum_hastag_tag
  if (
    nodeLabels.includes(NodeLabel.FORUM) &&
    nodeLabels.includes(NodeLabel.TAG)
  )
    edgeFunctions.push([
      getForumHasTagTagEdges,
      nodes?.[NodeLabel.FORUM],
      nodes?.[NodeLabel.TAG],
    ]);

  // Edge: message_hascreator_person
  if (
    nodeLabels.includes(NodeLabel.MESSAGE) &&
    nodeLabels.includes(NodeLabel.PERSON)
  )
    edgeFunctions.push([
      getMessageHasCreatorPersonEdges,
      nodes?.[NodeLabel.MESSAGE],
      nodes?.[NodeLabel.PERSON],
    ]);

  // Edge: message_hastag_tag
  if (
    nodeLabels.includes(NodeLabel.MESSAGE) &&
    nodeLabels.includes(NodeLabel.TAG)
  )
    edgeFunctions.push([
      getMessageHasTagTagEdges,
      nodes?.[NodeLabel.MESSAGE],
      nodes?.[NodeLabel.TAG],
    ]);

  // Edge: message_replyof_message
  if (nodeLabels.includes(NodeLabel.MESSAGE))
    edgeFunctions.push([
      getMessageReplyOfMessageEdges,
      nodes?.[NodeLabel.MESSAGE],
      nodes?.[NodeLabel.MESSAGE],
    ]);

  // Edge: person_hasinterest_tag
  if (
    nodeLabels.includes(NodeLabel.PERSON) &&
    nodeLabels.includes(NodeLabel.TAG)
  )
    edgeFunctions.push([
      getPersonHasInterestTagEdges,
      nodes?.[NodeLabel.PERSON],
      nodes?.[NodeLabel.TAG],
    ]);

  // Edge: person_islocatedin_city
  if (
    nodeLabels.includes(NodeLabel.PERSON) &&
    nodeLabels.includes(NodeLabel.CITY)
  )
    edgeFunctions.push([
      getPersonIsLocatedInCityEdges,
      nodes?.[NodeLabel.PERSON],
      nodes?.[NodeLabel.CITY],
    ]);

  // Edge: person_knows_person
  if (nodeLabels.includes(NodeLabel.PERSON))
    edgeFunctions.push([
      getPersonKnowsPersonEdges,
      nodes?.[NodeLabel.PERSON],
      nodes?.[NodeLabel.PERSON],
    ]);

  // Edge: person_likes_message
  if (
    nodeLabels.includes(NodeLabel.PERSON) &&
    nodeLabels.includes(NodeLabel.MESSAGE)
  )
    edgeFunctions.push([
      getPersonLikesMessageEdges,
      nodes?.[NodeLabel.PERSON],
      nodes?.[NodeLabel.MESSAGE],
    ]);

  // Edge: person_studyat_university
  if (
    nodeLabels.includes(NodeLabel.PERSON) &&
    nodeLabels.includes(NodeLabel.UNIVERSITY)
  )
    edgeFunctions.push([
      getPersonStudyAtUniversityEdges,
      nodes?.[NodeLabel.PERSON],
      nodes?.[NodeLabel.UNIVERSITY],
    ]);

  // Edge: person_workat_company
  if (
    nodeLabels.includes(NodeLabel.PERSON) &&
    nodeLabels.includes(NodeLabel.COMPANY)
  )
    edgeFunctions.push([
      getPersonWorkAtCompanyEdges,
      nodes?.[NodeLabel.PERSON],
      nodes?.[NodeLabel.COMPANY],
    ]);

  // Edge: tag_hastype_tc
  if (
    nodeLabels.includes(NodeLabel.TAG) &&
    nodeLabels.includes(NodeLabel.TAGCLASS)
  )
    edgeFunctions.push([
      getTagHasTypeTagclassEdges,
      nodes?.[NodeLabel.TAG],
      nodes?.[NodeLabel.TAGCLASS],
    ]);

  // Edge: tc_issubclassof_tc
  if (nodeLabels.includes(NodeLabel.TAGCLASS))
    edgeFunctions.push([
      getTagclassIsSubclassOfTagclassEdges,
      nodes?.[NodeLabel.TAGCLASS],
      nodes?.[NodeLabel.TAGCLASS],
    ]);

  return edgeFunctions;
};

async function getCityIsPartOfCountryEdges(
  sql: Sql,
  cityNodes?: ElementDefinition[],
  countryNodes?: ElementDefinition[]
) {
  const isSampled =
    cityNodes !== undefined && countryNodes !== undefined;
  const cityIds = cityNodes!.map((city) =>
    Number(city.data.id!.split("_")[1])
  );
  const countryIds = countryNodes!.map((country) =>
    Number(country.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: city)-[k:city_ispartof_country]->(n2: country)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isSampled
        ? sql`WHERE source IN ${sql(cityIds)} 
              AND target IN ${sql(countryIds)}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      source: "city_" + edge.source,
      target: "country_" + edge.target,
    },
  }));
}

async function getCountryIsPartOfContinentEdges(
  sql: Sql,
  countryNodes?: ElementDefinition[],
  continentNodes?: ElementDefinition[]
) {
  const isSampled =
    countryNodes !== undefined &&
    continentNodes !== undefined;
  const countryIds = countryNodes!.map((country) =>
    Number(country.data.id!.split("_")[1])
  );
  const continentIds = continentNodes!.map((continent) =>
    Number(continent.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: country)-[k:country_ispartof_continent]->(n2: continent)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isSampled
        ? sql`WHERE source IN ${sql(countryIds)} 
              AND target IN ${sql(continentIds)}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      source: "country_" + edge.source,
      target: "continent_" + edge.target,
    },
  }));
}

async function getForumContainerOfMessageEdges(
  sql: Sql,
  forumNodes?: ElementDefinition[],
  messageNodes?: ElementDefinition[]
) {
  const isSampled =
    forumNodes !== undefined && messageNodes !== undefined;
  const forumIds = forumNodes!.map((forum) =>
    Number(forum.data.id!.split("_")[1])
  );
  const messageIds = messageNodes!.map((message) =>
    Number(message.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: forum)-[k:forum_containerof_message]->(n2: message)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isSampled
        ? sql`WHERE source IN ${sql(forumIds)} 
              AND target IN ${sql(messageIds)}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      source: "forum_" + edge.source,
      target: "message_" + edge.target,
    },
  }));
}

async function getForumHasMemberPersonEdges(
  sql: Sql,
  forumNodes?: ElementDefinition[],
  personNodes?: ElementDefinition[]
) {
  const isSampled =
    forumNodes !== undefined && personNodes !== undefined;
  const forumIds = forumNodes!.map((forum) =>
    Number(forum.data.id!.split("_")[1])
  );
  const personIds = personNodes!.map((person) =>
    Number(person.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: forum)-[k:forum_hasmember_person]->(n2: person)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isSampled
        ? sql`WHERE source IN ${sql(forumIds)} 
              AND target IN ${sql(personIds)}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      source: "forum_" + edge.source,
      target: "person_" + edge.target,
    },
  }));
}

async function getForumHasModeratorPersonEdges(
  sql: Sql,
  forumNodes?: ElementDefinition[],
  personNodes?: ElementDefinition[]
) {
  const isSampled =
    forumNodes !== undefined && personNodes !== undefined;
  const forumIds = forumNodes!.map((forum) =>
    Number(forum.data.id!.split("_")[1])
  );
  const personIds = personNodes!.map((person) =>
    Number(person.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: forum)-[k:forum_hasmoderator_person]->(n2: person)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isSampled
        ? sql`WHERE source IN ${sql(forumIds)} 
              AND target IN ${sql(personIds)}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      source: "forum_" + edge.source,
      target: "person_" + edge.target,
    },
  }));
}

async function getForumHasTagTagEdges(
  sql: Sql,
  forumNodes?: ElementDefinition[],
  tagNodes?: ElementDefinition[]
) {
  const isSampled =
    forumNodes !== undefined && tagNodes !== undefined;
  const forumIds = forumNodes!.map((forum) =>
    Number(forum.data.id!.split("_")[1])
  );
  const tagIds = tagNodes!.map((tag) =>
    Number(tag.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: forum)-[k:forum_hastag_tag]->(n2: tag)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isSampled
        ? sql`WHERE source IN ${sql(forumIds)} 
              AND target IN ${sql(tagIds)}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      source: "forum_" + edge.source,
      target: "tag_" + edge.target,
    },
  }));
}

async function getMessageHasCreatorPersonEdges(
  sql: Sql,
  messageNodes?: ElementDefinition[],
  personNodes?: ElementDefinition[]
) {
  const isSampled =
    messageNodes !== undefined && personNodes !== undefined;
  const messageIds = messageNodes!.map((message) =>
    Number(message.data.id!.split("_")[1])
  );
  const personIds = personNodes!.map((person) =>
    Number(person.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: message)-[k:message_hascreator_person]->(n2: person)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isSampled
        ? sql`WHERE source IN ${sql(messageIds)} 
              AND target IN ${sql(personIds)}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      source: "message_" + edge.source,
      target: "person_" + edge.target,
    },
  }));
}

async function getMessageHasTagTagEdges(
  sql: Sql,
  messageNodes?: ElementDefinition[],
  tagNodes?: ElementDefinition[]
) {
  const isSampled =
    messageNodes !== undefined && tagNodes !== undefined;
  const messageIds = messageNodes!.map((message) =>
    Number(message.data.id!.split("_")[1])
  );
  const tagIds = tagNodes!.map((tag) =>
    Number(tag.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: message)-[k:message_hastag_tag]->(n2: tag)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isSampled
        ? sql`WHERE source IN ${sql(messageIds)} 
              AND target IN ${sql(tagIds)}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      source: "message_" + edge.source,
      target: "tag_" + edge.target,
    },
  }));
}

async function getMessageReplyOfMessageEdges(
  sql: Sql,
  messageNodes1?: ElementDefinition[],
  messageNodes2?: ElementDefinition[]
) {
  const isSampled =
    messageNodes1 !== undefined &&
    messageNodes2 !== undefined;
  const messageIds1 = messageNodes1!.map((message) =>
    Number(message.data.id!.split("_")[1])
  );
  const messageIds2 = messageNodes2!.map((tag) =>
    Number(tag.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: message)-[k:message_replyof_message]->(n2: message)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isSampled
        ? sql`WHERE source IN ${sql(messageIds1)} 
              AND target IN ${sql(messageIds2)}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      source: "message_" + edge.source,
      target: "message_" + edge.target,
    },
  }));
}

async function getPersonHasInterestTagEdges(
  sql: Sql,
  personNodes?: ElementDefinition[],
  tagNodes?: ElementDefinition[]
) {
  const isSampled =
    personNodes !== undefined && tagNodes !== undefined;
  const personIds = personNodes!.map((person) =>
    Number(person.data.id!.split("_")[1])
  );
  const tagIds = tagNodes!.map((tag) =>
    Number(tag.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: person)-[k:person_hasinterest_tag]->(n2: tag)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isSampled
        ? sql`WHERE source IN ${sql(personIds)} 
              AND target IN ${sql(tagIds)}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      source: "person_" + edge.source,
      target: "tag_" + edge.target,
    },
  }));
}

async function getPersonIsLocatedInCityEdges(
  sql: Sql,
  personNodes?: ElementDefinition[],
  cityNodes?: ElementDefinition[]
) {
  const isSampled =
    personNodes !== undefined && cityNodes !== undefined;
  const personIds = personNodes!.map((person) =>
    Number(person.data.id!.split("_")[1])
  );
  const cityIds = cityNodes!.map((city) =>
    Number(city.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: person)-[k:person_islocatedin_city]->(n2: city)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isSampled
        ? sql`WHERE source IN ${sql(personIds)} 
              AND target IN ${sql(cityIds)}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      source: "person_" + edge.source,
      target: "city_" + edge.target,
    },
  }));
}

async function getPersonKnowsPersonEdges(
  sql: Sql,
  personNodes1?: ElementDefinition[],
  personNodes2?: ElementDefinition[]
) {
  const isSampled =
    personNodes1 !== undefined &&
    personNodes2 !== undefined;
  const personIds1 = personNodes1!.map((person) =>
    Number(person.data.id!.split("_")[1])
  );
  const personIds2 = personNodes2!.map((person) =>
    Number(person.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: person)-[k:person_knows_person]->(n2: person)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isSampled
        ? sql`WHERE source IN ${sql(personIds1)} 
              AND target IN ${sql(personIds2)}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      source: "person_" + edge.source,
      target: "person_" + edge.target,
    },
  }));
}

// person_likes_message
async function getPersonLikesMessageEdges(
  sql: Sql,
  personNodes?: ElementDefinition[],
  messageNodes?: ElementDefinition[]
) {
  const isSampled =
    personNodes !== undefined && messageNodes !== undefined;
  const personIds = personNodes!.map((person) =>
    Number(person.data.id!.split("_")[1])
  );
  const messageIds = messageNodes!.map((message) =>
    Number(message.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: person)-[k:person_likes_message]->(n2: message)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isSampled
        ? sql`WHERE source IN ${sql(personIds)} 
              AND target IN ${sql(messageIds)}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      source: "person_" + edge.source,
      target: "message_" + edge.target,
    },
  }));
}

// person_studyat_university
async function getPersonStudyAtUniversityEdges(
  sql: Sql,
  personNodes?: ElementDefinition[],
  universityNodes?: ElementDefinition[]
) {
  const isSampled =
    personNodes !== undefined &&
    universityNodes !== undefined;
  const personIds = personNodes!.map((person) =>
    Number(person.data.id!.split("_")[1])
  );
  const universityIds = universityNodes!.map((university) =>
    Number(university.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: person)-[k:person_studyat_university]->(n2: university)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isSampled
        ? sql`WHERE source IN ${sql(personIds)} 
              AND target IN ${sql(universityIds)}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      source: "person_" + edge.source,
      target: "university_" + edge.target,
    },
  }));
}

// person_workat_company
async function getPersonWorkAtCompanyEdges(
  sql: Sql,
  personNodes?: ElementDefinition[],
  companyNodes?: ElementDefinition[]
) {
  const isSampled =
    personNodes !== undefined && companyNodes !== undefined;
  const personIds = personNodes!.map((person) =>
    Number(person.data.id!.split("_")[1])
  );
  const companyIds = companyNodes!.map((company) =>
    Number(company.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: person)-[k:person_workat_company]->(n2: company)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isSampled
        ? sql`WHERE source IN ${sql(personIds)} 
              AND target IN ${sql(companyIds)}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      source: "person_" + edge.source,
      target: "company_" + edge.target,
    },
  }));
}

// tag_hastype_tc
async function getTagHasTypeTagclassEdges(
  sql: Sql,
  tagNodes?: ElementDefinition[],
  tcNodes?: ElementDefinition[]
) {
  const isSampled =
    tagNodes !== undefined && tcNodes !== undefined;
  const tagIds = tagNodes!.map((tag) =>
    Number(tag.data.id!.split("_")[1])
  );
  const tcIds = tcNodes!.map((tc) =>
    Number(tc.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: tag)-[k:tag_hastype_tc]->(n2: tagclass)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isSampled
        ? sql`WHERE source IN ${sql(tagIds)} 
              AND target IN ${sql(tcIds)}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      source: "tag_" + edge.source,
      target: "tagclass_" + edge.target,
    },
  }));
}

// tc_issubclassof_tc
async function getTagclassIsSubclassOfTagclassEdges(
  sql: Sql,
  tcNodes1?: ElementDefinition[],
  tcNodes2?: ElementDefinition[]
) {
  const isSampled =
    tcNodes1 !== undefined && tcNodes2 !== undefined;
  const tcIds1 = tcNodes1!.map((tc) =>
    Number(tc.data.id!.split("_")[1])
  );
  const tcIds2 = tcNodes2!.map((tc) =>
    Number(tc.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: tagclass)-[k:tc_issubclassof_tc]->(n2: tagclass)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isSampled
        ? sql`WHERE source IN ${sql(tcIds1)} 
              AND target IN ${sql(tcIds2)}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      source: "tagclass_" + edge.source,
      target: "tagclass_" + edge.target,
    },
  }));
}

export async function getPersonKnowsPersonEdgesNoLimit(
  sql: Sql
) {
  const edges = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1:person)-[k:person_knows_person]->(n2:person)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint);`;

  return edges.map((edge) => ({
    data: {
      source: "person_" + edge.source,
      target: "person_" + edge.target,
    },
  }));
}
