package com.aropra.dto

data class VersionResponse(
    val id: String,
    val version: String,
    val description: List<String>,
    val updatedDate: String,
)
