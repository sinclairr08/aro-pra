package com.aropra.converter

import com.aropra.domain.Student
import com.aropra.dto.BasicStudentResponse
import com.aropra.enum.Language

fun Student.toBasicStudentResponse(language: Language): BasicStudentResponse =
    BasicStudentResponse(
        code = this.code,
        name =
            when (language) {
                Language.KR -> this.krName
                Language.EN -> this.enName
                Language.JP -> this.jpName
            },
    )
