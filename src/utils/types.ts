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

// TODO: 만들어서 selector 함수 고치기
export enum EdgeLabel {}
// city_ispartof_country 1343
// country_ispartof_continent 111
// forum_containerof_message 1003605
// forum_hasmember_person 1611869
// forum_hasmoderator_person 90492
// forum_hastag_tag 309766
// message_hascreator_person 3055774
// message_hastag_tag 3411651
// message_replyof_message 2052169
// person_hasinterest_tag 229166
// person_islocatedin_city 9892
// person_knows_person 361246
// person_likes_message 2190095
// person_studyat_university 7949
// person_workat_company 21654
// tag_hastype_tc 16080
// tc_issubclassof_tc 70

/**
 * city 1343
 * country 111
 * continent 6
 * company 1575
 * forum 90492
 * message 3055774
 * person 9892
 * tag 16080
 * tagclass 71
 * univ 6380
 */
