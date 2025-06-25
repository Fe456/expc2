import { UpdateSenha } from './initPerfil.js';
import { MostrarSenha } from './domUtils.js';

export function initTrocarSenha() {
    document.querySelectorAll(".DivOlho").forEach(el => {
        el.addEventListener("click", MostrarSenha);
    });

    document.querySelector(".BtnSalvar")?.addEventListener("click", UpdateSenha);
}