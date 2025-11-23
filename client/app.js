// Global References
const messageForm = document.getElementById("messageForm");
const msgForm_message = document.getElementById("msgForm_message");
const messageFormResult = document.getElementById("messageFormResult");


// Message Form Placeholder Handle
const placeholderTexts = ["Tengo algo que decir…","¿Qué harías si nadie te juzga?","No sé si contarlo pero…","Tengo una duda rara…","Esto es anónimo ¿verdad?","Nunca dije esto a nadie…","¿Soy yo o…?","Creo que arruiné algo","Confesión rápida:","A veces me da pena admitir esto…","¿Está mal sentir esto?","Creo que estoy enamadx","Me pasó algo vergonzoso…","Esta historia es real","Si lo digo no me odies","Lo juro no fue mi culpa","A veces extraño algo raro","Spoiler: hice un desastre","¿Y si te cuento la verdad?","Shhh… nadie sabe esto","Ok… necesito consejo","Promete no reírte","Fue un accidente… creo","No sé si fue buena idea","Mi secreto más raro:","Debería haberlo dicho antes","Estoy nervios@ de escribir esto","Advertencia: cringe","Necesito ayuda","Tengo miedo de admitirlo","Ok… historia incómoda:","Esto solo pasa una vez","¿Tú también haces esto?","No sabía dónde más decirlo","Plot twist: fui yo","No sé cómo pasó pero pasó","Esto será raro","No sé si arrepentirme","¿Y si es normal?","Prometo que no es broma","Está raro pero real","No sé si estoy exagerando","Me pasó algo loco","Ok… contexto:","¿Te ha pasado algo así?","Confesión modo rápido:","No sé si contarlo todo","Esto puede sonar estúpido","Sin filtros:","Ok… aquí voy"];

const randomPlaceholderIndex = Math.floor(Math.random() * placeholderTexts.length);

msgForm_message.placeholder = placeholderTexts[randomPlaceholderIndex];


// Submit Message Handle
messageForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const formData = new FormData(messageForm);
    const payload = {
        msg: formData.get("msgForm_message")
    };

    msgForm_message.disabled = true;
    messageForm.elements.msgForm_submitBtn.disabled = true;

    messageFormResult.textContent = "Sending...";

    try {
        //await new Promise(resolve => setTimeout(resolve, 3000)); // <- Fake latency for testing
        
        const res = await fetch("../server/send_msg.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json().catch(() => null);
            messageFormResult.textContent = "Server error: " + (err?.message || res.statusText);
            return;
        }

        const data = await res.json();
        if (data.status === "success") {
            messageFormResult.textContent = data.message;
        } else {
            messageFormResult.textContent = (data.message || "Uknown error");
        }
    } catch (err) {
        console.error(err);
        messageFormResult.textContent = "Unable connect to server";
    } finally {
        msgForm_message.value = "";

        msgForm_message.disabled = false;
        messageForm.elements.msgForm_submitBtn.disabled = false;
    }
});