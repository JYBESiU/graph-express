import { EdgeLabel, NodeLabel } from "./types";
import { getNodeLabelsByEdgeLabel } from "./util";

export const port = 3001;

export const nodeColors = {
  [NodeLabel.CITY]: "#8ED3C7",
  [NodeLabel.COMPANY]: "#CCEBC5",
  [NodeLabel.CONTINENT]: "#D9D9D9",
  [NodeLabel.COUNTRY]: "#FFFFB3",
  [NodeLabel.FORUM]: "#B3DE68",
  [NodeLabel.MESSAGE]: "#BDBAD9",
  [NodeLabel.PERSON]: "#FDB462",
  [NodeLabel.TAG]: "#FCCDE5",
  [NodeLabel.TAGCLASS]: "#BB80BC",
  [NodeLabel.UNIVERSITY]: "#FFED6F",
};

export const edgeColors = {
  [EdgeLabel.CITY_ISPARTOF_COUNTRY]: "#c6e9bd",
  [EdgeLabel.COUNTRY_ISPARTOF_CONTINENT]: "#ececc6",
  [EdgeLabel.FORUM_CONTAINEROF_MESSAGE]: "#b8cca0",
  [EdgeLabel.FORUM_HASMEMBER_PERSON]: "#d8c965",
  [EdgeLabel.FORUM_HASMODERATOR_PERSON]: "#d8c965",
  [EdgeLabel.FORUM_HASTAG_TAG]: "#d7d5a6",
  [EdgeLabel.MESSAGE_HASCREATOR_PERSON]: "#ddb79d",
  [EdgeLabel.MESSAGE_HASTAG_TAG]: "#dcc3df",
  [EdgeLabel.MESSAGE_REPLYOF_MESSAGE]: "#bdbad9",
  [EdgeLabel.PERSON_HASINTEREST_TAG]: "#fcc0a3",
  [EdgeLabel.PERSON_ISLOCATEDIN_CITY]: "#c5c394",
  [EdgeLabel.PERSON_KNOWS_PERSON]: "#fdb462",
  [EdgeLabel.PERSON_LIKES_MESSAGE]: "#ddb79d",
  [EdgeLabel.PERSON_STUDYAT_UNIVERSITY]: "#fed068",
  [EdgeLabel.PERSON_WORKAT_COMPANY]: "#e4cf93",
  [EdgeLabel.TAG_HASTYPE_TC]: "#dba6d0",
  [EdgeLabel.TC_ISSUBCLASSOF_TC]: "#bb80bc",
};
