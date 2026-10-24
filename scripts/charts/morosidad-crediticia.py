"""Chart data for the morosidad-crediticia case study (E6, evaluation revised in E8).

1. Re-runs, step by step, the notebook `analisis_nulos.ipynb` of Iñigo's local copy of the project (same
   folder as its README, identical to the published one) up to the logistic regression, and checks that it
   reproduces the README figures (accuracy 0.710, recall 0.931, F1 0.817, AUC 0.71). If not, it stops.
2. Revised evaluation (E8 audit, 2026-10-23): 2,325 of the 8,399 rows (27.7 %) are exact copies of another
   row, so 38.6 % of the notebook's test clients have an identical twin in training and a deep Random Forest
   memorises them. Here the copies are dropped first, the 70/30 split is made on the 6,074 unique rows and
   the same recipe (imputation, extreme values, transforms, zone grouping, scaling) is fitted on the training
   part only. The threshold analysis of README figure img_10 is then computed for the Random Forest (the best
   of the three models) and written as a small JSON the site draws as a native SVG.

Run (pandas and scikit-learn in a throwaway environment, nothing installed):
  uv run --with pandas --with scikit-learn scripts/charts/morosidad-crediticia.py
"""

import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier

SOURCE = Path(r"C:\Users\usuario\Desktop\2020-2026\Curso\archive (2)")
OUT = Path(__file__).resolve().parents[2] / "src" / "content" / "charts" / "morosidad-crediticia.json"
raw = pd.read_csv(SOURCE / "data.csv")
CAT = ["vivienda", "zona", "nivel_educ"]


def new_vars(d):
    d["Endeudamiento"] = d["deuda_sf"] / d["ingreso"]
    d["Indicador_Morosos"] = d["deuda_sf"] > d["linea_sf"]
    divisor = np.where(d["linea_sf"] == 0, d["linea_sf"] + 1, d["linea_sf"])
    d["Ratio_Deuda_Linea"] = d["deuda_sf"] / divisor
    return d


def fit(df):
    """Everything the notebook learns from the data (cells 1–57): means, quartiles, zone groups, scaling."""
    st = {"num": [c for c in df.select_dtypes(include=[np.number]).columns if c != "mora"]}
    st["mean"] = df[st["num"]].mean()
    d = new_vars(df.fillna(st["mean"]))
    st["q1"], st["q3"] = d[st["num"]].quantile(0.25), d[st["num"]].quantile(0.75)
    zs = d.groupby("zona")["mora"].agg(["mean", "count"])
    big = zs[zs["count"] > len(d) * 0.05].index
    rate = d["mora"].mean()
    st["zones"] = {z: z if z in big else ("High_Def" if r["mean"] > rate else "Low_Def") for z, r in zs.iterrows()}
    t = apply(df, st, scale=False)
    st["cols"] = [c for c in t.columns if c != "mora"]
    st["scaled"] = [c for c in t.select_dtypes(include=[np.number]).columns if c != "mora"]
    st["scaler"] = StandardScaler().fit(t[st["scaled"]])
    return st


def apply(df, st, scale=True):
    d = new_vars(df.fillna(st["mean"]))
    for c in st["num"]:  # values outside 1.5 × IQR → Q1 / Q3 (the notebook does not drop rows)
        iqr = st["q3"][c] - st["q1"][c]
        d[c] = np.where(d[c] < st["q1"][c] - 1.5 * iqr, st["q1"][c], d[c])
        d[c] = np.where(d[c] > st["q3"][c] + 1.5 * iqr, st["q3"][c], d[c])
    d["ingreso"] = np.sqrt(d["ingreso"])
    d["linea_sf"] = np.log(d["linea_sf"] + 1)
    d["deuda_sf"] = np.log(d["deuda_sf"] + 1)
    d = d.drop(columns=["nivel_ahorro"])
    d["zona"] = d["zona"].map(st["zones"]).fillna("Low_Def")
    d = pd.get_dummies(d, columns=CAT, drop_first=True)
    if "cols" in st:
        d = d.reindex(columns=["mora", *st["cols"]], fill_value=False)
    if scale:
        d[st["scaled"]] = st["scaler"].transform(d[st["scaled"]])
    return d


