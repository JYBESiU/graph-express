import { Sql } from "postgres";
import { NodeLabel } from "../utils/types";

type GetEdgeCountFunctionType =
  typeof getCityIsPartOfCountryEdgeCount;

export const getEdgeCountFunctionsByNodes = (
  nodeLabels: NodeLabel[]
) => {
  const edgeFunctions: [
    GetEdgeCountFunctionType,
    string
  ][] = [];

  // Edge: city_ispartof_country
  if (
    nodeLabels.includes(NodeLabel.CITY) &&
    nodeLabels.includes(NodeLabel.COUNTRY)
  )
    edgeFunctions.push([
      getCityIsPartOfCountryEdgeCount,
      "city_ispartof_country",
    ]);

  // Edge: country_ispartof_continent
  if (
    nodeLabels.includes(NodeLabel.COUNTRY) &&
    nodeLabels.includes(NodeLabel.CONTINENT)
  )
    edgeFunctions.push([
      getCountryIsPartOfContinentEdgeCount,
      "country_ispartof_continent",
    ]);

  // Edge: forum_containerof_message
  if (
    nodeLabels.includes(NodeLabel.FORUM) &&
    nodeLabels.includes(NodeLabel.MESSAGE)
  )
    edgeFunctions.push([
      getForumContainerOfMessageEdgeCount,
      "forum_containerof_message",
    ]);

  // Edge: forum_hasmember_person
  // Edge: forum_hasmoderator_person
  if (
    nodeLabels.includes(NodeLabel.FORUM) &&
    nodeLabels.includes(NodeLabel.PERSON)
  )
    edgeFunctions.push(
      [
        getForumHasMemberPersonEdgeCount,
        "forum_hasmember_person",
      ],
      [
        getForumHasModeratorPersonEdgeCount,
        "forum_hasmoderator_person",
      ]
    );

  // Edge: forum_hastag_tag
  if (
    nodeLabels.includes(NodeLabel.FORUM) &&
    nodeLabels.includes(NodeLabel.TAG)
  )
    edgeFunctions.push([
      getForumHasTagTagEdgeCount,
      "forum_hastag_tag",
    ]);

  // Edge: message_hascreator_person
  if (
    nodeLabels.includes(NodeLabel.MESSAGE) &&
    nodeLabels.includes(NodeLabel.PERSON)
  )
    edgeFunctions.push([
      getMessageHasCreatorPersonEdgeCount,
      "message_hascreator_person",
    ]);

  // Edge: message_hastag_tag
  if (
    nodeLabels.includes(NodeLabel.MESSAGE) &&
    nodeLabels.includes(NodeLabel.TAG)
  )
    edgeFunctions.push([
      getMessageHasTagTagEdgeCount,
      "message_hastag_tag",
    ]);

  // Edge: message_replyof_message
  if (nodeLabels.includes(NodeLabel.MESSAGE))
    edgeFunctions.push([
      getMessageReplyOfMessageEdgeCount,
      "message_replyof_message",
    ]);

  // Edge: person_hasinterest_tag
  if (
    nodeLabels.includes(NodeLabel.PERSON) &&
    nodeLabels.includes(NodeLabel.TAG)
  )
    edgeFunctions.push([
      getPersonHasInterestTagEdgeCount,
      "person_hasinterest_tag",
    ]);

  // Edge: person_islocatedin_city
  if (
    nodeLabels.includes(NodeLabel.PERSON) &&
    nodeLabels.includes(NodeLabel.CITY)
  )
    edgeFunctions.push([
      getPersonIsLocatedInCityEdgeCount,
      "person_islocatedin_city",
    ]);

  // Edge: person_knows_person
  if (nodeLabels.includes(NodeLabel.PERSON))
    edgeFunctions.push([
      getPersonKnowsPersonEdgeCount,
      "person_knows_person",
    ]);

  // Edge: person_likes_message
  if (
    nodeLabels.includes(NodeLabel.PERSON) &&
    nodeLabels.includes(NodeLabel.MESSAGE)
  )
    edgeFunctions.push([
      getPersonLikesMessageEdgeCount,
      "person_likes_message",
    ]);

  // Edge: person_studyat_university
  if (
    nodeLabels.includes(NodeLabel.PERSON) &&
    nodeLabels.includes(NodeLabel.UNIVERSITY)
  )
    edgeFunctions.push([
      getPersonStudyAtUniversityEdgeCount,
      "person_studyat_university",
    ]);

  // Edge: person_workat_company
  if (
    nodeLabels.includes(NodeLabel.PERSON) &&
    nodeLabels.includes(NodeLabel.COMPANY)
  )
    edgeFunctions.push([
      getPersonWorkAtCompanyEdgeCount,
      "person_workat_company",
    ]);

  // Edge: tag_hastype_tc
  if (
    nodeLabels.includes(NodeLabel.TAG) &&
    nodeLabels.includes(NodeLabel.TAGCLASS)
  )
    edgeFunctions.push([
      getTagHasTypeTagclassEdgeCount,
      "tag_hastype_tc",
    ]);

  // Edge: tc_issubclassof_tc
  if (nodeLabels.includes(NodeLabel.TAGCLASS))
    edgeFunctions.push([
      getTagclassIsSubclassOfTagclassEdgeCount,
      "tc_issubclassof_tc",
    ]);

  return edgeFunctions;
};

