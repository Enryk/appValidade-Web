// barcodeScanner.js - ValiData Camera Barcode Reader (Mobile-first, iOS Safari & Android Chrome)
window.validataScanner = {
    html5QrCode: null,
    ativo: false,

    beep: function() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1400, ctx.currentTime);
            gain.gain.setValueAtTime(0.25, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.12);
        } catch (e) {
            // áudio não permitido ou erro
        }
        if (navigator.vibrate) {
            try { navigator.vibrate(70); } catch(e) {}
        }
    },

    iniciar: async function(dotNetHelper, containerId) {
        await window.validataScanner.parar();
        window.validataScanner.ativo = true;

        // 1. Aguarda elemento container estar pronto no DOM
        let container = document.getElementById(containerId);
        let tentativas = 0;
        while (!container && tentativas < 25) {
            await new Promise(r => setTimeout(r, 100));
            container = document.getElementById(containerId);
            tentativas++;
        }

        if (!container) {
            console.error('[ValiData Scanner] Elemento container não encontrado no DOM:', containerId);
            return false;
        }

        // 2. Aguarda carregamento da biblioteca Html5Qrcode se necessário
        let libTentativas = 0;
        while (!window.Html5Qrcode && libTentativas < 20) {
            await new Promise(r => setTimeout(r, 100));
            libTentativas++;
        }

        if (!window.Html5Qrcode) {
            console.error('[ValiData Scanner] Biblioteca Html5Qrcode não encontrada.');
            return false;
        }

        try {
            // Limpa conteúdo anterior do container
            container.innerHTML = '';

            const formats = window.Html5QrcodeSupportedFormats ? [
                window.Html5QrcodeSupportedFormats.EAN_13,
                window.Html5QrcodeSupportedFormats.EAN_8,
                window.Html5QrcodeSupportedFormats.CODE_128,
                window.Html5QrcodeSupportedFormats.CODE_39,
                window.Html5QrcodeSupportedFormats.UPC_A,
                window.Html5QrcodeSupportedFormats.UPC_E,
                window.Html5QrcodeSupportedFormats.QR_CODE
            ] : undefined;

            const qr = new Html5Qrcode(containerId, {
                formatsToSupport: formats,
                verbose: false,
                experimentalFeatures: {
                    useBarCodeDetectorIfSupported: true
                }
            });

            window.validataScanner.html5QrCode = qr;

            const scanConfig = {
                fps: 15,
                qrbox: function(viewfinderWidth, viewfinderHeight) {
                    const w = Math.min(Math.floor(viewfinderWidth * 0.88), 340);
                    const h = Math.min(Math.floor(viewfinderHeight * 0.55), 180);
                    return { width: Math.max(w, 200), height: Math.max(h, 120) };
                },
                aspectRatio: 1.333333
            };

            const onScanSuccess = async (decodedText) => {
                if (decodedText && window.validataScanner.ativo) {
                    window.validataScanner.ativo = false;
                    window.validataScanner.beep();
                    await window.validataScanner.parar();
                    dotNetHelper.invokeMethodAsync('OnCodigoBarrasDetectado', decodedText.trim());
                }
            };

            const onScanFailure = (error) => {
                // Silencioso para frames sem código
            };

            // Inicia usando facingMode 'environment' (câmera traseira)
            try {
                await qr.start(
                    { facingMode: { ideal: 'environment' } },
                    scanConfig,
                    onScanSuccess,
                    onScanFailure
                );
            } catch (cameraErr) {
                console.warn('[ValiData Scanner] Tentando fallback para camera genérica:', cameraErr);
                await qr.start(
                    { facingMode: 'environment' },
                    scanConfig,
                    onScanSuccess,
                    onScanFailure
                );
            }

            // Garante que o elemento de vídeo gerado funcione perfeitamente no iOS Safari
            setTimeout(() => {
                const video = container.querySelector('video');
                if (video) {
                    video.setAttribute('playsinline', 'true');
                    video.setAttribute('webkit-playsinline', 'true');
                    video.muted = true;
                    video.autoplay = true;
                    video.style.width = '100%';
                    video.style.height = '100%';
                    video.style.objectFit = 'cover';
                    video.play().catch(() => {});
                }
            }, 100);

            return true;
        } catch (err) {
            console.error('[ValiData Scanner] Falha ao iniciar câmera:', err);
            window.validataScanner.parar();
            return false;
        }
    },

    parar: async function() {
        window.validataScanner.ativo = false;

        if (window.validataScanner.html5QrCode) {
            const qr = window.validataScanner.html5QrCode;
            window.validataScanner.html5QrCode = null;
            try {
                if (qr.isScanning) {
                    await qr.stop();
                }
                qr.clear();
            } catch (e) {
                // Silencioso se já parado
            }
        }
    }
};
