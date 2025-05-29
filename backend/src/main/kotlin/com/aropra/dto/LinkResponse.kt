package com.aropra.dto

import com.aropra.domain.Link
import java.time.format.DateTimeFormatter

data class LinkResponse(
    val id: Long,
    val name: String,
    val url: String,
    val createdAt: String,
)

fun Link.toResponse(): LinkResponse =
    LinkResponse(
        id = this.id,
        name = this.name,
        url = this.url,
        createdAt = this.createdAt.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
    )
