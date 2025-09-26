package com.aropra.dto

data class VersionRequest(
    val version: String,
    val description: List<String>,
    val updatedDate: String? = null,
)
