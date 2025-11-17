package com.aropra.domain

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

@Document(collection = "versions")
data class Version(
    @Id
    val id: String? = null,
    val version: String,
    val description: List<String>,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    @Indexed
    val updatedDate: String,
)
