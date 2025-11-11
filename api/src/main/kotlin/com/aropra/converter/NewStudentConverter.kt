package com.aropra.converter

import com.aropra.domain.ExternalStudent
import com.aropra.domain.NewStudent

fun ExternalStudent.toNewStudent(imgCode: String): NewStudent =
    NewStudent(
        id = this.id,
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
    )
