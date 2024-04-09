import { Sql } from "postgres";
import { ElementDefinition } from "cytoscape";

import { EdgeLabel } from "../utils/types";
import { edgeColors } from "../utils/constant";

export const edgesFunctionMap = {
  [EdgeLabel.CITY_ISPARTOF_COUNTRY]:
    getCityIsPartOfCountryEdges,
  [EdgeLabel.COUNTRY_ISPARTOF_CONTINENT]:
    getCountryIsPartOfContinentEdges,
  [EdgeLabel.FORUM_CONTAINEROF_MESSAGE]:
    getForumContainerOfMessageEdges,
  [EdgeLabel.FORUM_HASMEMBER_PERSON]:
    getForumHasMemberPersonEdges,
  [EdgeLabel.FORUM_HASMODERATOR_PERSON]:
    getForumHasModeratorPersonEdges,
  [EdgeLabel.FORUM_HASTAG_TAG]: getForumHasTagTagEdges,
  [EdgeLabel.MESSAGE_HASCREATOR_PERSON]:
    getMessageHasCreatorPersonEdges,
  [EdgeLabel.MESSAGE_HASTAG_TAG]: getMessageHasTagTagEdges,
  [EdgeLabel.MESSAGE_REPLYOF_MESSAGE]:
    getMessageReplyOfMessageEdges,
  [EdgeLabel.PERSON_HASINTEREST_TAG]:
    getPersonHasInterestTagEdges,
  [EdgeLabel.PERSON_ISLOCATEDIN_CITY]:
    getPersonIsLocatedInCityEdges,
  [EdgeLabel.PERSON_KNOWS_PERSON]:
    getPersonKnowsPersonEdges,
  [EdgeLabel.PERSON_LIKES_MESSAGE]:
    getPersonLikesMessageEdges,
  [EdgeLabel.PERSON_STUDYAT_UNIVERSITY]:
    getPersonStudyAtUniversityEdges,
  [EdgeLabel.PERSON_WORKAT_COMPANY]:
    getPersonWorkAtCompanyEdges,
  [EdgeLabel.TAG_HASTYPE_TC]: getTagHasTypeTagclassEdges,
  [EdgeLabel.TC_ISSUBCLASSOF_TC]:
    getTagclassIsSubclassOfTagclassEdges,
};

async function getCityIsPartOfCountryEdges(
  sql: Sql,
  cityNodes?: ElementDefinition[],
  countryNodes?: ElementDefinition[],
  size?: number
) {
  const isNodeSampled =
    cityNodes !== undefined && countryNodes !== undefined;
  const cityIds = cityNodes?.map((city) =>
    Number(city.data.id!.split("_")[1])
  );
  const countryIds = countryNodes?.map((country) =>
    Number(country.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *, ${
      edgeColors[EdgeLabel.CITY_ISPARTOF_COUNTRY]
    } as bg
    FROM cypher($$
      MATCH (n1: city)-[k:city_ispartof_country]->(n2: country)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isNodeSampled
        ? sql`WHERE source IN ${sql(cityIds!)} 
              AND target IN ${sql(countryIds!)}`
        : sql``
    }
    ${
      size
        ? sql`ORDER BY random()
              LIMIT ${size}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      color: edge.bg,
      source: "city_" + edge.source,
      target: "country_" + edge.target,
    },
  }));
}

async function getCountryIsPartOfContinentEdges(
  sql: Sql,
  countryNodes?: ElementDefinition[],
  continentNodes?: ElementDefinition[],
  size?: number
) {
  const isNodeSampled =
    countryNodes !== undefined &&
    continentNodes !== undefined;
  const countryIds = countryNodes?.map((country) =>
    Number(country.data.id!.split("_")[1])
  );
  const continentIds = continentNodes?.map((continent) =>
    Number(continent.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *, ${
      edgeColors[EdgeLabel.COUNTRY_ISPARTOF_CONTINENT]
    } as bg
    FROM cypher($$
      MATCH (n1: country)-[k:country_ispartof_continent]->(n2: continent)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isNodeSampled
        ? sql`WHERE source IN ${sql(countryIds!)} 
              AND target IN ${sql(continentIds!)}`
        : sql``
    }
    ${
      size
        ? sql`ORDER BY random()
              LIMIT ${size}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      color: edge.bg,
      source: "country_" + edge.source,
      target: "continent_" + edge.target,
    },
  }));
}

