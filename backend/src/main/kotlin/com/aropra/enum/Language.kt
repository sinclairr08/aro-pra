package com.aropra.enum

enum class Language {
    KR,
    JP,
    EN,
    ;

    companion object {
        fun fromstring(value: String): Language? = entries.find { it.name.equals(value, ignoreCase = true) }
    }
}
