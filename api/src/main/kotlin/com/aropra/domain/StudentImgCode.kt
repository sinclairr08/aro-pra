package com.aropra.domain

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "img_codes")
data class StudentImgCode(
    @Id
    val id: String? = null,
    val code: String,
)
