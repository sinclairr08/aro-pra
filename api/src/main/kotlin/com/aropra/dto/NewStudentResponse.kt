package com.aropra.dto

data class NewStudentResponse(
    val name: String,
    val outfits: List<StudentOutfit>,
    val currentOutfitCode: String,
    val school: String,
    val club: String,
    val schoolYear: String,
    val characterAge: String,
    val birthDay: String,
)
