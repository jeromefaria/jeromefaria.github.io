/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUDIO_BASE_URL?: string;
  readonly VITE_I18N?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