async function getForumContainerOfMessageEdges(
  sql: Sql,
  forumNodes?: ElementDefinition[],
  messageNodes?: ElementDefinition[],
  size?: number
) {
  const isNodeSampled =
    forumNodes !== undefined && messageNodes !== undefined;
  const forumIds = forumNodes?.map((forum) =>
    Number(forum.data.id!.split("_")[1])
  );
  const messageIds = messageNodes?.map((message) =>
    Number(message.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *, ${
      edgeColors[EdgeLabel.FORUM_CONTAINEROF_MESSAGE]
    } as bg
    FROM cypher($$
      MATCH (n1: forum)-[k:forum_containerof_message]->(n2: message)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isNodeSampled
        ? sql`WHERE source IN ${sql(forumIds!)} 
              AND target IN ${sql(messageIds!)}`
        : sql``
    }
    ${
      size
        ? sql`ORDER BY random()
              LIMIT ${size}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      color: edge.bg,
      source: "forum_" + edge.source,
      target: "message_" + edge.target,
    },
  }));
}

async function getForumHasMemberPersonEdges(
  sql: Sql,
  forumNodes?: ElementDefinition[],
  personNodes?: ElementDefinition[],
  size?: number
) {
  const isNodeSampled =
    forumNodes !== undefined && personNodes !== undefined;
  const forumIds = forumNodes?.map((forum) =>
    Number(forum.data.id!.split("_")[1])
  );
  const personIds = personNodes?.map((person) =>
    Number(person.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *, ${
      edgeColors[EdgeLabel.FORUM_HASMEMBER_PERSON]
    } as bg
    FROM cypher($$
      MATCH (n1: forum)-[k:forum_hasmember_person]->(n2: person)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isNodeSampled
        ? sql`WHERE source IN ${sql(forumIds!)} 
              AND target IN ${sql(personIds!)}`
        : sql``
    }
    ${
      size
        ? sql`ORDER BY random()
              LIMIT ${size}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      color: edge.bg,
      source: "forum_" + edge.source,
      target: "person_" + edge.target,
    },
  }));
}

async function getForumHasModeratorPersonEdges(
  sql: Sql,
  forumNodes?: ElementDefinition[],
  personNodes?: ElementDefinition[],
  size?: number
) {
  const isNodeSampled =
    forumNodes !== undefined && personNodes !== undefined;
  const forumIds = forumNodes?.map((forum) =>
    Number(forum.data.id!.split("_")[1])
  );
  const personIds = personNodes?.map((person) =>
    Number(person.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *, ${
      edgeColors[EdgeLabel.FORUM_HASMODERATOR_PERSON]
    } as bg
    FROM cypher($$
      MATCH (n1: forum)-[k:forum_hasmoderator_person]->(n2: person)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isNodeSampled
        ? sql`WHERE source IN ${sql(forumIds!)} 
              AND target IN ${sql(personIds!)}`
        : sql``
    }
    ${
      size
        ? sql`ORDER BY random()
              LIMIT ${size}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      color: edge.bg,
      source: "forum_" + edge.source,
      target: "person_" + edge.target,
    },
  }));
}

async function getForumHasTagTagEdges(
  sql: Sql,
  forumNodes?: ElementDefinition[],
  tagNodes?: ElementDefinition[],
  size?: number
) {
  const isNodeSampled =
    forumNodes !== undefined && tagNodes !== undefined;
  const forumIds = forumNodes?.map((forum) =>
    Number(forum.data.id!.split("_")[1])
  );
  const tagIds = tagNodes?.map((tag) =>
    Number(tag.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *, ${
      edgeColors[EdgeLabel.FORUM_HASTAG_TAG]
    } as bg
    FROM cypher($$
      MATCH (n1: forum)-[k:forum_hastag_tag]->(n2: tag)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isNodeSampled
        ? sql`WHERE source IN ${sql(forumIds!)} 
              AND target IN ${sql(tagIds!)}`
        : sql``
    }
    ${
      size
        ? sql`ORDER BY random()
              LIMIT ${size}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      color: edge.bg,
      source: "forum_" + edge.source,
      target: "tag_" + edge.target,
    },
  }));
}

