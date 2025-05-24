package com.aropra.domain

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

@Document(collection = "versions")
data class Version(
    @Id
    val id: Long,
    val version: String,
    val updatedAt: LocalDateTime,
    val description: List<String>,
)
