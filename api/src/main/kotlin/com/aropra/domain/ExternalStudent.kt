package com.aropra.domain

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty

@JsonIgnoreProperties(ignoreUnknown = true)
data class ExternalStudent(
    @JsonProperty("Id")
    val id: String,
    @JsonProperty("PathName")
    val pathName: String,
    @JsonProperty("DevName")
    val devName: String,
    @JsonProperty("Name")
    val name: String,
    @JsonProperty("School")
    val school: String,
    @JsonProperty("Club")
    val club: String,
    @JsonProperty("StarGrade")
    val starGrade: String,
    @JsonProperty("SquadType")
    val squadType: String,
    @JsonProperty("TacticRole")
    val tacticRole: String,
    @JsonProperty("Position")
    val position: String,
    @JsonProperty("BulletType")
    val bulletType: String,
    @JsonProperty("ArmorType")
    val armorType: String,
    @JsonProperty("WeaponType")
    val weaponType: String,
    @JsonProperty("FamilyName")
    val familyName: String,
    @JsonProperty("PersonalName")
    val personalName: String,
    @JsonProperty("SchoolYear")
    val schoolYear: String,
    @JsonProperty("CharacterAge")
    val characterAge: String,
    @JsonProperty("BirthDay")
    val birthDay: String,
)