async function getMessageHasCreatorPersonEdges(
  sql: Sql,
  messageNodes?: ElementDefinition[],
  personNodes?: ElementDefinition[],
  size?: number
) {
  const isNodeSampled =
    messageNodes !== undefined && personNodes !== undefined;
  const messageIds = messageNodes?.map((message) =>
    Number(message.data.id!.split("_")[1])
  );
  const personIds = personNodes?.map((person) =>
    Number(person.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *, ${
      edgeColors[EdgeLabel.MESSAGE_HASCREATOR_PERSON]
    } as bg
    FROM cypher($$
      MATCH (n1: message)-[k:message_hascreator_person]->(n2: person)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isNodeSampled
        ? sql`WHERE source IN ${sql(messageIds!)} 
              AND target IN ${sql(personIds!)}`
        : sql``
    }
    ${
      size
        ? sql`ORDER BY random()
              LIMIT ${size}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      color: edge.bg,
      source: "message_" + edge.source,
      target: "person_" + edge.target,
    },
  }));
}

async function getMessageHasTagTagEdges(
  sql: Sql,
  messageNodes?: ElementDefinition[],
  tagNodes?: ElementDefinition[],
  size?: number
) {
  const isNodeSampled =
    messageNodes !== undefined && tagNodes !== undefined;
  const messageIds = messageNodes?.map((message) =>
    Number(message.data.id!.split("_")[1])
  );
  const tagIds = tagNodes?.map((tag) =>
    Number(tag.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *, ${
      edgeColors[EdgeLabel.MESSAGE_HASTAG_TAG]
    } as bg
    FROM cypher($$
      MATCH (n1: message)-[k:message_hastag_tag]->(n2: tag)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isNodeSampled
        ? sql`WHERE source IN ${sql(messageIds!)} 
              AND target IN ${sql(tagIds!)}`
        : sql``
    }
    ${
      size
        ? sql`ORDER BY random()
              LIMIT ${size}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      color: edge.bg,
      source: "message_" + edge.source,
      target: "tag_" + edge.target,
    },
  }));
}

async function getMessageReplyOfMessageEdges(
  sql: Sql,
  messageNodes1?: ElementDefinition[],
  messageNodes2?: ElementDefinition[],
  size?: number
) {
  const isNodeSampled =
    messageNodes1 !== undefined &&
    messageNodes2 !== undefined;
  const messageIds1 = messageNodes1?.map((message) =>
    Number(message.data.id!.split("_")[1])
  );
  const messageIds2 = messageNodes2?.map((tag) =>
    Number(tag.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *, ${
      edgeColors[EdgeLabel.MESSAGE_REPLYOF_MESSAGE]
    } as bg
    FROM cypher($$
      MATCH (n1: message)-[k:message_replyof_message]->(n2: message)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isNodeSampled
        ? sql`WHERE source IN ${sql(messageIds1!)} 
              AND target IN ${sql(messageIds2!)}`
        : sql``
    }
    ${
      size
        ? sql`ORDER BY random()
              LIMIT ${size}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      color: edge.bg,
      source: "message_" + edge.source,
      target: "message_" + edge.target,
    },
  }));
}

async function getPersonHasInterestTagEdges(
  sql: Sql,
  personNodes?: ElementDefinition[],
  tagNodes?: ElementDefinition[],
  size?: number
) {
  const isNodeSampled =
    personNodes !== undefined && tagNodes !== undefined;
  const personIds = personNodes?.map((person) =>
    Number(person.data.id!.split("_")[1])
  );
  const tagIds = tagNodes?.map((tag) =>
    Number(tag.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *, ${
      edgeColors[EdgeLabel.PERSON_HASINTEREST_TAG]
    } as bg
    FROM cypher($$
      MATCH (n1: person)-[k:person_hasinterest_tag]->(n2: tag)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isNodeSampled
        ? sql`WHERE source IN ${sql(personIds!)} 
              AND target IN ${sql(tagIds!)}`
        : sql``
    }
    ${
      size
        ? sql`ORDER BY random()
              LIMIT ${size}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      color: edge.bg,
      source: "person_" + edge.source,
      target: "tag_" + edge.target,
    },
  }));
}

