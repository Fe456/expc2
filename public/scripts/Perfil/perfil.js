import { mascaraCPF } from './domUtils.js';
import { pegarDados, UpdateDados } from './initPerfil.js';
import { Cancelar, mudarCampos } from './UpdateUserData.js';

export function initPerfil() {
    // Ex: preencher os dados do usuário
    pegarDados();
    document.getElementById("mudarcampos").addEventListener("click", mudarCampos);
    document.getElementById("cpf").addEventListener("change", (e) => mascaraCPF(e.target));
    window.Cancelar = Cancelar;
    window.mudarCampos = mudarCampos;
    window.UpdateDados = UpdateDados;
}