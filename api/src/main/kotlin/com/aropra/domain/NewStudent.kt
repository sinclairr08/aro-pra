package com.aropra.domain

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "newStudents")
data class NewStudent(
    @Id
    val id: String? = null,
    val pathName: String,
    val devName: String,
    val name: String,
    val school: String,
    val club: String,
    val starGrade: String,
    val squadType: String,
    val tacticRole: String,
    val position: String,
    val bulletType: String,
    val armorType: String,
    val weaponType: String,
    val familyName: String,
    val personalName: String,
    val schoolYear: String,
    val characterAge: String,
    val birthDay: String,
    val path: String,
)
