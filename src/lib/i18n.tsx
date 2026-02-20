"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "es" | "en";

export const translations = {
  es: {
    app: {
      title: "Shelf Shuffler",
      slogan: "Transforma tu biblioteca digital de BoardGameGeek en un mazo de catálogo táctil y de alta calidad.",
      powered_by: "Impulsado por BoardGameGeek",
    },
    landing: {
      sync: {
        title: "1. Sincroniza",
        desc: "Conecta tu colección de BGG al instante.",
      },
      customize: {
        title: "2. Personaliza",
        desc: "Activa diseñadores, artistas y dificultad con capas de glassmorfismo.",
      },
      print: {
        title: "3. Imprime",
        desc: "Genera cuadrículas profesionales de 3x3 listas para fundas estándar de póker.",
      },
      get_started: "Empezar",
    },
    sidebar: {
      engine: "Motor de Personalización",
      anatomy: "Anatomía de la Carta",
      controls: {
        title: "Título del Juego",
        designer: "Diseñador",
        show_artist: "Mostrar Artista",
        show_weight: "Mostrar Peso",
        show_description: "Mostrar Descripción",
      },
      member: "Miembro",
      account_settings: "Cuenta",
      sign_out: "Salir",
      sign_in: "Entrar para Guardar",
      prepare_queue: "Preparar Cola de Impresión",
    },
    dashboard: {
      connect: "Conectar Biblioteca",
      sync_button: "Sincronizar Colección",
      refresh_collection: "Refrescar Colección",
      search_placeholder: "Buscar en la colección...",
      add_all: "Añadir Todo",
      clear_queue: "Limpiar Cola",
      library_label: "Biblioteca Autenticada",
      setup_desc: "Introduce tu usuario de BGG para comenzar.",
      username_placeholder: "Usuario de BGG",
      fetching_details: "Obteniendo Detalles...",
      analyzing_data: "Analizando datos del juego...",
      live_preview: "Vista Previa",
      live_preview_desc: "Personaliza la anatomía de tu mazo de catálogo.",
      select_game: "Selecciona un juego para profundizar",
      add_to_queue: "Añadir a la Cola",
      remove_from_queue: "Quitar de la Cola",
      sync_reminder: "¿Has añadido juegos nuevos a tu BGG? Pulsa refrescar para sincronizar.",
    },
    auth: {
      welcome: "BIENVENIDO",
      join: "ÚNETE AL MAZO",
      sign_in_desc: "Inicia sesión para gestionar tu colección",
      sign_up_desc: "Crea una cuenta para guardar tus mazos",
      google_button: "Continuar con Google",
      or: "O",
      email_label: "CORREO ELECTRÓNICO",
      password_label: "CONTRASEÑA",
      sign_in_button: "INICIAR SESIÓN",
      sign_up_button: "REGISTRARSE",
      register_button: "REGISTRAR CUENTA",
      new_to_app: "¿Nuevo en Shelf Shuffler?",
      already_have_account: "¿Ya tienes cuenta?",
      logging_in: "Accediendo...",
      signing_up: "Registrando...",
    },
    settings: {
      title: "Ajustes de Cuenta",
      bgg_label: "Usuario de BoardGameGeek",
      bgg_desc: "Cambiar esto refrescará instantáneamente tu biblioteca.",
      update_button: "Actualizar Perfil",
      updated: "Actualizado",
      email: "Correo Electrónico",
    },
    card: {
      players: "Jugadores",
      time: "Tiempo",
      complexity: "Peso",
      designer: "Diseño",
      artist: "Arte",
    }
  },
  en: {
    app: {
      title: "Shelf Shuffler",
      slogan: "Transform your digital BoardGameGeek library into a tactile, high-art Catalog Deck.",
      powered_by: "Powered by BoardGameGeek",
    },
    landing: {
      sync: {
        title: "1. Sync",
        desc: "Connect your BGG collection instantly.",
      },
      customize: {
        title: "2. Customize",
        desc: "Toggle designers, artists, and weights with glassmorphism overlays.",
      },
      print: {
        title: "3. Print",
        desc: "Generate professional 3x3 grids ready for standard poker sleeves.",
      },
      get_started: "Get Started",
    },
    sidebar: {
      engine: "Customization Engine",
      anatomy: "Card Anatomy",
      controls: {
        title: "Game Title",
        designer: "Designer",
        show_artist: "Show Artist",
        show_weight: "Show Weight",
        show_description: "Show Description",
      },
      member: "Member",
      account_settings: "Settings",
      sign_out: "Out",
      sign_in: "Sign In to Save",
      prepare_queue: "Prepare Print Queue",
    },
    dashboard: {
      connect: "Connect Library",
      sync_button: "Sync Collection",
      refresh_collection: "Refresh Collection",
      search_placeholder: "Search collection...",
      add_all: "Add All",
      clear_queue: "Clear Queue",
      library_label: "Authenticated Library",
      setup_desc: "Enter your BGG username to begin.",
      username_placeholder: "BGG Username",
      fetching_details: "Fetching Details...",
      analyzing_data: "Analyzing board game data...",
      live_preview: "Live Preview",
      live_preview_desc: "Customize your catalog deck card anatomy.",
      select_game: "Select a game to begin",
      add_to_queue: "Add to Queue",
      remove_from_queue: "Remove from Queue",
      sync_reminder: "Added new games to your BGG? Hit refresh to sync again.",
    },
    auth: {
      welcome: "WELCOME BACK",
      join: "JOIN THE DECK",
      sign_in_desc: "Sign in to manage your collection",
      sign_up_desc: "Create an account to save your decks",
      google_button: "Continue with Google",
      or: "OR",
      email_label: "EMAIL ADDRESS",
      password_label: "PASSWORD",
      sign_in_button: "SIGN IN",
      sign_up_button: "SIGN UP",
      register_button: "REGISTER ACCOUNT",
      new_to_app: "New to Shelf Shuffler?",
      already_have_account: "Already have an account?",
      logging_in: "Logging in...",
      signing_up: "Signing up...",
    },
    settings: {
      title: "Account Settings",
      bgg_label: "BoardGameGeek Username",
      bgg_desc: "Changing this will instantly refresh your collection view.",
      update_button: "Update Profile",
      updated: "Updated",
      email: "Email Address",
    },
    card: {
      players: "Players",
      time: "Time",
      complexity: "Weight",
      designer: "User",
      artist: "SwatchBook",
    }
  }
};

type ContextProps = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: any;
};

const I18nContext = createContext<ContextProps | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("es");

  useEffect(() => {
    const saved = localStorage.getItem("shelf-shuffle-lang") as Language;
    if (saved) setLang(saved);
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("shelf-shuffle-lang", newLang);
  };

  const t = translations[lang];

  return (
    <I18nContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useTranslation must be used within I18nProvider");
  return context;
}
