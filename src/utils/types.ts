export enum NodeLabel {
  CITY = "city",
  COUNTRY = "country",
  CONTINENT = "continent",
  COMPANY = "company",
  FORUM = "forum",
  MESSAGE = "message",
  PERSON = "person",
  TAG = "tag",
  TAGCLASS = "tagclass",
  UNIVERSITY = "university",
}

export enum EdgeLabel {
  CITY_ISPARTOF_COUNTRY = "city_ispartof_country",
  COUNTRY_ISPARTOF_CONTINENT = "country_ispartof_continent",
  FORUM_CONTAINEROF_MESSAGE = "forum_containerof_message",
  FORUM_HASMEMBER_PERSON = "forum_hasmember_person",
  FORUM_HASMODERATOR_PERSON = "forum_hasmoderator_person",
  FORUM_HASTAG_TAG = "forum_hastag_tag",
  MESSAGE_HASCREATOR_PERSON = "message_hascreator_person",
  MESSAGE_HASTAG_TAG = "message_hastag_tag",
  MESSAGE_REPLYOF_MESSAGE = "message_replyof_message",
  PERSON_HASINTEREST_TAG = "person_hasinterest_tag",
  PERSON_ISLOCATEDIN_CITY = "person_islocatedin_city",
  PERSON_KNOWS_PERSON = "person_knows_person",
  PERSON_LIKES_MESSAGE = "person_likes_message",
  PERSON_STUDYAT_UNIVERSITY = "person_studyat_university",
  PERSON_WORKAT_COMPANY = "person_workat_company",
  TAG_HASTYPE_TC = "tag_hastype_tc",
  TC_ISSUBCLASSOF_TC = "tc_issubclassof_tc",
}

export enum LayoutType {
  RANDOM = "random",
  CIRCLE = "circle",
  CONCENTRIC = "concentric",
  BREADTHFIRST = "breadthfirst",
  COSE = "cose",
  FCOSE = "fcose",
  CISE = "cise",
  EULER = "euler",
  SPREAD = "spread",
}
