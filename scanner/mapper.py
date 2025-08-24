from functools import reduce
from pathlib import Path

import pandas as pd
import requests


class Mapper:
    BASE_CODE = "CH"
    SCHALE_URL = "https://schaledb.com/data/{lang}/students.min.json"
    BASE_LOCATION = Path("local/table_data.csv")

    def __init__(self):
        self.name_table = self.make_name_table()

    def make_lang_table(self, lang) -> pd.DataFrame:
        url = self.SCHALE_URL.format(lang=lang)
        students = requests.get(url, timeout=30).json()

        return pd.DataFrame(
            data=[[student.get("Name"), student.get("Id"), student.get("DevName"), student.get("PathName")] for student
                  in students.values()],
            columns=[f"{lang}_name", "id", "code", "sub_code"]
        )

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

    def map(self, code: str):
        row = self.name_table[self.name_table["code"] == code]

        if len(row) == 0:
            if self.BASE_CODE in code:
                print(f"Not matched for {code=}")
                return

            sub_code = code.lower()
            new_row = self.name_table[self.name_table["sub_code"] == sub_code]

            if len(new_row) == 1:
                return new_row.drop(columns="sub_code").iloc[0].to_dict()
            else:
                return

        if len(row) > 1:
            print(f"Ambiguous {code=}")
            return

        return row.drop(columns="sub_code").iloc[0].to_dict()
