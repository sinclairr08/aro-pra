package com.aropra.repository

import com.aropra.domain.StudentImgCode
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface StudentImgCodeRepository : MongoRepository<StudentImgCode, String> {
    fun findByCode(code: String): StudentImgCode?
}
