/* ============================================================
   Shared utilities for Impostor / Detective Club / Hombres Lobo
   ============================================================ */

function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

function escapeHtml(str){
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

/* player names carry over between game modes (Impostor / Hombres Lobo), persisted
   across sessions via localStorage */
var PLAYER_NAMES_STORAGE_KEY = 'gamehub.playerNames';

function loadSavedPlayerNames(){
  try {
    var arr = JSON.parse(localStorage.getItem(PLAYER_NAMES_STORAGE_KEY) || '[]');
    return Array.isArray(arr) ? arr.filter(function(n){ return typeof n === 'string' && n.trim(); }) : [];
  } catch (e){
    return [];
  }
}

function savePlayerNames(names){
  try {
    localStorage.setItem(PLAYER_NAMES_STORAGE_KEY, JSON.stringify(names));
  } catch (e){
    // storage unavailable (private mode, quota, etc.) — persistence is a nice-to-have, fail silently
  }
}

/* Hombres Lobo: the chosen role loadout (roleId -> count) carries over
   between matches the same way the player list does */
var ROLE_COUNTS_STORAGE_KEY = 'gamehub.werewolfRoleCounts';

function loadSavedRoleCounts(){
  try {
    var obj = JSON.parse(localStorage.getItem(ROLE_COUNTS_STORAGE_KEY) || '{}');
    return (obj && typeof obj === 'object') ? obj : {};
  } catch (e){
    return {};
  }
}

function saveRoleCounts(counts){
  try {
    localStorage.setItem(ROLE_COUNTS_STORAGE_KEY, JSON.stringify(counts));
  } catch (e){}
}

function hasDuplicatePlayerNames(rows){
  var seen = {};
  for (var i = 0; i < rows.length; i++){
    var n = rows[i].name.trim().toLowerCase();
    if (!n) continue;
    if (seen[n]) return true;
    seen[n] = true;
  }
  return false;
}

function shuffle(arr){
  for (var i = arr.length - 1; i > 0; i--){
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
  }
  return arr;
}

function buildRandomRoles(total, marked){
  var roles = [];
  for (var i = 0; i < total; i++) roles.push(i < marked);
  return shuffle(roles);
}

/* generic dismissible modal: click trigger to open, click backdrop/close/Escape to close */
function setupModal(triggerEl, backdropEl, closeEl){
  function open(){ backdropEl.classList.remove('hidden'); }
  function close(){ backdropEl.classList.add('hidden'); }
  triggerEl.addEventListener('click', open);
  closeEl.addEventListener('click', close);
  backdropEl.addEventListener('click', function(e){ if (e.target === backdropEl) close(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') close(); });
  return { open: open, close: close };
}

function popValue(el){
  el.classList.remove('pop');
  void el.offsetWidth;
  el.classList.add('pop');
}

/* progress dots under the reveal card */
function createDots(container){
  return {
    build: function(total){
      container.innerHTML = "";
      for (var i = 0; i < total; i++){
        var d = document.createElement('div');
        d.className = 'dot';
        container.appendChild(d);
      }
    },
    update: function(current){
      var dots = container.children;
      for (var i = 0; i < dots.length; i++){
        dots[i].className = 'dot' + (i < current ? ' done' : (i === current ? ' current' : ''));
      }
    }
  };
}

/* "back to hub" (home icon) needs a confirmation once a match is in progress —
   only the setup screen's home link is a plain, no-confirm navigation since
   there's no progress to lose there yet. Applies to every mode automatically:
   any a[aria-label="Inicio"] outside #screen-setup gets intercepted. */
function initHomeExitConfirm(){
  var links = document.querySelectorAll('a[aria-label="Inicio"]');
  if (!links.length) return;

  var backdrop = null, pendingHref = 'index.html';

  function buildModal(){
    if (backdrop) return;
    backdrop = document.createElement('div');
    backdrop.className = 'guide-modal-backdrop hidden';
    backdrop.id = 'home-confirm-backdrop';
    backdrop.innerHTML =
      '<div class="guide-modal">' +
        '<h2>¿Salir al inicio?</h2>' +
        '<p>Se perderá el progreso de la partida actual.</p>' +
        '<button type="button" class="btn-main" id="home-confirm-cancel-btn" style="margin-top:14px;">Seguir jugando</button>' +
        '<button type="button" class="night-nav-btn" id="home-confirm-exit-btn" style="width:100%; margin-top:10px;">Salir al inicio</button>' +
      '</div>';
    document.body.appendChild(backdrop);
    document.getElementById('home-confirm-cancel-btn').addEventListener('click', function(){
      backdrop.classList.add('hidden');
    });
    document.getElementById('home-confirm-exit-btn').addEventListener('click', function(){
      window.location.href = pendingHref;
    });
    backdrop.addEventListener('click', function(e){
      if (e.target === backdrop) backdrop.classList.add('hidden');
    });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape') backdrop.classList.add('hidden');
    });
  }

  Array.prototype.forEach.call(links, function(link){
    var screen = link.closest('.screen');
    if (!screen || screen.id === 'screen-setup') return;
    link.addEventListener('click', function(e){
      e.preventDefault();
      buildModal();
      pendingHref = link.getAttribute('href') || 'index.html';
      backdrop.classList.remove('hidden');
    });
  });
}
initHomeExitConfirm();

/* tap-to-reveal card: covers reveal-content with reveal-btn until tapped.
   showFor(isAlarm) re-covers instantly (no flash) and arms the optional
   danger-pulse border for the upcoming reveal; call it once per player,
   right after setting reveal-content's text/className for that player. */
function createRevealCard(wrap, content, btn, nextBtn){
  var MAX_FONT_REM = 1.7;
  var MIN_FONT_REM = 0.9;
  var pendingAlarm = false;

  function fitText(){
    content.style.fontSize = '';
    var size = MAX_FONT_REM;
    content.style.fontSize = size + 'rem';
    while (size > MIN_FONT_REM &&
      (content.scrollHeight > content.clientHeight ||
       content.scrollWidth > content.clientWidth)){
      size -= 0.1;
      content.style.fontSize = size.toFixed(2) + 'rem';
    }
  }

  function onReveal(){
    wrap.classList.add('revealed');
    fitText();
    if (pendingAlarm) wrap.classList.add('alarm');
    nextBtn.disabled = false;
  }

  btn.addEventListener('click', onReveal);

  return {
    showFor: function(isAlarm){
      pendingAlarm = !!isAlarm;
      // cover instantly (no fade) so the outgoing/incoming content never flashes through
      btn.style.transition = 'none';
      wrap.classList.remove('revealed');
      wrap.classList.remove('alarm');
      content.style.fontSize = '';
      void btn.offsetWidth; // force reflow to apply the no-transition cover
      btn.style.transition = '';
      nextBtn.disabled = true;
    }
  };
}
