package com.aropra.repository

import com.aropra.domain.NewStudent
import com.aropra.enum.Language
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface NewStudentRepository : MongoRepository<NewStudent, String> {
    fun findByLanguage(language: Language): List<NewStudent>
}
