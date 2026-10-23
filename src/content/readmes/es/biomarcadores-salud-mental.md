# Recopilador de metabolitos de salud mental

> **[Haz clic aquí](https://inigo-diez.github.io/Mental-Health-Biomarkers-Database-1-Parte-/report_mhb.html)**: panel interactivo con las ~39.000 entradas. Filtra por condición, fuente, origen y vínculo con la microbiota. No requiere instalación: se abre directamente en el navegador.

Pipeline automatizado que reúne **candidatos a biomarcadores metabólicos** de condiciones psiquiátricas
(esquizofrenia, depresión, trastorno bipolar, ansiedad, TEPT, autismo, TDAH) a partir de
**6 bases de datos científicas abiertas**, elimina los duplicados y exporta un panel HTML interactivo.

Desarrollado como parte de un Trabajo Fin de Grado (TFG).

---

## Lo más destacado

- Integra **6 bases de datos abiertas** de forma automática: MarkerDB, CTD, Metabolomics Workbench, MetaboLights, Europe PMC y HMDB Feces
- Deduplicación química por InChIKey → CID de PubChem → nombre normalizado (cascada de prioridad)
- **Enriquecimiento opcional con PubChem** para resolver identificadores (CID + InChIKey)
- **Anotación de volatilidad**: compuestos VOC frente a no volátiles, inferida de las pistas del método analítico (GC frente a LC)
- **Clasificación del vínculo con la microbiota intestinal**: AGCC, indoles, fenoles, aminas biógenas y compuestos azufrados
- **Panel HTML interactivo** (DataTables) con filtros por condición, filtros por fuente, niveles de confianza del origen, **filtro Motivo_origen** (18 categorías, situado debajo de Confianza Origen) y exportación a CSV/Excel con un clic
- Conjunto de datos curado incluido: `outputs/MH_Biomarkers_Salud_Mental_CURADO.xlsx`, con **38 952 entradas** revisadas y anotadas a mano

---

## Fuentes de datos

| Prioridad | Fuente | Acceso | Tipo de evidencia |
|---|---|---|---|
| 1 | **MarkerDB 2.0** | Descarga pública completa (TSV/XML) | `biomarker_db` |
| 2 | **CTD** | `.tsv.gz` público (se descarga automáticamente) | `chemical-disease` |
| 3 | **Metabolomics Workbench** | API REST | `study_metabolite_list` |
| 4 | **MetaboLights** (EBI) | API REST + TSV ISA-Tab | `study_metabolite_list` |
| 5 | **Europe PMC** | API de búsqueda y de anotaciones | `text_mining` |
| 6 | **HMDB Feces** | XML local (descarga manual) | `fecal_catalog` |

---

| Columna | Descripción |
|---|---|
| `ID` | Identificador interno del metabolito |
| `Nombre canonico` | Nombre normalizado del compuesto |
| `InChIKey` / `CID` | Identificadores químicos estándar |
| `Condiciones` | Condiciones psiquiátricas (separadas por barras verticales) |
| `#C` / `#F` / `#L` | Número de condiciones / de fuentes / de vínculos |
| `Fuentes` | Fuentes de datos (separadas por comas) |
| `Matriz` | Pistas de la matriz biológica (plasma, heces, LCR…) |
| `Metodo` | Pistas del método analítico (LC-MS, GC-MS, RMN…) |
| `Evidencia` | Tipo de evidencia (conjunto de datos / minería de textos / catálogo) |
| `Volatilidad` | `VOC` / `No-volatil` / `Mixto` / `Desconocido` |
| `Vinculo Microbio.` | Vínculo con la microbiota intestinal: `Si` / `Posible` / `No` / `Desconocido` |
| `Tipo Vinculo` | Tipo de vínculo: producto bacteriano, transformación, marcador indirecto |
| `Flag_contaminante` | Indicador de contaminante |
| `Origen_probable` | Origen biológico más probable |
| `Origen_alternativos` | Hipótesis de origen alternativas |
| `Confianza_origen` | Confianza en el origen: `Alta` / `Media` / `Baja` |
| `Motivo_origen` | Justificación de la asignación del origen (18 categorías: *heurística metabolito*, *firma microbiana*, *aminoácido*, etc.); visible en el panel y filtrable desde el panel Motivo Origen |

---

## Estructura del proyecto

```
├── src/
│   ├── collect.py              # Orquestador de línea de comandos
│   ├── db.py                   # Esquema SQLite + CRUD
│   ├── normalize.py            # Normalización de nombres + deduplicación
│   ├── mh_export.py            # Exportación a CSV de biomarcadores de salud mental
│   ├── report_mhb.py           # Generador del panel HTML interactivo
│   ├── report.py               # Generador del informe general
│   ├── search.py               # Búsqueda aproximada de metabolitos (línea de comandos)
│   ├── pubchem.py              # Enriquecimiento con la API REST de PubChem
│   ├── cache.py                # Caché HTTP (7 días de vigencia, en disco)
│   ├── utils.py                # Reintentos HTTP + limitador de peticiones (token bucket)
│   ├── enrich.py               # Pasos de enriquecimiento posteriores a la recogida
│   ├── conditions.py           # Registro de palabras clave de condiciones psiquiátricas
│   ├── classify_compound.py    # Funciones auxiliares de clasificación de compuestos
│   └── matrix_parser.py        # Análisis de la matriz biológica
├── outputs/
│   └── MH_Biomarkers_Salud_Mental_CURADO.xlsx   # Conjunto de datos curado (incluido)
├── tests/
│   └── test_normalize.py
├── config.yaml                 # Configuración central
├── requirements.txt
└── LICENSE
```

---

## Licencia

MIT: ver [LICENSE](LICENSE).
