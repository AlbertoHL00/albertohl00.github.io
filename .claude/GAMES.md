# Catálogo de juegos

16 juegos en el hub (`index.html`). Todos activos salvo **Hitster**, deshabilitado con badge "Próximamente" (ver `.claude/HITSTER.md`).

| # | Juego | HTML | Tema | Fichero de datos | Esquema* | Paquetes/categorías hoy |
|---|-------|------|------|-------------------|----------|--------------------------|
| 1 | Impostor | `impostor.html` | red | `packages.json` (compartido) | A | 29 paquetes |
| 2 | Hombres Lobo | `hombres-lobo.html` | violet | `werewolf-roles.json` | D | 32 roles |
| 3 | Código Secreto | `codigo-secreto.html` | steel | `codigo-secreto-words.json` | B | 9 categorías |
| 4 | Time's Up | `times-up.html` | green | `packages.json` (compartido) | A | 29 paquetes |
| 5 | Verdad o Reto | `verdad-o-reto.html` | teal | `truth-or-dare.json` | C | 3 categorías (suave/fiesta/atrevido) |
| 6 | Mímica | `mimica.html` | amber | `packages.json` (compartido) | A | 29 paquetes |
| 7 | Yo Nunca | `yo-nunca.html` | gold | `yo-nunca.json` | B | 3 categorías |
| 8 | Picolo | `picolo.html` | orange | `picolo.json` | E | lista plana de cartas |
| 9 | Trivial Pursuit | `trivial.html` | lime | `trivial.json` | F | 6 categorías |
| 10 | Taboo | `tabu.html` | purple | `tabu.json` | G | 5 paquetes |
| 11 | ¿Quién es más probable? | `quien-es-mas-probable.html` | yellow | `quien-es-mas-probable.json` | B | 4 categorías |
| 12 | ¿Qué Harías Si...? | `que-harias-si.html` | indigo | `que-harias-si.json` | B | 4 categorías |
| 13 | ¿Qué Preferirías? | `que-preferirias.html` | cyan | `que-preferirias.json` | H | lista plana de opciones |
| 14 | Patata Caliente | `patata-caliente.html` | flame | `patata-caliente.json` | B | 10 categorías |
| 15 | Detective Club | `detective-club.html` | blue | — (sin JSON) | — | la palabra la escribe el jugador activo cada ronda, basada en una carta Dixit física; no hay banco de contenido que editar |
| 16 | Hitster | `hitster.html` | rose | `music-timeline.json` | I | 2 ediciones · 19-20 canciones cada una (contenido MUY escaso — por eso está deshabilitado) |

\* Letra de esquema = sección correspondiente en `.claude/ADDING_CONTENT.md`.

## Notas importantes

- **`packages.json` es compartido por 3 juegos**: Impostor, Time's Up y Mímica. Añadir un paquete ahí lo hace disponible en los tres a la vez (tiene sentido: los tres son "adivina la palabra/actúa la palabra" con el mismo banco de palabras). El campo `relacionadas` (mapa palabra → palabra parecida) solo lo usa Impostor, para el modo "pista" — Time's Up y Mímica lo ignoran si está, y no pasa nada si un paquete no lo tiene.
- **Detective Club** no tiene fichero de datos: usa cartas Dixit físicas + palabra que teclea el jugador activo. No hay "contenido" que ampliar aquí.
- **Hitster** es el único juego completamente funcional en código pero deshabilitado en el hub — el bloqueo es puramente de contenido (pocas canciones). Ver guía dedicada.
- Cada juego con JSON propio tiene también un array `..._FALLBACK` embebido en su `<script>` (ver `.claude/PROJECT.md` § Contenido dirigido por datos) — no hace falta tocarlo al añadir contenido normal.
