package com.aropra.converter

import com.aropra.domain.Link
import com.aropra.dto.LinkRequest
import com.aropra.dto.LinkResponse

fun Link.toLinkResponse(): LinkResponse =
    LinkResponse(
        id = this.id!!,
        name = this.name,
        url = this.url,
        section = this.section,
    )

fun LinkRequest.toLink(): Link = Link(name = this.name, url = this.url, section = this.section)
