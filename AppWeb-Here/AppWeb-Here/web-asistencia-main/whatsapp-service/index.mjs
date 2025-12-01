import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import express from 'express';
import qrcode from 'qrcode-terminal';

const app = express();
app.use(express.json());

let sock;

// Inicializar WhatsApp
async function iniciarWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth');

  sock = makeWASocket({
    printQRInTerminal: true,
    auth: state
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('Escanea este QR con WhatsApp:');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'open') {
      console.log('✅ WhatsApp conectado');
    } else if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode;
      console.log('⚠️ Conexión cerrada, motivo:', reason);
      if (reason !== DisconnectReason.loggedOut) {
        console.log('🔁 Reintentando conexión...');
        iniciarWhatsApp();
      } else {
        console.log('❌ Sesión cerrada, borra la carpeta auth y vuelve a iniciar.');
      }
    }
  });
}

// Endpoint para enviar mensaje de texto
app.post('/send', async (req, res) => {
  try {
    const { numero, mensaje } = req.body;

    if (!numero || !mensaje) {
      return res.status(400).json({ error: 'numero y mensaje son obligatorios' });
    }

    if (!sock) {
      return res.status(500).json({ error: 'Cliente de WhatsApp no inicializado' });
    }

    const jid = formatearNumero(numero); // ej: 51987654321 -> 51987654321@s.whatsapp.net

    await sock.sendMessage(jid, { text: mensaje });

    return res.json({ success: true });
  } catch (err) {
    console.error('Error enviando mensaje:', err);
    return res.status(500).json({ error: 'Error al enviar el mensaje' });
  }
});

// Health check
app.get('/health', (req, res) => {
  if (!sock) return res.status(500).json({ status: 'DOWN', reason: 'No socket' });
  return res.json({ status: 'UP' });
});

function formatearNumero(numero) {
  // Asumimos que ya viene con código de país, ej: 51...
  const limpio = String(numero).replace(/[^0-9]/g, '');
  return `${limpio}@s.whatsapp.net`;
}

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`🚀 WhatsApp service escuchando en http://localhost:${PORT}`);
  iniciarWhatsApp();
});
