import voicelist from '../../json/voicelist.json';
import {TTS, leerMensajes, skipAudio, handleleermensaje } from './tts';

const voiceSelectContainer = document.getElementById('voiceSelectContainer');
const voiceSelect1option = document.getElementById('voiceSelect1');

Object.keys(voicelist).forEach((key) => {
  // console.log(key);
  const option = document.createElement('option');
  option.value = voicelist[key];
  // console.log(voicelist[key]);
  option.text = key;
  voiceSelect1option.appendChild(option);
});
voiceSelect1option.addEventListener('change', (e) => {
  console.log(e.target.value);
  handleleermensaje(e.target.value);
});

function populateVoiceList() {
  if (typeof speechSynthesis === "undefined") return;

  const voices = speechSynthesis.getVoices();
  const voiceSelect = document.getElementById("voiceSelect");
  console.log("populateVoiceList", voices);

  // Limpiar opciones anteriores
  voiceSelect.innerHTML = '';

  voices.forEach(voice => {
    const option = document.createElement("option");
    option.textContent = `${voice.name} (${voice.lang})`;
    option.setAttribute("data-lang", voice.lang);
    option.setAttribute("data-name", voice.name);
    voiceSelect.appendChild(option);
  });
}

// Función para verificar si las voces están disponibles
function checkVoices() {
  if (speechSynthesis.getVoices().length > 0) {
    clearInterval(voiceCheckInterval);
    populateVoiceList();
  }
}

// Verificar si las voces están disponibles al cargar la página
if (typeof speechSynthesis !== "undefined" && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

// Usar un intervalo para verificar si las voces están disponibles
const voiceCheckInterval = setInterval(checkVoices, 100);
