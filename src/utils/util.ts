import { NodeLabel, EdgeLabel } from "./types";

export function getEdgeLableByNodeLabel(
  nodeLabels: NodeLabel[]
) {
  const edgeLabels: EdgeLabel[] = [];

  if (
    nodeLabels.includes(NodeLabel.CITY) &&
    nodeLabels.includes(NodeLabel.COUNTRY)
  )
    edgeLabels.push(EdgeLabel.CITY_ISPARTOF_COUNTRY);

  if (
    nodeLabels.includes(NodeLabel.COUNTRY) &&
    nodeLabels.includes(NodeLabel.CONTINENT)
  )
    edgeLabels.push(EdgeLabel.COUNTRY_ISPARTOF_CONTINENT);

  if (
    nodeLabels.includes(NodeLabel.FORUM) &&
    nodeLabels.includes(NodeLabel.MESSAGE)
  )
    edgeLabels.push(EdgeLabel.FORUM_CONTAINEROF_MESSAGE);

  if (
    nodeLabels.includes(NodeLabel.FORUM) &&
    nodeLabels.includes(NodeLabel.PERSON)
  )
    edgeLabels.push(
      EdgeLabel.FORUM_HASMEMBER_PERSON,
      EdgeLabel.FORUM_HASMODERATOR_PERSON
    );

  if (
    nodeLabels.includes(NodeLabel.FORUM) &&
    nodeLabels.includes(NodeLabel.TAG)
  )
    edgeLabels.push(EdgeLabel.FORUM_HASTAG_TAG);

  if (
    nodeLabels.includes(NodeLabel.MESSAGE) &&
    nodeLabels.includes(NodeLabel.PERSON)
  )
    edgeLabels.push(EdgeLabel.MESSAGE_HASCREATOR_PERSON);

  if (
    nodeLabels.includes(NodeLabel.MESSAGE) &&
    nodeLabels.includes(NodeLabel.TAG)
  )
    edgeLabels.push(EdgeLabel.MESSAGE_HASTAG_TAG);

  if (nodeLabels.includes(NodeLabel.MESSAGE))
    edgeLabels.push(EdgeLabel.MESSAGE_REPLYOF_MESSAGE);

  if (
    nodeLabels.includes(NodeLabel.PERSON) &&
    nodeLabels.includes(NodeLabel.TAG)
  )
    edgeLabels.push(EdgeLabel.PERSON_HASINTEREST_TAG);

  if (
    nodeLabels.includes(NodeLabel.PERSON) &&
    nodeLabels.includes(NodeLabel.CITY)
  )
    edgeLabels.push(EdgeLabel.PERSON_ISLOCATEDIN_CITY);

  if (nodeLabels.includes(NodeLabel.PERSON))
    edgeLabels.push(EdgeLabel.PERSON_KNOWS_PERSON);

  if (
    nodeLabels.includes(NodeLabel.PERSON) &&
    nodeLabels.includes(NodeLabel.MESSAGE)
  )
    edgeLabels.push(EdgeLabel.PERSON_LIKES_MESSAGE);

  if (
    nodeLabels.includes(NodeLabel.PERSON) &&
    nodeLabels.includes(NodeLabel.UNIVERSITY)
  )
    edgeLabels.push(EdgeLabel.PERSON_STUDYAT_UNIVERSITY);

  if (
    nodeLabels.includes(NodeLabel.PERSON) &&
    nodeLabels.includes(NodeLabel.COMPANY)
  )
    edgeLabels.push(EdgeLabel.PERSON_WORKAT_COMPANY);

  if (
    nodeLabels.includes(NodeLabel.TAG) &&
    nodeLabels.includes(NodeLabel.TAGCLASS)
  )
    edgeLabels.push(EdgeLabel.TAG_HASTYPE_TC);

  if (nodeLabels.includes(NodeLabel.TAGCLASS))
    edgeLabels.push(EdgeLabel.TC_ISSUBCLASSOF_TC);

  return edgeLabels;
}
