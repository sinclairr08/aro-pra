package com.aropra.dto

data class NewStudentResponse(
    val name: String,
    val outfits: List<StudentOutfit>,
    val currentOutfitCode: String,
)
