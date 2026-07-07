# Inventario de URLs · SEO conservado 1:1

**Decisión (2026-07-07, Hernando):** el sitio nuevo es multipágina tipo
empresarial y **conserva las URLs de WordPress exactamente iguales**
(incluido el slug `/procedimientos-bariaticos/` tal cual está indexado).
No hay redirecciones de renombre.

| URL (idéntica en WordPress y Astro) | Página | Estado |
|---|---|---|
| `/` | Home | ✓ v0.1 aprobada |
| `/procedimientos-bariaticos/` | Procedimientos (bariátricos + laparoscopia) | ✓ v0.2 |
| `/soy-candidato/` | ¿Soy candidato? (calculadora IMC) | ✓ v0.2 |
| `/agendamiento-y-contacto/` | Agendamiento y contacto | ✓ v0.2 |
| `/dra-elika-luque-2/` | Bio de la Dra. | ✓ v0.2 |
| `/prevaloracion/` | Landing L1 | Pendiente (fase landings) |
| `/quiz/` | Landing L2 | Pendiente |
| `/seguridad/` | Landing L3 | Pendiente |
| `/balon-gastrico/` | Landing L4 | Pendiente |
| `/reflujo/` | Landing L5 | Pendiente |
| `/incluye-y-pagos/` | Landing L6 | Pendiente |
| `/hello-world/` | Post demo de WP | 301 → `/` (única redirección) |

## Medios
Mantener `/wp-content/uploads/` en el hosting nuevo (144 archivos,
lista en `media-urls.txt`) para no romper imágenes indexadas.
