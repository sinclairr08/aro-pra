package com.aropra.service

import com.aropra.converter.toBasicStudentResponse
import com.aropra.dto.GroupedStudentResponse
import com.aropra.enum.Language
import com.aropra.repository.StudentRepository
import org.springframework.stereotype.Service

@Service
class StudentService(
    private val studentRepository: StudentRepository,
) {
    fun getGroupedByBaseName(language: Language): List<GroupedStudentResponse> =
        studentRepository
            .findAll()
            .groupBy { it.krBaseName }
            .map { (name, students) ->
                GroupedStudentResponse(
                    groupName = name,
                    value = students.map { it.toBasicStudentResponse(language) },
                )
            }
}
