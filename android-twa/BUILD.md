# Gerar APK para Google Play Store

## Pre-requisitos (uma vez)
```bash
npm install -g @bubblewrap/cli
```

## Gerar o projecto Android + APK
```bash
cd android-twa
bubblewrap init --manifest https://music.seteveus.space/manifest.json
```

O Bubblewrap vai perguntar:
- **Install JDK?** → Yes
- **Install Android SDK?** → Yes  
- **Package ID** → space.seteveus.music
- **App name** → Véus by Loranne
- **Launcher name** → Véus
- **Theme color** → #0D0D1A
- **Start URL** → /
- **Signing key password** → escolhe uma password segura e guarda-a!

Depois:
```bash
bubblewrap build
```

Isto gera:
- `app-release-bundle.aab` — para upload na Play Store
- `app-release-signed.apk` — para testar no telefone

## Depois do build

1. O Bubblewrap mostra o **SHA256 fingerprint** da signing key
2. Copia esse fingerprint
3. Edita `music-app/public/.well-known/assetlinks.json`
4. Substitui `__SHA256_FINGERPRINT_PLACEHOLDER__` pelo fingerprint
5. Faz deploy do site (para que o assetlinks.json fique acessivel)
6. Testa o APK no telefone

## Upload na Play Store

1. Vai a https://play.google.com/console
2. Cria conta de developer ($25 uma vez)
3. Cria nova app → preenche nome, descricao, screenshots
4. Upload do ficheiro `.aab`
5. Submete para revisao (~1-2 dias)

## Testar APK no telefone
```bash
adb install app-release-signed.apk
```
Ou envia o APK por email/WhatsApp e abre no telefone.
