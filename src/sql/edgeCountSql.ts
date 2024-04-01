import { Sql } from "postgres";

import { EdgeLabel } from "../utils/types";

type CountFunction = typeof getCityIsPartOfCountryEdgeCount;
export const edgeCountFunctionMap: {
  [x in EdgeLabel]: CountFunction;
} = {
  [EdgeLabel.CITY_ISPARTOF_COUNTRY]:
    getCityIsPartOfCountryEdgeCount,
  [EdgeLabel.COUNTRY_ISPARTOF_CONTINENT]:
    getCountryIsPartOfContinentEdgeCount,
  [EdgeLabel.FORUM_CONTAINEROF_MESSAGE]:
    getForumContainerOfMessageEdgeCount,
  [EdgeLabel.FORUM_HASMEMBER_PERSON]:
    getForumHasMemberPersonEdgeCount,
  [EdgeLabel.FORUM_HASMODERATOR_PERSON]:
    getForumHasModeratorPersonEdgeCount,
  [EdgeLabel.FORUM_HASTAG_TAG]: getForumHasTagTagEdgeCount,
  [EdgeLabel.MESSAGE_HASCREATOR_PERSON]:
    getMessageHasCreatorPersonEdgeCount,
  [EdgeLabel.MESSAGE_HASTAG_TAG]:
    getMessageHasTagTagEdgeCount,
  [EdgeLabel.MESSAGE_REPLYOF_MESSAGE]:
    getMessageReplyOfMessageEdgeCount,
  [EdgeLabel.PERSON_HASINTEREST_TAG]:
    getPersonHasInterestTagEdgeCount,
  [EdgeLabel.PERSON_ISLOCATEDIN_CITY]:
    getPersonIsLocatedInCityEdgeCount,
  [EdgeLabel.PERSON_KNOWS_PERSON]:
    getPersonKnowsPersonEdgeCount,
  [EdgeLabel.PERSON_LIKES_MESSAGE]:
    getPersonLikesMessageEdgeCount,
  [EdgeLabel.PERSON_STUDYAT_UNIVERSITY]:
    getPersonStudyAtUniversityEdgeCount,
  [EdgeLabel.PERSON_WORKAT_COMPANY]:
    getPersonWorkAtCompanyEdgeCount,
  [EdgeLabel.TAG_HASTYPE_TC]:
    getTagHasTypeTagclassEdgeCount,
  [EdgeLabel.TC_ISSUBCLASSOF_TC]:
    getTagclassIsSubclassOfTagclassEdgeCount,
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
