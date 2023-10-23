const basePageInfo = `fragment baseInfo on Page {
id
className
link
urlSegment
parentID
title
CSSClass
}`

/* const elemental = `fragment elemental on Page {
elementalArea {
    id
    version
    elements {
        id
        title
        className
        forTemplate
    }
}
}`; */

const queries = {
  menu: `${basePageInfo} query ($id: ID) {
        readPages(filter: { parentID: { eq: $id }, showInMenus: {eq:true} }) {
            nodes {
                ... baseInfo
                children {
                    ...baseInfo
                    children {
                        ...baseInfo
                    }
                }
            }
        }
    }`,
  /* byID: `${basePageInfo} ${elemental} query ($id: ID) {
        readOnePage(filter: { id: { eq: $id } }) {
            ... baseInfo
            ... elemental
            MainContent
        }
    }`, */
  byLink: `${basePageInfo} query ($url: String) {
        readOnePage(filter: { url: { eq: $url } }) {
            ... baseInfo
            MainContent
        }
    }`
}

module.exports = queries
