import { pegarDados } from './initPerfil.js';

export const Cancelar = () => {
    const btns = document.getElementById("btns");
    pegarDados().then(mudarCampos);
    btns.innerHTML =`<button type="button" class="mudarcampos" onclick="mudarCampos()">Mudar informações</button>`
}

export function mudarCampos () {
    console.log('ativou mudarcampos');
    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const dataNasc = document.getElementById('datanasc');
    const cpf = document.getElementById('cpf');
    const file = document.getElementById('file');
    const svg =  document.getElementById('svgFoto');
    const btns = document.getElementById("btns");
    nome.readOnly = !nome.readOnly;
    email.readOnly = !email.readOnly;
    dataNasc.readOnly = !dataNasc.readOnly;
    cpf.readOnly = !cpf.readOnly;
    file.disabled = !file.disabled;
    svg.style.display === 'block' ? svg.style.display = 'none' : svg.style.display = 'block';
    !nome.readOnly ? nome.style.border = "1px solid rgba(62, 62, 62, 1)" : nome.style.border = "1px solid rgba(62, 62, 62, 0.3)";
    !email.readOnly ? email.style.border = "1px solid rgba(62, 62, 62, 1)" : email.style.border = "1px solid rgba(62, 62, 62, 0.3)";
    !dataNasc.readOnly ? dataNasc.style.border = "1px solid rgba(62, 62, 62, 1)" : dataNasc.style.border = "1px solid rgba(62, 62, 62, 0.3)";
    !cpf.readOnly ? cpf.style.border = "1px solid rgba(62, 62, 62, 1)" : cpf.style.border = "1px solid rgba(62, 62, 62, 0.3)";
    btns.innerHTML = `<button type="button"  class="BtnCancelar" onclick="Cancelar()">Cancelar</button> <button type="button" class="BtnSalvar" onclick="UpdateDados()">Salvar</button>`
}

if (document.getElementById('cpf')) document.getElementById('cpf').addEventListener('input', function () {
    document.getElementById('cpf').style.border = '1px solid rgba(62, 62, 62, 1)';
});