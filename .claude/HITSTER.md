# Hitster — estado y guía de activación

## Estado actual: código 100% terminado, contenido insuficiente

`hitster.html` **ya es un juego completo y jugable** — pantallas de setup (nombre de equipo, elegir ediciones, canciones para ganar), pantalla de partida (reproducir canción misteriosa, colocarla en la línea de tiempo del equipo, acertar/fallar, monedas y "canción regalada" al acumular 3), y pantalla final. Reutiliza `shared.css`/`shared.js` igual que el resto de juegos.

Lo único que le falta es **catálogo de canciones**: `music-timeline.json` hoy solo tiene 2 ediciones ("Éxitos en España" y "Éxitos Internacionales") con 19-20 canciones cada una. Es poco para que la línea de tiempo se sienta como el juego de mesa real (que trae cientos de cartas por edición). Por eso está marcado como "Próximamente" en el hub: el bloqueo es de **contenido**, no de desarrollo.

Puedes abrir `hitster.html` directamente en el navegador ahora mismo para probarlo — funciona igual esté o no enlazado desde el hub.

## Esquema de `music-timeline.json`

```json
{
  "ediciones": [
    {
      "id": "id_unico",
      "nombre": "Nombre visible de la edición",
      "icono": "🇪🇸",
      "canciones": [
        { "titulo": "Título", "artista": "Artista", "anio": 1997, "videoId": "YxFUwGaxKTo" }
      ]
    }
  ]
}
```

- `anio` es un número (no string) — es la clave por la que se ordena la línea de tiempo.
- `videoId` es el ID de un vídeo de YouTube: de una URL `https://www.youtube.com/watch?v=YxFUwGaxKTo` o `https://youtu.be/YxFUwGaxKTo`, el ID es `YxFUwGaxKTo`. El juego lo reproduce embebido vía `youtube-nocookie.com`, **sin mostrar vídeo ni título** (para no chafar la sorpresa) — solo suena el audio.
- Si una canción no tiene `videoId` (o el vídeo falla), aparece un enlace de repuesto que abre una búsqueda de YouTube con título+artista.
- Alternativa `archivo` (mp3 local, en vez de `videoId`): pon el nombre de fichero (ej. `"archivo": "mi_cancion.mp3"`) y colócalo en una carpeta `music/` en la raíz del repo (**esa carpeta no existe todavía** — créala si empiezas a usar audio local). Útil si algún día quieres canciones que no estén en YouTube. Hoy todo el catálogo usa `videoId`.

Para añadir canciones: añade objetos al array `canciones` de una edición existente, o una edición nueva entera al array `ediciones` (aparece sola en el selector de ediciones del setup). No hace falta tocar `hitster.html`.

No hay recomendación estricta de cuántas canciones por edición, pero para que la partida no repita canciones enseguida conviene apuntar a bastantes más de las ~10-20 que se pondrán como objetivo por partida — algo como 40-80 por edición da bastante variedad; el juego original tiene cientos por caja.

## Cómo desmarcarlo de "Próximamente"

Cuando el catálogo de canciones esté suficientemente ampliado, en `index.html` busca la tarjeta de Hitster (al final del `.mode-grid`):

**Antes:**
```html
<div class="card mode-card theme-rose disabled">
  <button type="button" class="mode-info-btn" aria-label="Descripción" data-icon="images/hub/hitster-logo.svg" data-color="#eeaed0" data-title="Hitster" data-desc="Un dispositivo por equipo: escuchad la canción y colocadla en vuestra línea de tiempo. Varias épocas y ediciones.">ⓘ</button>
  <span class="mode-card-link" aria-label="Hitster">
    <span class="mode-icon-badge" style="mask-image:url('images/hub/hitster-logo.svg');-webkit-mask-image:url('images/hub/hitster-logo.svg');"></span>
    <span class="coming-soon-badge">Próximamente</span>
  </span>
</div>
```

**Después** (mismo patrón que cualquier otra tarjeta activa, ej. Detective Club):
```html
<div class="card mode-card theme-rose">
  <button type="button" class="mode-info-btn" aria-label="Descripción" data-icon="images/hub/hitster-logo.svg" data-color="#eeaed0" data-title="Hitster" data-desc="Un dispositivo por equipo: escuchad la canción y colocadla en vuestra línea de tiempo. Varias épocas y ediciones.">ⓘ</button>
  <a href="hitster.html" class="mode-card-link" aria-label="Hitster">
    <span class="mode-icon-badge" style="mask-image:url('images/hub/hitster-logo.svg');-webkit-mask-image:url('images/hub/hitster-logo.svg');"></span>
  </a>
</div>
```

Tres cambios exactos:
1. Quitar la clase `disabled` del `<div class="card mode-card theme-rose disabled">`.
2. Cambiar el `<span class="mode-card-link" ...>` de apertura y su `</span>` de cierre por `<a href="hitster.html" class="mode-card-link" ...>` / `</a>`.
3. Borrar la línea `<span class="coming-soon-badge">Próximamente</span>`.

No hace falta tocar CSS (las reglas `.mode-card.disabled`/`.coming-soon-badge` en `index.html` se quedan definidas para usarse en el futuro con otro juego pendiente) ni tocar `hitster.html`.
