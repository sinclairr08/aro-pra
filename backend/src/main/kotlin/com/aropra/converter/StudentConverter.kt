package com.aropra.converter

import com.aropra.domain.Student
import com.aropra.dto.StudentOutfit
import com.aropra.enum.Language

fun Student.toStudentOutfit(language: Language): StudentOutfit =
    StudentOutfit(
        code = this.code,
        outfitName =
            when (language) {
                Language.KR -> this.krName
                Language.EN -> this.enName
                Language.JP -> this.jpName
            },
    )