async function getCityIsPartOfCountryEdgeCount(sql: Sql) {
  const count = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: city)-[k:city_ispartof_country]->(n2: country)
      RETURN count(n1.vertex_id) as count
    $$) as (count bigint);`;

  return Number(count[0].count);
}

async function getCountryIsPartOfContinentEdgeCount(
  sql: Sql
) {
  const count = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: country)-[k:country_ispartof_continent]->(n2: continent)
      RETURN count(n1.vertex_id) as count
    $$) as (count bigint);`;

  return Number(count[0].count);
}

async function getForumContainerOfMessageEdgeCount(
  sql: Sql
) {
  const count = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: forum)-[k:forum_containerof_message]->(n2: message)
      RETURN count(n1.vertex_id) as count
    $$) as (count bigint);`;

  return Number(count[0].count);
}

async function getForumHasMemberPersonEdgeCount(sql: Sql) {
  const count = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: forum)-[k:forum_hasmember_person]->(n2: person)
      RETURN count(n1.vertex_id) as count
    $$) as (count bigint);`;

  return Number(count[0].count);
}

async function getForumHasModeratorPersonEdgeCount(
  sql: Sql
) {
  const count = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: forum)-[k:forum_hasmoderator_person]->(n2: person)
      RETURN count(n1.vertex_id) as count
    $$) as (count bigint);`;

  return Number(count[0].count);
}

async function getForumHasTagTagEdgeCount(sql: Sql) {
  const count = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: forum)-[k:forum_hastag_tag]->(n2: tag)
      RETURN count(n1.vertex_id) as count
    $$) as (count bigint);`;

  return Number(count[0].count);
}

async function getMessageHasCreatorPersonEdgeCount(
  sql: Sql
) {
  const count = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: message)-[k:message_hascreator_person]->(n2: person)
      RETURN count(n1.vertex_id) as count
    $$) as (count bigint);`;

  return Number(count[0].count);
}

async function getMessageHasTagTagEdgeCount(sql: Sql) {
  const count = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: message)-[k:message_hastag_tag]->(n2: tag)
      RETURN count(n1.vertex_id) as count
    $$) as (count bigint);`;

  return Number(count[0].count);
}

async function getMessageReplyOfMessageEdgeCount(sql: Sql) {
  const count = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: message)-[k:message_replyof_message]->(n2: message)
      RETURN count(n1.vertex_id) as count
    $$) as (count bigint);`;

  return Number(count[0].count);
}

async function getPersonHasInterestTagEdgeCount(sql: Sql) {
  const count = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: person)-[k:person_hasinterest_tag]->(n2: tag)
      RETURN count(n1.vertex_id) as count
    $$) as (count bigint);`;

  return Number(count[0].count);
}

async function getPersonIsLocatedInCityEdgeCount(sql: Sql) {
  const count = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: person)-[k:person_islocatedin_city]->(n2: city)
      RETURN count(n1.vertex_id) as count
    $$) as (count bigint);`;

  return Number(count[0].count);
}

async function getPersonKnowsPersonEdgeCount(sql: Sql) {
  const count = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: person)-[k:person_knows_person]->(n2: person)
      RETURN count(n1.vertex_id) as count
    $$) as (count bigint);`;

  return Number(count[0].count);
}

async function getPersonLikesMessageEdgeCount(sql: Sql) {
  const count = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: person)-[k:person_likes_message]->(n2: message)
      RETURN count(n1.vertex_id) as count
    $$) as (count bigint);`;

  return Number(count[0].count);
}

async function getPersonStudyAtUniversityEdgeCount(
  sql: Sql
) {
  const count = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: person)-[k:person_studyat_university]->(n2: university)
      RETURN count(n1.vertex_id) as count
    $$) as (count bigint);`;

  return Number(count[0].count);
}

async function getPersonWorkAtCompanyEdgeCount(sql: Sql) {
  const count = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: person)-[k:person_workat_company]->(n2: company)
      RETURN count(n1.vertex_id) as count
    $$) as (count bigint);`;

  return Number(count[0].count);
}

async function getTagHasTypeTagclassEdgeCount(sql: Sql) {
  const count = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: tag)-[k:tag_hastype_tc]->(n2: tagclass)
      RETURN count(n1.vertex_id) as count
    $$) as (count bigint);`;

  return Number(count[0].count);
}

async function getTagclassIsSubclassOfTagclassEdgeCount(
  sql: Sql
) {
  const count = await sql`
    SELECT *
    FROM cypher($$
      MATCH (n1: tagclass)-[k:tc_issubclassof_tc]->(n2: tagclass)
      RETURN count(n1.vertex_id) as count
    $$) as (count bigint);`;

  return Number(count[0].count);
}
