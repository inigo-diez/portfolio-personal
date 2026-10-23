"""Chart data for the morosidad-crediticia case study (E6).

Re-runs, step by step, the notebook `analisis_nulos.ipynb` of Iñigo's local copy of the
project (same folder as its README, identical to the published one) up to the logistic
regression, and writes the threshold analysis of README figure img_10 (TPR and FPR for
each decision threshold) as a small JSON the site draws as a native SVG.

Before writing, it checks that it reproduces the README figures (logistic regression:
accuracy 0.710, recall 0.931, F1 0.817, AUC 0.71). If they do not match, it stops.

Run (pandas and scikit-learn in a throwaway environment, nothing installed):
  uv run --with pandas --with scikit-learn scripts/charts/morosidad-crediticia.py
"""

import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score, recall_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

SOURCE = Path(r"C:\Users\usuario\Desktop\2020-2026\Curso\archive (2)")
OUT = Path(__file__).resolve().parents[2] / "src" / "content" / "charts" / "morosidad-crediticia.json"

# --- notebook cells 1–31: load, impute, new variables, extreme values, transforms
df = pd.read_csv(SOURCE / "data.csv")
num_cols = df.select_dtypes(include=[np.number]).columns.tolist()
for col in num_cols:
    if df[col].isnull().sum() > 0:
        df[col] = df[col].fillna(df[col].mean())

df["Endeudamiento"] = df["deuda_sf"] / df["ingreso"]
df["Indicador_Morosos"] = df["deuda_sf"] > df["linea_sf"]
divisor = np.where(df["linea_sf"] == 0, df["linea_sf"] + 1, df["linea_sf"])
df["Ratio_Deuda_Linea"] = df["deuda_sf"] / divisor

# Values outside 1.5 × IQR are replaced by Q1/Q3 (the notebook does not drop rows).
df_copia = df.copy()
for col in num_cols:
    q1, q3 = df[col].quantile(0.25), df[col].quantile(0.75)
    iqr = q3 - q1
    df_copia[col] = np.where(df_copia[col] < q1 - 1.5 * iqr, q1, df_copia[col])
    df_copia[col] = np.where(df_copia[col] > q3 + 1.5 * iqr, q3, df_copia[col])
df = df_copia.copy()

df["ingreso"] = np.sqrt(df["ingreso"])
df["linea_sf"] = np.log(df["linea_sf"] + 1)
df["deuda_sf"] = np.log(df["deuda_sf"] + 1)
df = df.drop(columns=["nivel_ahorro"])

# --- cells 34–55: group small zones by their default rate, one-hot encoding
cat_cols = df.select_dtypes(include=["object", "string"]).columns.tolist()
min_cat = df.shape[0] * 0.05
stats = df.groupby("zona")["mora"].agg(["mean", "count"]).sort_values("count", ascending=False)
superiores = stats[stats["count"] > min_cat].index.tolist()
inferiores = stats[stats["count"] <= min_cat]
mapeo = {cat: cat for cat in superiores}
for cat in inferiores[inferiores["mean"] > df["mora"].mean()].index:
    mapeo[cat] = "High_Def"
for cat in inferiores[inferiores["mean"] <= df["mora"].mean()].index:
    mapeo[cat] = "Low_Def"
df["zona"] = df["zona"].map(mapeo)
df = pd.get_dummies(df, columns=cat_cols, drop_first=True)

# --- cells 57–68: scaling, 70/30 split, logistic regression
scaled = [c for c in df.select_dtypes(include=[np.number]).columns if c != "mora"]
df[scaled] = StandardScaler().fit_transform(df[scaled])
X, y = df.drop(columns=["mora"]), df["mora"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
model = LogisticRegression().fit(X_train, y_train)
y_prob = model.predict_proba(X_test)[:, 1]
pred = model.predict(X_test)

# --- the README figures must come out the same
check = {
    "accuracy": (accuracy_score(y_test, pred), 0.710),
    "recall": (recall_score(y_test, pred), 0.931),
    "f1": (f1_score(y_test, pred), 0.817),
    "auc": (roc_auc_score(y_test, y_prob), 0.71),
}
for name, (got, readme) in check.items():
    digits = 2 if name == "auc" else 3
    print(f"{name:9s} {got:.4f}  README {readme}")
    if round(got, digits) != readme:
        sys.exit(f"{name} does not match the README: not writing the chart data")

# --- cell 84: metrics for each threshold (101 steps of 0.01 instead of linspace(0, 1, 100))
yt = y_test.to_numpy()
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
            "source": "Notebook analisis_nulos.ipynb (celdas 1–84), copia local del repo prediccion-morosidad-crediticia",
            "test": {"n": len(yt), "morosos": int(yt.sum()), "auc": round(check["auc"][0], 4)},
            "points": points,
        },
        ensure_ascii=False,
        indent=1,
    )
    + "\n",
    encoding="utf-8",
)
print(f"written {OUT}")
