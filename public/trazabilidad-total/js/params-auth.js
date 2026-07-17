/* Protección operativa del panel Parámetros.
   Es una barrera de interfaz para un sitio estático, no autenticación de servidor. */

const KEY_HASH = '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4';
const SESSION_KEY = 'novopan-params-unlocked-until';
const UNLOCK_MS = 15 * 60 * 1000;

let dialogPromise = null;

function unlockedUntil() {
  try { return Number(sessionStorage.getItem(SESSION_KEY)) || 0; }
  catch { return 0; }
}

export function parametersAreUnlocked() {
  return Date.now() < unlockedUntil();
}

export function lockParameters() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch {}
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function buildDialog() {
  const dialog = document.createElement('dialog');
  dialog.className = 'params-auth';
  dialog.innerHTML = `
    <form method="dialog" class="params-auth__card">
      <div class="params-auth__icon"><span class="ms">lock</span></div>
      <div>
        <span class="params-auth__eyebrow">ACCESO RESTRINGIDO</span>
        <h2>Parámetros de calibración</h2>
        <p>Ingresa la clave para modificar metros, velocidades, caudales y tiempos. El acceso se mantiene 15 minutos en esta pestaña.</p>
      </div>
      <label>Clave
        <input type="password" name="key" autocomplete="current-password" required aria-describedby="paramsAuthFeedback" />
      </label>
      <p class="params-auth__feedback" id="paramsAuthFeedback" aria-live="polite"></p>
      <div class="params-auth__actions">
        <button type="button" class="btn btn--secondary" data-cancel>Cancelar</button>
        <button type="submit" class="btn btn--primary"><span class="ms">key</span> Desbloquear</button>
      </div>
    </form>`;
  document.body.appendChild(dialog);
  return dialog;
}

export function requestParametersAccess() {
  if (parametersAreUnlocked()) return Promise.resolve(true);
  if (dialogPromise) return dialogPromise;

  const dialog = document.querySelector('dialog.params-auth') || buildDialog();
  const form = dialog.querySelector('form');
  const input = dialog.querySelector('input[name="key"]');
  const feedback = dialog.querySelector('.params-auth__feedback');

  dialogPromise = new Promise((resolve) => {
    const finish = (ok) => {
      dialog.close();
      input.value = '';
      feedback.textContent = '';
      dialogPromise = null;
      resolve(ok);
    };

    const cancel = () => finish(false);
    dialog.querySelector('[data-cancel]').onclick = cancel;
    dialog.oncancel = (event) => { event.preventDefault(); cancel(); };
    form.onsubmit = async (event) => {
      event.preventDefault();
      const actual = await sha256(input.value);
      if (actual !== KEY_HASH) {
        feedback.textContent = 'Clave incorrecta.';
        input.select();
        return;
      }
      try { sessionStorage.setItem(SESSION_KEY, String(Date.now() + UNLOCK_MS)); } catch {}
      finish(true);
    };

    dialog.showModal();
    requestAnimationFrame(() => input.focus());
  });

  return dialogPromise;
}
