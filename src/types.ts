export enum NodeLabel {
  CITY = "city",
  COMPANY = "company",
  CONTINENT = "continent",
  COUNTRY = "country",
  FORUM = "forum",
  MESSAGE = "message",
  PERSON = "person",
  TAG = "tag",
  TAGCLASS = "tagclass",
  UNIVERSITY = "university",
}

export enum EdgeLabel {}

//     -- city_ispartof_country,
//     -- country_ispartof_continent,
//     -- forum_containerof_message,
//     -- forum_hasmember_person,
//     -- forum_hasmoderator_person,
//     -- forum_hastag_tag,
//     -- message_hascreator_person,
//     -- message_hastag_tag,
//     -- message_replyof_message,
//     -- person_hasinterest_tag,
//     -- person_islocatedin_city,
//     -- person_knows_person,
//     -- person_likes_message,
//     -- person_studyat_university,
//     -- person_workat_company,
//     -- tag_hastype_tc,
//     -- tc_issubclassof_tc
