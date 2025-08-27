package com.aropra.dto

data class GroupedStudentResponse(
    val name: String,
    val value: List<StudentData>,
)
