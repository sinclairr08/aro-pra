package com.aropra.dto

data class GroupedStudentResponse(
    val groupName: String,
    val value: List<BasicStudentResponse>,
)