async function getPersonIsLocatedInCityEdges(
  sql: Sql,
  personNodes?: ElementDefinition[],
  cityNodes?: ElementDefinition[],
  size?: number
) {
  const isNodeSampled =
    personNodes !== undefined && cityNodes !== undefined;
  const personIds = personNodes?.map((person) =>
    Number(person.data.id!.split("_")[1])
  );
  const cityIds = cityNodes?.map((city) =>
    Number(city.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *, ${
      edgeColors[EdgeLabel.PERSON_ISLOCATEDIN_CITY]
    } as bg
    FROM cypher($$
      MATCH (n1: person)-[k:person_islocatedin_city]->(n2: city)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isNodeSampled
        ? sql`WHERE source IN ${sql(personIds!)} 
              AND target IN ${sql(cityIds!)}`
        : sql``
    }
    ${
      size
        ? sql`ORDER BY random()
              LIMIT ${size}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      color: edge.bg,
      source: "person_" + edge.source,
      target: "city_" + edge.target,
    },
  }));
}

async function getPersonKnowsPersonEdges(
  sql: Sql,
  personNodes1?: ElementDefinition[],
  personNodes2?: ElementDefinition[],
  size?: number
) {
  const isNodeSampled =
    personNodes1 !== undefined &&
    personNodes2 !== undefined;
  const personIds1 = personNodes1?.map((person) =>
    Number(person.data.id!.split("_")[1])
  );
  const personIds2 = personNodes2?.map((person) =>
    Number(person.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *, ${
      edgeColors[EdgeLabel.PERSON_KNOWS_PERSON]
    } as bg
    FROM cypher($$
      MATCH (n1: person)-[k:person_knows_person]->(n2: person)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isNodeSampled
        ? sql`WHERE source IN ${sql(personIds1!)} 
              AND target IN ${sql(personIds2!)}`
        : sql``
    }
    ${
      size
        ? sql`ORDER BY random()
              LIMIT ${size}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      color: edge.bg,
      source: "person_" + edge.source,
      target: "person_" + edge.target,
    },
  }));
}

// person_likes_message
async function getPersonLikesMessageEdges(
  sql: Sql,
  personNodes?: ElementDefinition[],
  messageNodes?: ElementDefinition[],
  size?: number
) {
  const isNodeSampled =
    personNodes !== undefined && messageNodes !== undefined;
  const personIds = personNodes?.map((person) =>
    Number(person.data.id!.split("_")[1])
  );
  const messageIds = messageNodes?.map((message) =>
    Number(message.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *, ${
      edgeColors[EdgeLabel.PERSON_LIKES_MESSAGE]
    } as bg
    FROM cypher($$
      MATCH (n1: person)-[k:person_likes_message]->(n2: message)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isNodeSampled
        ? sql`WHERE source IN ${sql(personIds!)} 
              AND target IN ${sql(messageIds!)}`
        : sql``
    }
    ${
      size
        ? sql`ORDER BY random()
              LIMIT ${size}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      color: edge.bg,
      source: "person_" + edge.source,
      target: "message_" + edge.target,
    },
  }));
}

// person_studyat_university
async function getPersonStudyAtUniversityEdges(
  sql: Sql,
  personNodes?: ElementDefinition[],
  universityNodes?: ElementDefinition[],
  size?: number
) {
  const isNodeSampled =
    personNodes !== undefined &&
    universityNodes !== undefined;
  const personIds = personNodes?.map((person) =>
    Number(person.data.id!.split("_")[1])
  );
  const universityIds = universityNodes?.map((university) =>
    Number(university.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *, ${
      edgeColors[EdgeLabel.PERSON_STUDYAT_UNIVERSITY]
    } as bg
    FROM cypher($$
      MATCH (n1: person)-[k:person_studyat_university]->(n2: university)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isNodeSampled
        ? sql`WHERE source IN ${sql(personIds!)} 
              AND target IN ${sql(universityIds!)}`
        : sql``
    }
    ${
      size
        ? sql`ORDER BY random()
              LIMIT ${size}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      color: edge.bg,
      source: "person_" + edge.source,
      target: "university_" + edge.target,
    },
  }));
}

