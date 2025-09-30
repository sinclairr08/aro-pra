package com.aropra.dto

data class StudentResponse(
    val name: String,
    val outfits: List<StudentOutfit>,
    val currentOutfitCode: String,
)
