package com.aropra.converter

import com.aropra.domain.ExternalStudent
import com.aropra.domain.NewStudent
import com.aropra.dto.StudentOutfit
import com.aropra.enum.Language

fun ExternalStudent.toNewStudent(
    imgCode: String,
    language: Language,
): NewStudent =
    NewStudent(
        id = "${this.id}_${language.code}",
        pathName = this.pathName,
        devName = this.devName,
        name = this.name,
        school = this.school,
        club = this.club,
        starGrade = this.starGrade,
        squadType = this.squadType,
        tacticRole = this.tacticRole,
        position = this.position,
        bulletType = this.bulletType,
        armorType = this.armorType,
        weaponType = this.weaponType,
        familyName = this.familyName,
        personalName = this.personalName,
        schoolYear = this.schoolYear,
        characterAge = this.characterAge,
        birthDay = this.birthDay,
        imgCode = imgCode,
        language = language,
    )

fun NewStudent.toStudentOutfit(): StudentOutfit =
    StudentOutfit(
        code = this.imgCode,
        outfitName = this.name,
    )
