package com.aropra.converter

import com.aropra.domain.Student
import com.aropra.dto.StudentData

fun Student.toStudentData(): StudentData =
    StudentData(
        code = this.code,
        krName = this.krName,
        jpName = this.jpName,
        enName = this.enName,
    )