# --- 1. the notebook as it is (fitted on all rows, split afterwards): the README figures must come out
full = apply(raw, fit(raw))
X, y = full.drop(columns=["mora"]), full["mora"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
lr = LogisticRegression().fit(X_train, y_train)
pred = lr.predict(X_test)
check = {
    "accuracy": (accuracy_score(y_test, pred), 0.710),
    "recall": (recall_score(y_test, pred), 0.931),
    "f1": (f1_score(y_test, pred), 0.817),
    "auc": (roc_auc_score(y_test, lr.predict_proba(X_test)[:, 1]), 0.71),
}
for name, (got, readme) in check.items():
    digits = 2 if name == "auc" else 3
    print(f"{name:9s} {got:.4f}  README {readme}")
    if round(got, digits) != readme:
        sys.exit(f"{name} does not match the README: not writing the chart data")

# --- 2. revised evaluation: no copies, recipe fitted on the training part only
unique = raw.drop_duplicates()
# how many of the notebook's test clients have an identical row in its training part
row_key = lambda d: pd.util.hash_pandas_object(d, index=False)
nb_train, nb_test = train_test_split(raw, test_size=0.3, random_state=42)
twins = int(row_key(nb_test).isin(set(row_key(nb_train))).sum())
train, test = train_test_split(unique, test_size=0.3, random_state=42)
st = fit(train)
tr, te = apply(train, st), apply(test, st)
Xtr, ytr, Xte = tr.drop(columns=["mora"]), tr["mora"], te.drop(columns=["mora"])
yt = te["mora"].to_numpy()
print(f"copies {len(raw) - len(unique)} · unique {len(unique)} · train {len(tr)} · test {len(yt)} (defaulters {int(yt.sum())})")


def scores(pred, prob):
    return {
        "accuracy": round(accuracy_score(yt, pred), 4),
        "precision": round(precision_score(yt, pred), 4),
        "recall": round(recall_score(yt, pred), 4),
        "f1": round(f1_score(yt, pred), 4),
        "payers_recognised": round(recall_score(1 - yt, 1 - pred), 4),
        "auc": round(roc_auc_score(yt, prob), 4),
    }


# the three models of the notebook's comparison (cell 99, seed fixed here) and a trivial reference
models = {
    "Regresión logística": LogisticRegression(max_iter=1000),
    "Árbol de decisión": DecisionTreeClassifier(max_depth=10, random_state=42),
    "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
}
table = [{"model": "Todos morosos (referencia)", **scores(np.ones(len(yt), int), np.full(len(yt), 0.5))}]
for name, m in models.items():
    m.fit(Xtr, ytr)
    table.append({"model": name, **scores(m.predict(Xte), m.predict_proba(Xte)[:, 1])})
for row in table:
    print(row)
rf = models["Random Forest"]
y_prob = rf.predict_proba(Xte)[:, 1]
auc = roc_auc_score(yt, y_prob)
# the same Random Forest without `atraso` (the data do not say when the days in arrears are measured)
rf_na = RandomForestClassifier(n_estimators=100, random_state=42).fit(Xtr.drop(columns=["atraso"]), ytr)
auc_no_atraso = roc_auc_score(yt, rf_na.predict_proba(Xte.drop(columns=["atraso"]))[:, 1])
print(f"Random Forest AUC {auc:.4f} · without atraso {auc_no_atraso:.4f}")

points = []
for t in np.round(np.linspace(0, 1, 101), 2):
    p = (y_prob >= t).astype(int)
    tp = int(((p == 1) & (yt == 1)).sum())
    fn = int(((p == 0) & (yt == 1)).sum())
    fp = int(((p == 1) & (yt == 0)).sum())
    tn = int(((p == 0) & (yt == 0)).sum())
    points.append(
        {"t": float(t), "tpr": round(tp / (tp + fn), 4), "fpr": round(fp / (fp + tn), 4), "acc": round((tp + tn) / len(yt), 4)}
    )

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(
    json.dumps(
        {
            "source": "Notebook analisis_nulos.ipynb de la copia local del repo prediccion-morosidad-crediticia, sin los 2.325 registros repetidos y con el preprocesamiento ajustado solo con entrenamiento (scripts/charts/morosidad-crediticia.py)",
            "records": {"total": len(raw), "copies": len(raw) - len(unique), "unique": len(unique)},
            "train": {"n": len(tr)},
            "test": {"n": len(yt), "morosos": int(yt.sum()), "auc": round(auc, 4)},
            "notebookTest": {"n": len(X_test), "withTwinInTrain": twins},
            "models": table,
            "aucWithoutAtraso": round(auc_no_atraso, 4),
            "points": points,
        },
        ensure_ascii=False,
        indent=1,
    )
    + "\n",
    encoding="utf-8",
)
print(f"written {OUT}")
