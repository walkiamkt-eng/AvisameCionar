import zipfile
import xml.etree.ElementTree as ET

ARCHIVO = "ciiu.xlsx"

NS = {
    "m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
}

def corregir_texto(texto):
    actual = texto

    # Intentar corregir sucesivas capas de mojibake.
    for _ in range(3):
        if "Ã" not in actual and "Â" not in actual:
            break

        try:
            nuevo = actual.encode("latin1").decode("utf-8")
        except UnicodeError:
            break

        if nuevo == actual:
            break

        actual = nuevo

    return actual


with zipfile.ZipFile(ARCHIVO) as z:

    # -------------------------
    # Shared strings
    # -------------------------
    ss = ET.fromstring(z.read("xl/sharedStrings.xml"))

    raw_strings = [
        "".join(t.text or "" for t in s.iter(
            "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t"
        ))
        for s in ss.findall("m:si", NS)
    ]

    strings = [corregir_texto(s) for s in raw_strings]

    # -------------------------
    # Worksheet
    # -------------------------
    sh = ET.fromstring(z.read("xl/worksheets/sheet1.xml"))

    rows_xml = sh.findall(".//m:sheetData/m:row", NS)

    data = []

    for row in rows_xml:
        valores = []

        for cell in row.findall("m:c", NS):
            v = cell.find("m:v", NS)

            if v is None:
                valores.append("")
            elif cell.get("t") == "s":
                valores.append(strings[int(v.text)])
            else:
                valores.append(v.text or "")

        data.append(valores)


# -------------------------
# Validación estructural
# -------------------------

print()
print("========================================")
print("VALIDACIÓN DEL CATÁLOGO CIIU")
print("========================================")
print()

print("ENCABEZADOS:", repr(data[0]))
print("REGISTROS:", len(data) - 1)
print("COLUMNAS POR FILA:", sorted(set(len(r) for r in data)))

rows = data[1:]

if any(len(r) != 2 for r in rows):
    print()
    print("ERROR: existen filas que no tienen exactamente 2 columnas.")
    for i, r in enumerate(rows, start=2):
        if len(r) != 2:
            print("Fila", i, repr(r))

codes = [r[0].strip() for r in rows]
descriptions = [r[1].strip() for r in rows]

print()
print("CÓDIGOS ÚNICOS:", len(set(codes)))
print("CÓDIGOS VACÍOS:", sum(not x for x in codes))
print("DESCRIPCIONES VACÍAS:", sum(not x for x in descriptions))
print("DUPLICADOS:", len(codes) - len(set(codes)))

# -------------------------
# Detectar restos de mojibake
# -------------------------

problemas = []

for numero, (codigo, descripcion) in enumerate(rows, start=2):

    texto = codigo + " " + descripcion

    if "Ã" in texto or "Â" in texto:
        problemas.append(
            (numero, codigo, descripcion)
        )

print()
print("REGISTROS CON POSIBLE CODIFICACIÓN INCORRECTA:", len(problemas))

if problemas:
    print()
    print("DETALLE:")
    for numero, codigo, descripcion in problemas[:30]:
        print(
            f"Fila {numero}: {codigo} | {descripcion}"
        )

    if len(problemas) > 30:
        print(f"... y {len(problemas) - 30} registros más.")

# -------------------------
# Muestra
# -------------------------

print()
print("PRIMEROS 10 REGISTROS:")
for r in rows[:10]:
    print(r[0], "|", r[1])

print()
print("ÚLTIMOS 10 REGISTROS:")
for r in rows[-10:]:
    print(r[0], "|", r[1])

print()
print("========================================")
print("FIN DE VALIDACIÓN")
print("========================================")