// person_workat_company
async function getPersonWorkAtCompanyEdges(
  sql: Sql,
  personNodes?: ElementDefinition[],
  companyNodes?: ElementDefinition[],
  size?: number
) {
  const isNodeSampled =
    personNodes !== undefined && companyNodes !== undefined;
  const personIds = personNodes?.map((person) =>
    Number(person.data.id!.split("_")[1])
  );
  const companyIds = companyNodes?.map((company) =>
    Number(company.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *, ${
      edgeColors[EdgeLabel.PERSON_WORKAT_COMPANY]
    } as bg
    FROM cypher($$
      MATCH (n1: person)-[k:person_workat_company]->(n2: company)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isNodeSampled
        ? sql`WHERE source IN ${sql(personIds!)} 
              AND target IN ${sql(companyIds!)}`
        : sql``
    }
    ${
      size
        ? sql`ORDER BY random()
              LIMIT ${size}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      color: edge.bg,
      source: "person_" + edge.source,
      target: "company_" + edge.target,
    },
  }));
}

// tag_hastype_tc
async function getTagHasTypeTagclassEdges(
  sql: Sql,
  tagNodes?: ElementDefinition[],
  tcNodes?: ElementDefinition[],
  size?: number
) {
  const isNodeSampled =
    tagNodes !== undefined && tcNodes !== undefined;
  const tagIds = tagNodes?.map((tag) =>
    Number(tag.data.id!.split("_")[1])
  );
  const tcIds = tcNodes?.map((tc) =>
    Number(tc.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *, ${edgeColors[EdgeLabel.TAG_HASTYPE_TC]} as bg
    FROM cypher($$
      MATCH (n1: tag)-[k:tag_hastype_tc]->(n2: tagclass)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isNodeSampled
        ? sql`WHERE source IN ${sql(tagIds!)} 
              AND target IN ${sql(tcIds!)}`
        : sql``
    }
    ${
      size
        ? sql`ORDER BY random()
              LIMIT ${size}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      color: edge.bg,
      source: "tag_" + edge.source,
      target: "tagclass_" + edge.target,
    },
  }));
}

// tc_issubclassof_tc
async function getTagclassIsSubclassOfTagclassEdges(
  sql: Sql,
  tcNodes1?: ElementDefinition[],
  tcNodes2?: ElementDefinition[],
  size?: number
) {
  const isNodeSampled =
    tcNodes1 !== undefined && tcNodes2 !== undefined;
  const tcIds1 = tcNodes1?.map((tc) =>
    Number(tc.data.id!.split("_")[1])
  );
  const tcIds2 = tcNodes2?.map((tc) =>
    Number(tc.data.id!.split("_")[1])
  );

  const edges = await sql`
    SELECT *, ${
      edgeColors[EdgeLabel.TC_ISSUBCLASSOF_TC]
    } as bg
    FROM cypher($$
      MATCH (n1: tagclass)-[k:tc_issubclassof_tc]->(n2: tagclass)
      RETURN n1.vertex_id, n2.vertex_id
    $$) as (source bigint, target bigint)
    ${
      isNodeSampled
        ? sql`WHERE source IN ${sql(tcIds1!)} 
              AND target IN ${sql(tcIds2!)}`
        : sql``
    }
    ${
      size
        ? sql`ORDER BY random()
              LIMIT ${size}`
        : sql``
    };`;

  return edges.map((edge) => ({
    data: {
      color: edge.bg,
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
