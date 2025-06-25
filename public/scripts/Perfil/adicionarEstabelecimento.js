import { adicionarLocalTop } from './NewEstabelecimento.js';
import { adicionarFoto, AnteriorFoto, ProximaFoto, DeletarFoto, mascaraCEP, mascaraTelefone, mascaraCNPJ, buscarCEP } from './domUtils.js';

export function initAdicionarEstabelecimento() {
    document.getElementById("fileEstabele")?.addEventListener("change", adicionarFoto);
    document.getElementById("prevImg")?.addEventListener("click", AnteriorFoto);
    document.getElementById("nextImg")?.addEventListener("click", ProximaFoto);
    document.getElementById("deleteImg")?.addEventListener("click", DeletarFoto);
    document.querySelector(".criarEstabelecimento")?.addEventListener("click", adicionarLocalTop);
    document.getElementById("telefone")?.addEventListener("input", function () {
        mascaraTelefone(this);
    });
    document.getElementById("cnpj")?.addEventListener("input", function () {
        mascaraCNPJ(this);
    });
    document.getElementById("cep")?.addEventListener("input", function () {
        mascaraCEP(this);
    });
    document.getElementById("buscarCEP")?.addEventListener("click", function () {
        buscarCEP(document.getElementById("cep").value);
    });
}