package com.aropra.dto

import com.aropra.domain.Link

data class LinkRequest(
    val name: String,
    val url: String,
)

fun LinkRequest.toEntity(): Link = Link(name = this.name, url = this.url)
