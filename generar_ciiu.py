import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

ARCHIVO_EXCEL = "ciiu.xlsx"
ARCHIVO_SALIDA = Path("src/data/ciiu.ts")

NS = {
    "m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
}

def corregir_texto(texto):
    texto = str(texto).strip()

    if "Ã" in texto:
        try:
            return texto.encode("latin1").decode("utf-8")
        except UnicodeError:
            return texto

    return texto


with zipfile.ZipFile(ARCHIVO_EXCEL) as z:

    # Shared strings
    shared_strings = []

    if "xl/sharedStrings.xml" in z.namelist():
        root_ss = ET.fromstring(z.read("xl/sharedStrings.xml"))

        for si in root_ss:
            texto = "".join(
                t.text or ""
                for t in si.iter("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t")
            )
            shared_strings.append(corregir_texto(texto))

    # Hoja principal
    root = ET.fromstring(z.read("xl/worksheets/sheet1.xml"))
    rows = root.findall(".//m:sheetData/m:row", NS)

    data = []

    for row in rows[1:]:
        valores = []

        for cell in row.findall("m:c", NS):
            v = cell.find("m:v", NS)

            if v is None:
                valores.append("")
                continue

            valor = v.text or ""

            if cell.attrib.get("t") == "s":
                valor = shared_strings[int(valor)]

            valores.append(corregir_texto(valor))

        if len(valores) >= 2:
            codigo = str(valores[0]).strip()
            descripcion = str(valores[1]).strip()

            if codigo or descripcion:
                data.append((codigo, descripcion))


ARCHIVO_SALIDA.parent.mkdir(parents=True, exist_ok=True)

with ARCHIVO_SALIDA.open("w", encoding="utf-8", newline="\n") as f:

    f.write("export interface CiiuItem {\n")
    f.write("  codigo: string;\n")
    f.write("  descripcion: string;\n")
    f.write("}\n\n")

    f.write("export const ciiuCatalog: CiiuItem[] = [\n")

    for codigo, descripcion in data:
        # Escapamos caracteres especiales de TypeScript
        codigo_ts = codigo.replace("\\", "\\\\").replace("'", "\\'")
        descripcion_ts = (
            descripcion
            .replace("\\", "\\\\")
            .replace("'", "\\'")
        )

        f.write(
            f"  {{ codigo: '{codigo_ts}', descripcion: '{descripcion_ts}' }},\n"
        )

    f.write("];\n")


print(f"GENERADO: {len(data)} registros")
print(f"ARCHIVO: {ARCHIVO_SALIDA}")

print("\n--- PRIMEROS 5 ---")
for codigo, descripcion in data[:5]:
    print(f"{codigo} | {descripcion}")

print("\n--- ULTIMOS 5 ---")
for codigo, descripcion in data[-5:]:
    print(f"{codigo} | {descripcion}")