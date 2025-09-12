from functools import reduce
from pathlib import Path
from typing import Optional

import pandas as pd
import requests


class Mapper:
    BASE_CODE = "CH"
    SCHALE_URL = "https://schaledb.com/data/{lang}/students.min.json"
    BASE_LOCATION = Path("local/table_data.csv")
    SPECIAL_MAPPING = {"reizyo": "CH0134", "shiroko_ridingsuit": "CH0065"}

    def __init__(self):
        self.name_table = self.make_name_table()

    def make_lang_table(self, lang) -> pd.DataFrame:
        url = self.SCHALE_URL.format(lang=lang)
        students = requests.get(url, timeout=30).json()

        df = pd.DataFrame(
            data=[[student.get("Name"), student.get("Id"), student.get("DevName"), student.get("PathName"),
                   student.get("PersonalName")] for student
                  in students.values()],
            columns=[f"{lang}_name", "id", "code", "sub_code", f"{lang}_base_name"]
        )

        mask = df[f"{lang}_name"].str.contains('*', na=False)
        df.loc[mask, f"{lang}_name"] = df.loc[mask, f"{lang}_base_name"]

        return df

    def make_name_table(self):
        if self.BASE_LOCATION.exists():
            return pd.read_csv(self.BASE_LOCATION)

        dfs = []

        for lang in ["en", "jp", "kr"]:
            dfs.append(self.make_lang_table(lang))

        df = reduce(
            lambda left, right: pd.merge(left, right, on=["id", "code", "sub_code"], how="inner"),
            dfs
        )
        df.to_csv(self.BASE_LOCATION, index=False)

        return df

    def convert_old_code(self, old_code: str) -> Optional[str]:
        if old_code in self.name_table["code"].values:
            return old_code

        sub_code = old_code.lower()
        if self.name_table["sub_code"].isin([sub_code]).any():
            return self.name_table.loc[self.name_table["sub_code"] == sub_code, "code"].iloc[0]

        return self.SPECIAL_MAPPING.get(sub_code, None)

    def map(self, code: str):
        row = self.name_table[self.name_table["code"] == code]

        if len(row) > 1:
            raise ValueError(f"{code} is not unique")

        if len(row) < 1:
            raise ValueError(f"{code} does not exist")

        return row.drop(columns="sub_code").iloc[0].to_dict()
