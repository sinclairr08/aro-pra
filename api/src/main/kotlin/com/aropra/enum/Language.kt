package com.aropra.enum

enum class Language(
    val code: String,
) {
    KR("kr"),
    JP("jp"),
    EN("en"),
    ;

    companion object {
        fun fromString(value: String): Language? = entries.find { it.code.equals(value, ignoreCase = true) }
    }
}
