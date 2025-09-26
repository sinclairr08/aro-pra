package com.aropra.domain

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.Field

@Document(collection = "students")
data class Student(
    @Id
    val id: String? = null,
    val code: String,
    @Field("kr_name")
    val krName: String,
    @Field("jp_name")
    val jpName: String,
    @Field("en_name")
    val enName: String,
    @Field("kr_base_name")
    val krBaseName: String,
    @Field("jp_base_name")
    val jpBaseName: String,
    @Field("en_base_name")
    val enBaseName: String,
)
