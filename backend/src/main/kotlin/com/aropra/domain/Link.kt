package com.aropra.domain

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

@Document(collection = "links")
data class Link(
    @Id
    val id: Long,
    val name: String,
    val url: String,
    val createdAt: LocalDateTime,
)
