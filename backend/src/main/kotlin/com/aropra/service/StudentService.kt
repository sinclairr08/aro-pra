package com.aropra.service

import com.aropra.converter.toStudentOutfit
import com.aropra.dto.StudentResponse
import com.aropra.enum.Language
import com.aropra.repository.StudentRepository
import org.springframework.stereotype.Service

@Service
class StudentService(
    private val studentRepository: StudentRepository,
) {
    fun getGroupedByBaseName(language: Language): List<StudentResponse> =
        studentRepository
            .findAll()
            .groupBy { it.krBaseName }
            .map { (name, students) ->
                StudentResponse(
                    name = name,
                    outfits = students.map { it.toStudentOutfit(language) },
                )
            }
}
